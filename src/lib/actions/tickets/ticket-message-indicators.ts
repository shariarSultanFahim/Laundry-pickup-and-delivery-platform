"use client";

import { useCallback, useEffect } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { TicketChatMessageEvent } from "@/types/ticket-management";

import { useSocket } from "@/providers/SocketProvider";

export const ticketMessageIndicatorQueryKeys = {
  activeRoom: ["ticket-message-indicators", "active-room"] as const,
  unreadRooms: ["ticket-message-indicators", "unread-rooms"] as const
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

function addUnreadRoomId(currentRoomIds: string[] | undefined, roomId: string) {
  const roomIds = currentRoomIds ?? [];

  if (roomIds.includes(roomId)) {
    return roomIds;
  }

  return [...roomIds, roomId];
}

function removeUnreadRoomId(currentRoomIds: string[] | undefined, roomId: string) {
  return (currentRoomIds ?? []).filter((currentRoomId) => currentRoomId !== roomId);
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
        return;
      }

      const activeRoomId = queryClient.getQueryData<string | null>(
        ticketMessageIndicatorQueryKeys.activeRoom
      );

      void queryClient.invalidateQueries({ queryKey: ["chat-messages", roomId] });
      void queryClient.invalidateQueries({ queryKey: ticketsQueryKey });

      if (activeRoomId === roomId) {
        return;
      }

      queryClient.setQueryData<string[]>(ticketMessageIndicatorQueryKeys.unreadRooms, (current) =>
        addUnreadRoomId(current, roomId)
      );
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

  const unreadRoomsQuery = useQuery({
    queryKey: ticketMessageIndicatorQueryKeys.unreadRooms,
    queryFn: async () => [] as string[],
    enabled: false,
    initialData: [] as string[]
  });

  const unreadRoomIds = unreadRoomsQuery.data ?? [];

  const markRoomAsRead = useCallback(
    (roomId: string) => {
      queryClient.setQueryData<string[]>(ticketMessageIndicatorQueryKeys.unreadRooms, (current) =>
        removeUnreadRoomId(current, roomId)
      );
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
    (roomId?: string | null) => Boolean(roomId && unreadRoomIds.includes(roomId)),
    [unreadRoomIds]
  );

  return {
    unreadRoomIds,
    hasUnread: unreadRoomIds.length > 0,
    hasUnreadForRoom,
    markRoomAsRead,
    setActiveRoom
  };
}
