export interface Operator {
  id: string;
  name: string;
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  store: string;
  area: string;
  region: "North" | "East" | "West" | "South";
}

export interface OperatorStats {
  title: string;
  value: string;
  subtitle: string;
  trend: "up" | "down";
}

export interface OperatorFilters {
  status?: Operator["status"];
  region?: Operator["region"];
}

export interface FetchOperatorsParams {
  page: number;
  pageSize: number;
  search: string;
  filters?: OperatorFilters;
}

export interface FetchOperatorsResponse {
  items: Operator[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
