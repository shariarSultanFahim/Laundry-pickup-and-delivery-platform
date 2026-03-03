export interface OrderManagementOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  orderStatus: "completed" | "in-progress" | "pending" | "cancelled";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  transactionId: string;
  date: string;
}

export interface OrderPaymentStat {
  title: string;
  value: string;
  subtitle: string;
  trend: "up" | "down";
}

export interface OrderFilters {
  orderStatus?: OrderManagementOrder["orderStatus"];
  paymentStatus?: OrderManagementOrder["paymentStatus"];
  fromDate?: string;
  toDate?: string;
}

export interface FetchOrdersParams {
  page: number;
  pageSize: number;
  search: string;
  filters?: OrderFilters;
}

export interface FetchOrdersResponse {
  items: OrderManagementOrder[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
