export interface DisputeManagementDispute {
  id: string;
  claimId: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  operatorName: string;
  status: "escalated" | "open" | "resolved";
  description: string;
  photos: string[];
  createdAt: string;
}

export interface DisputeAction {
  type: "override-decision" | "refund" | "issue-credit" | "deduct-payout";
  amount?: number;
  reason?: string;
}

export interface DisputeFilters {
  status?: DisputeManagementDispute["status"];
  fromDate?: string;
  toDate?: string;
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
