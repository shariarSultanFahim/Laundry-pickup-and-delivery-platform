export interface OrderManagementOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  operatorId: string;
  operatorName: string;
  amount: number;
  orderStatus: "completed" | "in-progress" | "pending" | "cancelled";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  transactionId: string;
  date: string;
  pickupAddress: string;
  deliveryAddress: string;
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
  operatorId?: OrderManagementOrder["operatorId"];
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
