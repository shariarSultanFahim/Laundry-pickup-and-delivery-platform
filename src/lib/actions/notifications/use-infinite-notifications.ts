import { useInfiniteQuery } from "@tanstack/react-query";

import type { GetMyNotificationsResponse } from "@/types/notification";

import { api } from "@/lib/api";

import { notificationQueryKeys } from "./notification-query-keys";

const NOTIFICATIONS_PER_PAGE = 10;

export function useInfiniteNotifications(enabled = true) {
  return useInfiniteQuery({
    queryKey: notificationQueryKeys.infinite,
    enabled,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<GetMyNotificationsResponse>("/notification/my-notifications", {
        params: {
          page: pageParam,
          limit: NOTIFICATIONS_PER_PAGE
        }
      });

      return data;
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPage } = lastPage.meta;
      return page < totalPage ? page + 1 : undefined;
    }
  });
}
