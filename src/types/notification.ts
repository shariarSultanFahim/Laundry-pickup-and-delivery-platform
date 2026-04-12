export type NotificationChannel = "IN_APP" | "EMAIL" | "SMS" | "PUSH";

export type NotificationType = "SYSTEM" | "PROMOTION" | "ORDER" | "PAYMENT" | "GENERAL";

export interface NotificationItem {
  id: string;
  userId: string | null;
  operatorId: string | null;
  title: string;
  message: string;
  channel: NotificationChannel;
  type: NotificationType;
  isSent: boolean;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPaginationMeta {
  total: number;
  totalPage: number;
  page: number;
  limit: number;
}

export interface GetMyNotificationsResponse {
  success: boolean;
  message: string;
  meta: NotificationPaginationMeta;
  data: NotificationItem[];
}

export interface MarkNotificationAsReadResponse {
  success: boolean;
  message: string;
}

export interface MarkAllNotificationsAsReadResponse {
  success: boolean;
  message: string;
}
