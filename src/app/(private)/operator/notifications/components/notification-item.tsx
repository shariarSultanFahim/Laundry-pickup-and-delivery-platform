"use client";

import { X } from "lucide-react";

import { notificationTypeConfig, type Notification } from "../data/notifications";
import { deleteNotification } from "./notifications-api";

interface NotificationItemProps {
  notification: Notification;
  onDelete?: (id: string) => void;
}

export default function NotificationItem({ notification, onDelete }: NotificationItemProps) {
  const config = notificationTypeConfig[notification.type] ?? notificationTypeConfig.info;
  const NotificationIcon = config.icon;

  async function handleDelete() {
    await deleteNotification(notification.id);
    onDelete?.(notification.id);
  }

  return (
    <div
      className={`rounded-lg border-border p-4 relative border transition-all ${config.bgColor} ${
        !notification.read ? "shadow-sm" : ""
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
        <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>

        <div className="mt-2 gap-2 flex items-center">
          <span className={`text-xs font-semibold inline-flex ${config.badgeColor}`}>
            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
        </div>
      </div>

      {/* Right indicator and actions */}
      <div className="gap-2 flex shrink-0 items-start">
        <div
          className={`size-2.5 mt-1.5 rounded-full ${
            notification.type === "success"
              ? "bg-green-600"
              : notification.type === "info"
                ? "bg-blue-600"
                : notification.type === "warning"
                  ? "bg-orange-600"
                  : "bg-red-600"
          }`}
        />

        <button
          type="button"
          onClick={handleDelete}
          className="text-muted-foreground hover:text-foreground p-1 transition-colors"
          aria-label="Delete notification"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
