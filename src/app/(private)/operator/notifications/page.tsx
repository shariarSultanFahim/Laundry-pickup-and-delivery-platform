"use client";

import { CheckCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

import Header from "../components/header";
import { markAllNotificationsAsRead } from "./components/notifications-api";
import NotificationsList from "./components/notifications-list";

export default function OperatorNotificationsPage() {
  async function handleMarkAllAsRead() {
    await markAllNotificationsAsRead();
  }

  return (
    <div className="space-y-6">
      <Header
        title="Notifications"
        subtitle="View and manage your notifications"
        Button={
          <Button onClick={handleMarkAllAsRead}>
            <CheckCheck /> Mark all as read
          </Button>
        }
      />

      <NotificationsList />
    </div>
  );
}
