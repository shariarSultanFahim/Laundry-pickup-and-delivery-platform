import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  GetMyNotificationsResponse,
  MarkAllNotificationsAsReadResponse
} from "@/types/notification";

import { api } from "@/lib/api";

import { notificationQueryKeys } from "./notification-query-keys";

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch<MarkAllNotificationsAsReadResponse>(
        "/notification/mark-all-read"
      );
      return data;
    },
    onSuccess: () => {
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
              data: page.data.map((notification) => ({ ...notification, isRead: true }))
            }))
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadIndicator });
    }
  });
}
