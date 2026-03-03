export interface ProfileInformation {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  avatarUrl: string;
  avatarFile: File | null;
}

export interface NotificationItem {
  id: "emailNotifications" | "pushNotifications" | "smsNotifications" | "weeklyReports";
  title: string;
  description: string;
  icon: "mail" | "smartphone" | "message-square" | "chart-no-axes-column";
  iconBgClass: string;
}

export interface SessionDevice {
  id: string;
  deviceName: string;
  deviceType: "Current Device" | "Mobile Device" | "Tablet";
  lastActive: string;
  isCurrent: boolean;
}

export const profileInformationDefaultValues: ProfileInformation = {
  fullName: "Shariar Fahim",
  email: "shariar.fahim@adminhub.com",
  phoneNumber: "+1 (555) 123-4567",
  role: "Super Administrator",
  avatarUrl:
    "https://media.licdn.com/dms/image/v2/D5603AQF8VWtOZX4cyA/profile-displayphoto-crop_800_800/B56ZoGTUgUJ4AM-/0/1761042323122?e=1773878400&v=beta&t=vPGLXeorVP2ikZACdWsBZN_u_Me7DlXjQSTTBWtG6tY",
  avatarFile: null
};

export const notificationPreferencesDefaultValues = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  weeklyReports: true
};

export const notificationItems: NotificationItem[] = [
  {
    id: "emailNotifications",
    title: "Email Notifications",
    description: "Receive updates and alerts via email",
    icon: "mail",
    iconBgClass: "bg-blue-100"
  },
  {
    id: "pushNotifications",
    title: "Push Notifications",
    description: "Get instant alerts on your device",
    icon: "smartphone",
    iconBgClass: "bg-purple-100"
  },
  {
    id: "smsNotifications",
    title: "SMS Notifications",
    description: "Receive critical alerts via text message",
    icon: "message-square",
    iconBgClass: "bg-green-100"
  },
  {
    id: "weeklyReports",
    title: "Weekly Reports",
    description: "Get weekly summary of system activities",
    icon: "chart-no-axes-column",
    iconBgClass: "bg-orange-100"
  }
];

export const activeSessions: SessionDevice[] = [
  {
    id: "desktop-chrome",
    deviceName: "Desktop - Chrome",
    deviceType: "Current Device",
    lastActive: "Active Now",
    isCurrent: true
  },
  {
    id: "iphone",
    deviceName: "iPhone 14 Pro",
    deviceType: "Mobile Device",
    lastActive: "2 hours ago",
    isCurrent: false
  },
  {
    id: "ipad",
    deviceName: "iPad Pro",
    deviceType: "Tablet",
    lastActive: "1 day ago",
    isCurrent: false
  }
];
