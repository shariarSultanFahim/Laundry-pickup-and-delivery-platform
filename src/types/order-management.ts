export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "OUT_FOR_PICKUP"
  | "PICKED_UP"
  | "RECEIVED_BY_STORE"
  | "IN_PROGRESS"
  | "READY_FOR_DELIVERY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus =
  | "UNPAID"
  | "PAID"
  | "ESCROW_HELD"
  | "DISBURSED"
  | "REFUNDED";

export interface OrderAddress {
  id: string;
  orderId: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  pickupTime?: string | null;
  pickupDate?: string | null;
  deliveryTime?: string | null;
}

export interface OrderUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface OrderStore {
  id: string;
  name: string;
  logo: string;
  banner: string;
  address: string;
}

export interface OperatorOrder {
  id: string;
  orderId: string;
  operatorId: string;
  storeId: string;
  subtotal: string;
  transferAmount: string;
  transferStatus: string;
  store: {
    name: string;
  };
}

export interface OrderItem {
  id: string;
  serviceName: string;
  quantity: number;
  price: string;
  serviceId: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: string;
  pickupAndDeliveryFee: string;
  platformFee: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  pickupAddress: OrderAddress;
  deliveryAddress: OrderAddress;
  operatorOrders: OperatorOrder[];
  orderItems?: OrderItem[];
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  operatorID?: string;
  fromDate?: string;
  toDate?: string;
}

export interface FetchOrdersParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  operatorID?: string;
  fromDate?: string;
  toDate?: string;
}

export interface FetchOrdersResponse {
  success: boolean;
  message: string;
  meta: {
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  };
  data: AdminOrder[];
}

export interface FetchOrderDetailsResponse {
  success: boolean;
  message: string;
  data: AdminOrder;
}

export interface OrderPaymentStat {
  title: string;
  value: string;
  subtitle: string;
  trend: "up" | "down";
}
