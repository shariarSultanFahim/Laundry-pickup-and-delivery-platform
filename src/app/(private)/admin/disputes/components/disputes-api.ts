import type {
  DisputeManagementDispute,
  FetchDisputesParams,
  FetchDisputesResponse
} from "@/types/dispute-management";

import { disputesData } from "../data/disputes";

export async function fetchDisputes(params: FetchDisputesParams): Promise<FetchDisputesResponse> {
  // Filter by search
  let filtered: DisputeManagementDispute[] = disputesData;
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.claimId.toLowerCase().includes(searchLower) ||
        d.orderId.toLowerCase().includes(searchLower) ||
        d.customerName.toLowerCase().includes(searchLower) ||
        d.operatorName.toLowerCase().includes(searchLower)
    );
  }

  // Filter by status
  if (params.filters?.status) {
    filtered = filtered.filter((d) => d.status === params.filters?.status);
  }

  if (params.filters?.operatorId) {
    filtered = filtered.filter((d) => d.operatorId === params.filters?.operatorId);
  }

  // Filter by date range
  if (params.filters?.fromDate) {
    filtered = filtered.filter((d) => new Date(d.createdAt) >= new Date(params.filters!.fromDate!));
  }
  if (params.filters?.toDate) {
    filtered = filtered.filter((d) => new Date(d.createdAt) <= new Date(params.filters!.toDate!));
  }

  // Calculate pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / params.pageSize);
  const start = (params.page - 1) * params.pageSize;
  const items = filtered.slice(start, start + params.pageSize);

  return {
    items,
    page: params.page,
    pageSize: params.pageSize,
    total,
    totalPages
  };
}

export async function resolveDispute(
  disputeId: string,
  action: "override" | "refund" | "credit" | "deduct",
  amount?: number
): Promise<void> {
  void disputeId;
  void action;
  void amount;
}
