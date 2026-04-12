export interface ProfileInformation {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  avatarUrl: string;
  avatarFile: File | null;
}

export interface NotificationItem {
  id: "email" | "push" | "sms";
  title: string;
  description: string;
  icon: "mail" | "smartphone" | "message-square";
  iconBgClass: string;
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
  email: true,
  push: true,
  sms: false
};

export const notificationItems: NotificationItem[] = [
  {
    id: "email",
    title: "Email Notifications",
    description: "Receive updates and alerts via email",
    icon: "mail",
    iconBgClass: "bg-blue-100"
  },
  {
    id: "push",
    title: "Push Notifications",
    description: "Get instant alerts on your device",
    icon: "smartphone",
    iconBgClass: "bg-purple-100"
  },
  {
    id: "sms",
    title: "SMS Notifications",
    description: "Receive critical alerts via text message",
    icon: "message-square",
    iconBgClass: "bg-green-100"
  }
];

