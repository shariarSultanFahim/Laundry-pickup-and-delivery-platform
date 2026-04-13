"use client";

import type { NotificationItem as Notification } from "@/types/notification";

import { notificationTypeConfig } from "../data/notifications";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => Promise<void>;
}

export default function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const config = notificationTypeConfig[notification.type] ?? notificationTypeConfig.GENERAL;
  const NotificationIcon = config.icon;

  async function handleClick() {
    if (notification.isRead) {
      return;
    }

    await onMarkRead?.(notification.id);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          void handleClick();
        }
      }}
      className={`rounded-lg border-border p-4 relative border transition-all ${config.bgColor} ${
        !notification.isRead ? "shadow-sm" : ""
      } gap-4 flex items-start`}
    >
      {/* Icon */}
      <div
        className={`size-10 flex shrink-0 items-center justify-center rounded-full ${config.textColor}`}
      >
        <NotificationIcon className="size-5" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-foreground">{notification.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>

        <div className="mt-2 gap-2 flex items-center">
          <span className={`text-xs font-semibold inline-flex ${config.badgeColor}`}>
            {notification.type}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">
            {new Date(notification.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Right indicator and actions */}
      <div className="gap-2 flex shrink-0 items-start">
        {!notification.isRead ? <div className="size-2.5 mt-1.5 bg-blue-600 rounded-full" /> : null}
      </div>
    </div>
  );
}
