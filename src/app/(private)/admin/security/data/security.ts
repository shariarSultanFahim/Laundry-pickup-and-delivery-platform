export interface SecurityStatCard {
  id: string;
  title: string;
  description: string;
  status: string;
  icon: string;
  iconBgColor: string;
  statusColor: string;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number; // in minutes
  passwordComplexity: boolean;
  loginNotifications: boolean;
}

export const securityStats: SecurityStatCard[] = [
  {
    id: "encryption",
    title: "Encryption",
    description: "AES-256 Enabled",
    status: "Active",
    icon: "lock",
    iconBgColor: "bg-green-100",
    statusColor: "text-green-600"
  },
  {
    id: "2fa-status",
    title: "2FA Status",
    description: "87% Users Enabled",
    status: "Enabled",
    icon: "bookmark",
    iconBgColor: "bg-blue-100",
    statusColor: "text-blue-600"
  },
  {
    id: "threats",
    title: "Threats",
    description: "Last 24 hours",
    status: "3 Alerts",
    icon: "alert-triangle",
    iconBgColor: "bg-yellow-100",
    statusColor: "text-yellow-600"
  },
  {
    id: "access-logs",
    title: "Access Logs",
    description: "Real-time tracking",
    status: "Monitoring",
    icon: "eye",
    iconBgColor: "bg-purple-100",
    statusColor: "text-purple-600"
  }
];

export const securitySettingsDefaults: SecuritySettings = {
  twoFactorAuth: true,
  sessionTimeout: 15,
  passwordComplexity: true,
  loginNotifications: true
};

export const sessionTimeoutOptions = [5, 10, 15, 30, 60] as const;
