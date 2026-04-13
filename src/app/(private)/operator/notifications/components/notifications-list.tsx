"use client";

import { useEffect, useMemo, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { notificationQueryKeys } from "@/lib/actions/notifications/notification-query-keys";
import { useInfiniteNotifications } from "@/lib/actions/notifications/use-infinite-notifications";
import { useMarkNotificationRead } from "@/lib/actions/notifications/use-mark-notification-read";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui";
import { useSocket } from "@/providers";

import NotificationItem from "./notification-item";

export default function NotificationsList() {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const socket = useSocket();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteNotifications();
  const { mutateAsync: markNotificationRead } = useMarkNotificationRead();

  const notifications = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  useEffect(() => {
    if (!loadMoreRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
  }

  if (!isLoading && notifications.length === 0) {
    return (
      <Card>
        <CardContent className="pt-20 pb-20 text-center">
          <p className="text-muted-foreground">No notifications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Recent Notifications
            {unreadCount > 0 && (
              <span className="ml-2 bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 inline-flex items-center rounded-full">
                {unreadCount} new
              </span>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading notifications...</p>
        ) : null}

        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkRead={handleMarkRead}
          />
        ))}

        {isFetchingNextPage ? (
          <p className="text-sm text-muted-foreground">Loading more notifications...</p>
        ) : null}

        <div ref={loadMoreRef} className="h-1" />
      </CardContent>
    </Card>
  );
}
