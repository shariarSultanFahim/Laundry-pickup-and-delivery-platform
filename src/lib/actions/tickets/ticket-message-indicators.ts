"use client";

import { useCallback, useEffect, useMemo } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  GetUnreadTicketMessagesResponse,
  MarkChatRoomAsReadResponse,
  TicketChatMessageEvent,
  UnreadTicketMessageCount
} from "@/types/ticket-management";

import { api, get } from "@/lib/api";

import { useSocket } from "@/providers/SocketProvider";

export const ticketMessageIndicatorQueryKeys = {
  activeRoom: ["ticket-message-indicators", "active-room"] as const,
  unreadCounts: ["ticket-message-indicators", "unread-counts"] as const
};

const ticketsQueryKey = ["tickets"] as const;

function getRoomIdFromEvent(event: TicketChatMessageEvent): string | null {
  if (!event) {
    return null;
  }

  if (typeof event === "object") {
    if ("roomId" in event && typeof event.roomId === "string") {
      return event.roomId;
    }

    if ("chatRoomId" in event && typeof event.chatRoomId === "string") {
      return event.chatRoomId;
    }

    if ("message" in event) {
      return getRoomIdFromEvent(event.message);
    }

    if ("data" in event) {
      return getRoomIdFromEvent(event.data);
    }
  }

  return null;
}

function removeUnreadRoomCount(
  currentData: GetUnreadTicketMessagesResponse | undefined,
  roomId: string
) {
  if (!currentData) {
    return currentData;
  }

  const roomCount = currentData.data.find((item) => item.roomId === roomId);

  if (!roomCount) {
    return currentData;
  }

  return {
    ...currentData,
    meta: {
      ...currentData.meta,
      total: Math.max(0, currentData.meta.total - roomCount.unreadMessageCount)
    },
    data: currentData.data.filter((item) => item.roomId !== roomId)
  } satisfies GetUnreadTicketMessagesResponse;
}

export function TicketMessageListener() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleNewMessage = (event: TicketChatMessageEvent) => {
      const roomId = getRoomIdFromEvent(event);

      if (!roomId) {
        void queryClient.invalidateQueries({ queryKey: ticketsQueryKey });
        void queryClient.invalidateQueries({
          queryKey: ticketMessageIndicatorQueryKeys.unreadCounts
        });
        return;
      }

      const activeRoomId = queryClient.getQueryData<string | null>(
        ticketMessageIndicatorQueryKeys.activeRoom
      );

      void queryClient.invalidateQueries({ queryKey: ["chat-messages", roomId] });
      void queryClient.invalidateQueries({ queryKey: ticketsQueryKey });
      void queryClient.invalidateQueries({
        queryKey: ticketMessageIndicatorQueryKeys.unreadCounts
      });

      if (activeRoomId === roomId) {
        return;
      }
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [queryClient, socket]);

  return null;
}

export function useTicketUnreadIndicators() {
  const queryClient = useQueryClient();

  const unreadCountsQuery = useQuery({
    queryKey: ticketMessageIndicatorQueryKeys.unreadCounts,
    queryFn: () => get<GetUnreadTicketMessagesResponse>("/chatmessage/admin/unread-messages")
  });

  const unreadMessageCounts = unreadCountsQuery.data?.data ?? [];
  const unreadCountByRoomId = useMemo(() => {
    return new Map<string, number>(
      unreadMessageCounts.map((item: UnreadTicketMessageCount) => [
        item.roomId,
        item.unreadMessageCount
      ])
    );
  }, [unreadMessageCounts]);

  const markRoomAsRead = useCallback(
    (roomId: string) => {
      queryClient.setQueryData<GetUnreadTicketMessagesResponse>(
        ticketMessageIndicatorQueryKeys.unreadCounts,
        (current) => removeUnreadRoomCount(current, roomId)
      );

      void queryClient.invalidateQueries({
        queryKey: ticketMessageIndicatorQueryKeys.unreadCounts
      });
    },
    [queryClient]
  );

  const setActiveRoom = useCallback(
    (roomId: string | null) => {
      queryClient.setQueryData<string | null>(ticketMessageIndicatorQueryKeys.activeRoom, roomId);
    },
    [queryClient]
  );

  const hasUnreadForRoom = useCallback(
    (roomId?: string | null) => Boolean(roomId && (unreadCountByRoomId.get(roomId) ?? 0) > 0),
    [unreadCountByRoomId]
  );

  const getUnreadCountForRoom = useCallback(
    (roomId?: string | null) => {
      if (!roomId) {
        return 0;
      }

      return unreadCountByRoomId.get(roomId) ?? 0;
    },
    [unreadCountByRoomId]
  );

  return {
    unreadMessageCounts,
    totalUnreadCount: unreadCountsQuery.data?.meta.total ?? 0,
    hasUnread: (unreadCountsQuery.data?.meta.total ?? 0) > 0,
    hasUnreadForRoom,
    getUnreadCountForRoom,
    markRoomAsRead,
    setActiveRoom
  };
}

export function useMarkChatRoomAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      const { data } = await api.patch<MarkChatRoomAsReadResponse>(
        `/chatmessage/${roomId}/mark-read`
      );

      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ticketMessageIndicatorQueryKeys.unreadCounts
      });
      await queryClient.invalidateQueries({ queryKey: ["tickets"] });
    }
  });
}
