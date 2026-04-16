export interface UserManagementUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "operator" | "admin";
  status: "active" | "inactive" | "suspended";
  statusNote?: string;
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
}

export interface UserStats {
  title: string;
  value: string;
  subtitle: string;
  trend: "up" | "down";
}

export interface RoleDistributionItem {
  role: string;
  users: number;
}

export interface GrowthTrendItem {
  month: string;
  users: number;
}

export interface UserStatMetric {
  value: number;
  change: number;
  direction: "up" | "down";
}

export interface ActiveUsersStat {
  value: number;
  activationRate: number;
}

export interface UserStatsAnalytics {
  totalUsers: UserStatMetric;
  activeUsers: ActiveUsersStat;
  newThisMonth: UserStatMetric;
  suspendedUsers: UserStatMetric;
}

export interface UserStatsAnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserStatsAnalytics;
}

export interface UserRoleChartItem {
  label: string;
  count: number;
}

export interface UserRolesChartResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserRoleChartItem[];
}

export interface UserGrowthChartItem {
  label: string;
  count: number;
}

export interface UserGrowthChartResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserGrowthChartItem[];
}

export interface UserFilters {
  role?: UserManagementUser["role"];
  status?: UserManagementUser["status"];
  minOrderSpent?: number;
  dateRange?: {
    from: Date;
    to?: Date;
  };
}

export interface FetchUsersParams {
  page: number;
  pageSize: number;
  search: string;
  filters?: UserFilters;
}

export interface FetchUsersResponse {
  items: UserManagementUser[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
