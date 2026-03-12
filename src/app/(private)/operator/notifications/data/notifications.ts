import type { LucideIcon } from "lucide-react";
import { BadgeInfo, CircleAlert, CircleCheck, CircleX } from "lucide-react";

export type NotificationType = "success" | "info" | "warning" | "error";

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
}

export const notificationTypeConfig: Record<
  NotificationType,
  { bgColor: string; textColor: string; badgeColor: string; icon: LucideIcon }
> = {
  success: {
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    badgeColor: "text-green-600",
    icon: CircleCheck
  },
  info: {
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    badgeColor: "text-blue-600",
    icon: BadgeInfo
  },
  warning: {
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    badgeColor: "text-orange-600",
    icon: CircleAlert
  },
  error: {
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    badgeColor: "text-red-600",
    icon: CircleX
  }
};

export const defaultNotifications: Notification[] = [
  {
    id: "1",
    title: "Order #12345 has been delivered successfully",
    description: "Your package was delivered to the front door",
    type: "success",
    timestamp: "2 hours ago",
    read: false
  },
  {
    id: "2",
    title: "System maintenance scheduled",
    description: "Maintenance will begin at 2:00 AM EST tomorrow",
    type: "info",
    timestamp: "4 hours ago",
    read: false
  },
  {
    id: "3",
    title: "Storage space running low",
    description: "You have used 85% of your storage quota",
    type: "warning",
    timestamp: "6 hours ago",
    read: false
  },
  {
    id: "4",
    title: "Payment failed for subscription",
    description: "Please update your payment method to continue service",
    type: "error",
    timestamp: "1 day ago",
    read: false
  },
  {
    id: "5",
    title: "New team member joined",
    description: "Sarah Johnson has joined your development team",
    type: "info",
    timestamp: "2 days ago",
    read: false
  },
  {
    id: "6",
    title: "Payment received successfully",
    description: "Invoice #INV-2024-001 has been paid",
    type: "success",
    timestamp: "3 days ago",
    read: false
  },
  {
    id: "7",
    title: "New feature available",
    description: "Check out our latest dashboard improvements",
    type: "info",
    timestamp: "1 week ago",
    read: false
  }
];
