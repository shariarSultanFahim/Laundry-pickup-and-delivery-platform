"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui";

import { defaultNotifications, type Notification } from "../data/notifications";
import NotificationItem from "./notification-item";

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleDelete(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  if (notifications.length === 0) {
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
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDelete={handleDelete}
          />
        ))}
      </CardContent>
    </Card>
  );
}
