import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  GetMyNotificationsResponse,
  MarkNotificationAsReadResponse
} from "@/types/notification";

import { api } from "@/lib/api";

import { notificationQueryKeys } from "./notification-query-keys";

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data } = await api.patch<MarkNotificationAsReadResponse>(
        `/notification/${notificationId}/mark-read`
      );
      return { data, notificationId };
    },
    onSuccess: async (_, notificationId) => {
      queryClient.setQueryData<InfiniteData<GetMyNotificationsResponse>>(
        notificationQueryKeys.infinite,
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            pages: current.pages.map((page) => ({
              ...page,
              data: page.data.map((notification) =>
                notification.id === notificationId
                  ? { ...notification, isRead: true }
                  : notification
              )
            }))
          };
        }
      );

      await queryClient.invalidateQueries({ queryKey: notificationQueryKeys.infinite });
      await queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadIndicator });
    }
  });
}
