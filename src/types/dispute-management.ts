export type DisputeStatus = "PENDING" | "RESOLVED" | "ESCALATED" | "REFUNDED";

export type DisputeOperatorAction = "ESCALATE" | "REFUND";

export type DisputeResolveAction = "REFUND" | "DEDUCT_PAYOUT" | "DISMISS";

export interface DisputeManagementDispute {
  id: string;
  claimId: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  operatorId: string;
  operatorName: string;
  status: DisputeStatus;
  description: string;
  photos: string[];
  createdAt: string;
}

export interface DisputeAction {
  type: DisputeResolveAction;
  amount?: number;
  note?: string;
}

export interface DisputeOrderAddon {
  addon: {
    name: string;
    price: number;
  };
}

export interface DisputeOrderItem {
  serviceName: string;
  quantity: number;
  price: number;
  orderAddons: DisputeOrderAddon[];
}

export interface DisputeOrderSummary {
  orderNumber: string;
  subtotal: number;
  pickupAndDeliveryFee: number;
  totalAmount: number;
  orderItems: DisputeOrderItem[];
}

export interface DisputeDetails {
  id: string;
  description: string;
  images: string[];
  status: DisputeStatus;
  order: DisputeOrderSummary;
  user: {
    name: string;
    avatar?: string | null;
  };
  operator: {
    user: {
      name: string;
    };
  };
}

export interface DisputeFilters {
  status?: DisputeStatus;
}

export interface FetchDisputesParams {
  page: number;
  pageSize: number;
  search: string;
  filters?: DisputeFilters;
}

export interface FetchDisputesResponse {
  items: DisputeManagementDispute[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface DisputeStats {
  title: string;
  value: string;
  subtitle: string;
  trend: "up" | "down";
}

export interface ResolveDisputePayload {
  action: DisputeResolveAction;
  amount?: number;
  note?: string;
}

export interface RespondToDisputePayload {
  action: DisputeOperatorAction;
  amount?: number;
  note?: string;
}
