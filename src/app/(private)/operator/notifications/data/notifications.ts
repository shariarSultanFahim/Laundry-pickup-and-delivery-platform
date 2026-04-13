import type { LucideIcon } from "lucide-react";
import { BadgeInfo, CircleAlert, CircleCheck, CircleX } from "lucide-react";

import type { NotificationType } from "@/types/notification";

export const notificationTypeConfig: Record<
  NotificationType,
  { bgColor: string; textColor: string; badgeColor: string; icon: LucideIcon }
> = {
  SYSTEM: {
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    badgeColor: "text-green-600",
    icon: CircleCheck
  },
  PROMOTION: {
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    badgeColor: "text-blue-600",
    icon: BadgeInfo
  },
  ORDER: {
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    badgeColor: "text-orange-600",
    icon: CircleAlert
  },
  PAYMENT: {
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    badgeColor: "text-red-600",
    icon: CircleX
  },
  GENERAL: {
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    badgeColor: "text-red-600",
    icon: CircleX
  }
};
