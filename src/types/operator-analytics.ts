export interface OperatorRevenueChartItem {
  month: string;
  revenue: number;
}

export interface OperatorRevenueChartPayload {
  filter: string;
  data: OperatorRevenueChartItem[];
}

export interface OperatorRevenueChartResponse {
  success: boolean;
  message: string;
  data: OperatorRevenueChartPayload;
}

export interface OperatorNextPayout {
  amount: number;
  scheduledDate: string;
  schedule: string;
}

export interface OperatorDashboardStats {
  totalOrders: number;
  totalRevenue: number;
  processingOrders: number;
  outForDeliveryOrders: number;
  completedOrders: number;
  grossRevenue: number;
  platformCommission: number;
  netPayout: number;
  walletBalance: number;
  nextPayout: OperatorNextPayout;
}

export interface OperatorDashboardStatsResponse {
  success: boolean;
  message: string;
  data: OperatorDashboardStats;
}

export interface OperatorTopService {
  serviceId: string;
  serviceName: string;
  totalOrders: number;
  completedOrders: number;
  completionRate: number;
}

export interface OperatorTopServicesResponse {
  success: boolean;
  message: string;
  data: OperatorTopService[];
}

export interface MyOrderUser {
  name: string;
  email: string;
}

export interface MyOrderItem {
  id: string;
  serviceName: string;
  quantity: number;
}

export interface MyOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  user: MyOrderUser;
  orderItems: MyOrderItem[];
}

export interface MyOrdersMeta {
  total: number;
  totalPage: number;
  page: number;
  limit: number;
}

export interface MyOrdersResponse {
  success: boolean;
  message: string;
  meta: MyOrdersMeta;
  data: MyOrder[];
}

export type OperatorPayoutStatus = "PAID" | "PENDING" | "FAILED";

export interface OperatorPayoutHistoryItem {
  transactionId: string;
  amount: number;
  type: string;
  note: string | null;
  orderNumber: string | null;
  payoutStatus: OperatorPayoutStatus;
  createdAt: string;
  withdrawalId: string | null;
}

export interface OperatorPayoutHistoryMeta {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface OperatorPayoutHistoryResponse {
  success: boolean;
  meta: OperatorPayoutHistoryMeta;
  data: OperatorPayoutHistoryItem[];
}
