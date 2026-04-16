export interface StatValue {
  value: number;
  change?: number;
  direction?: "up" | "down";
  comparedTo?: string;
}

export interface OrderStatusStat {
  status: string;
  count: number;
  percentage: number;
}

export interface AdminAnalyticsStats {
  totalOrders: StatValue;
  netPlatformRevenue: StatValue;
  repeatedCustomerRate: { value: number };
  newCustomers: StatValue;
  cancellationRate: StatValue;
  onTimeCompletionRate: StatValue;
  avgSupportTicketClosingTime: { value: string };
  activeOperators: { value: number };
  membershipCount: { value: number };
  membershipChurnCount: { value: number };
  totalGMVPercentage: { value: number };
  grossRevenue: { value: number };
  orderStatus: OrderStatusStat[];
}

export interface RevenueChartItem {
  label: string;
  revenue: number;
}

export interface OrdersChartItem {
  label: string;
  count: number;
}

export interface TopOperator {
  operatorId: string;
  name: string;
  email: string;
  avatar: string | null;
  storeCount: number;
  stores: { id: string; name: string }[];
  totalOrders: number;
  completedOrders: number;
  successRate: number;
}

export interface StorePerformance {
  storeId: string;
  storeName: string;
  currentSales: number;
  previousSales: number;
  growth: number;
  direction: "up" | "down";
  status: string;
  region?: string;
  month?: string;
}

export interface RevenueAnalyticsStat {
  value: number;
  change: number;
  direction: "up" | "down";
}

export interface RevenueAnalyticsData {
  successRate: RevenueAnalyticsStat;
  avgOrderValue: RevenueAnalyticsStat;
}

export interface OrderVolumeChartItem {
  label: string;
  count: number;
}

export interface PaymentSuccessChartItem {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

// Responses
export interface AdminAnalyticsStatsResponse {
  success: boolean;
  message: string;
  data: AdminAnalyticsStats;
}

export interface RevenueChartResponse {
  success: boolean;
  message: string;
  data: RevenueChartItem[];
}

export interface OrdersChartResponse {
  success: boolean;
  message: string;
  data: {
    period: string;
    data: OrdersChartItem[];
  };
}

export interface TopOperatorsResponse {
  success: boolean;
  message: string;
  data: TopOperator[];
}

export interface StorePerformanceResponse {
  success: boolean;
  message: string;
  data: StorePerformance[];
}

export interface RevenueAnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: RevenueAnalyticsData;
}

export interface OrderVolumeChartResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: OrderVolumeChartItem[];
}

export interface PaymentSuccessChartResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PaymentSuccessChartItem[];
}
