import { useEffect } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { GetMyNotificationsResponse } from "@/types/notification";

import { api } from "@/lib/api";

import { useSocket } from "@/providers";

import { notificationQueryKeys } from "./notification-query-keys";

export function useUnreadNotificationsIndicator() {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const unreadQuery = useQuery({
    queryKey: notificationQueryKeys.unreadIndicator,
    queryFn: async () => {
      const { data } = await api.get<GetMyNotificationsResponse>("/notification/my-notifications", {
        params: {
          page: 1,
          limit: 100
        }
      });

      return data.data.filter((notification) => !notification.isRead).length;
    }
  });

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleNewNotification = () => {
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.infinite });
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadIndicator });
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [socket, queryClient]);

  return {
    unreadCount: unreadQuery.data ?? 0,
    hasUnread: (unreadQuery.data ?? 0) > 0,
    isLoading: unreadQuery.isLoading
  };
}
