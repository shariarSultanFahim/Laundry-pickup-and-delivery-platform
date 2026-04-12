"use client";

import { CheckCheck } from "lucide-react";
import { toast } from "sonner";

import { useMarkAllNotificationsRead } from "@/lib/actions/notifications/use-mark-all-notifications-read";

import { Button } from "@/components/ui/button";

import Header from "../components/header";
import NotificationsList from "./components/notifications-list";

export default function NotificationPage() {
  const { mutateAsync: markAllRead, isPending } = useMarkAllNotificationsRead();

  async function handleMarkAllAsRead() {
    try {
      await markAllRead();
      toast.success("All notifications marked as read", {
        position: "top-center"
      });
    } catch {
      toast.error("Failed to mark all notifications as read", {
        position: "top-center"
      });
    }
  }

  return (
    <div className="space-y-6">
      <Header
        title="Notifications & Alerts"
        subtitle="Manage system notifications and user alerts"
        Button={
          <Button onClick={handleMarkAllAsRead} disabled={isPending}>
            <CheckCheck /> Mark all as read
          </Button>
        }
      />

      <NotificationsList />
    </div>
  );
}
