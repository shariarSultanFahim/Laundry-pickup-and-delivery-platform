// API Response Types for Operator Membership Analytics

// Stats response
export interface MembershipOrdersTrend {
  count: number;
  trend: number;
  direction: "up" | "down";
}

export interface MembershipStatsResponse {
  success: boolean;
  message: string;
  data: {
    membershipOrders: MembershipOrdersTrend;
    nonMembershipOrders: MembershipOrdersTrend;
  };
}

// Order distribution response (Pie chart)
export interface OrderDistributionItem {
  label: "Membership Orders" | "Non-Membership Orders";
  value: number;
  percentage: number;
}

export interface OrderDistributionResponse {
  success: boolean;
  message: string;
  data: OrderDistributionItem[];
}

// Orders over time response (Bar chart)
export interface OrdersOverTimeItem {
  month: string;
  membershipOrders: number;
  nonMembershipOrders: number;
}

export interface OrdersOverTimeResponse {
  success: boolean;
  message: string;
  data: OrdersOverTimeItem[];
}

// Order summary response (Table)
export interface OrderSummaryRow {
  type: "Membership Orders" | "Non-Membership Orders" | "Total";
  totalOrders: number;
  percentage: number;
  revenue: number;
  avgOrderValue: number;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  isSubscription: boolean;
  isFromAd: boolean;
  adId: string | null;
  status: string;
  paymentStatus: string;
  totalAmount: string;
  subtotal: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  ad: unknown | null;
}

export interface OrderSummaryResponse {
  success: boolean;
  message: string;
  data: {
    summary: OrderSummaryRow[];
    orders: OrderData[];
  };
}

// Query params
export interface OrdersOverTimeParams {
  months?: number;
}
