export interface UserManagementUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "operator" | "admin";
  status: "active" | "inactive" | "suspended";
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

export interface UserFilters {
  role?: UserManagementUser["role"];
  status?: UserManagementUser["status"];
  minOrderSpent?: number;
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
