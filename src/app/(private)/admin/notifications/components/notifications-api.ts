"use client";

import { toast } from "sonner";

export async function markNotificationAsRead(notificationId: string) {
  try {
    console.log("Mark notification as read:", notificationId);
    await new Promise((resolve) => setTimeout(resolve, 300));
    toast.success("Notification marked as read", {
      position: "top-center"
    });
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    toast.error("Failed to mark notification as read", {
      position: "top-center"
    });
    throw error;
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    console.log("Delete notification:", notificationId);
    await new Promise((resolve) => setTimeout(resolve, 300));
    toast.success("Notification deleted", {
      position: "top-center"
    });
  } catch (error) {
    console.error("Failed to delete notification:", error);
    toast.error("Failed to delete notification", {
      position: "top-center"
    });
    throw error;
  }
}

export async function markAllNotificationsAsRead() {
  try {
    console.log("Mark all notifications as read");
    await new Promise((resolve) => setTimeout(resolve, 300));
    toast.success("All notifications marked as read", {
      position: "top-center"
    });
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    toast.error("Failed to mark all notifications as read", {
      position: "top-center"
    });
    throw error;
  }
}

export async function clearAllNotifications() {
  try {
    console.log("Clear all notifications");
    await new Promise((resolve) => setTimeout(resolve, 300));
    toast.success("All notifications cleared", {
      position: "top-center"
    });
  } catch (error) {
    console.error("Failed to clear all notifications:", error);
    toast.error("Failed to clear all notifications", {
      position: "top-center"
    });
    throw error;
  }
}
