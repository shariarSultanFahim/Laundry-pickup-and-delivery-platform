export interface ProfileInformation {
  fullName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  avatarUrl: string;
  avatarFile: File | null;
}

export interface NotificationItem {
  id: "emailNotifications" | "pushNotifications" | "smsNotifications";
  title: string;
  description: string;
}

export const profileInformationDefaultValues: ProfileInformation = {
  fullName: "Sarah Johnson",
  email: "sarah.johnson@company.com",
  phoneNumber: "+1 (555) 123-4567",
  jobTitle: "Product Manager",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  avatarFile: null
};

export const notificationPreferencesDefaultValues = {
  emailNotifications: true,
  pushNotifications: false,
  smsNotifications: true
};

export const workHoursDefaultValues = {
  startTime: "09:00",
  endTime: "17:00"
};

export const notificationItems: NotificationItem[] = [
  {
    id: "emailNotifications",
    title: "Email Notifications",
    description: "Receive notifications via email"
  },
  {
    id: "pushNotifications",
    title: "Push Notifications",
    description: "Receive push notifications"
  },
  {
    id: "smsNotifications",
    title: "SMS Notifications",
    description: "Receive text messages"
  }
];
