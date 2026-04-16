import {
  DisputeDetails,
  DisputeManagementDispute,
  DisputeOperatorAction,
  DisputeResolveAction,
  DisputeStatus,
  FetchDisputesParams,
  FetchDisputesResponse,
  ResolveDisputePayload,
  RespondToDisputePayload
} from "@/types/dispute-management";

import { get, patch } from "@/lib/api";

interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPage?: number;
}

interface ApiDisputeItem {
  id: string;
  description: string;
  images?: string[];
  status: string;
  createdAt?: string;
  order?: {
    id?: string;
    orderNumber?: string;
  };
  user?: {
    name?: string;
    email?: string;
  };
  operator?: {
    id?: string;
    user?: {
      name?: string;
    };
  };
}

interface FetchOrderIssuesResponse {
  success: boolean;
  message?: string;
  data: ApiDisputeItem[];
  meta?: ApiMeta;
}

interface GetOrderIssueDetailsResponse {
  success: boolean;
  data: {
    id: string;
    description: string;
    images: string[];
    status: string;
    order: {
      orderNumber: string;
      subtotal: number;
      pickupAndDeliveryFee: number;
      totalAmount: number;
      orderItems: Array<{
        serviceName: string;
        quantity: number;
        price: number;
        orderAddons: Array<{
          addon: {
            name: string;
            price: number;
          };
        }>;
      }>;
    };
    user: {
      name: string;
      avatar?: string | null;
    };
    operator: {
      user: {
        name: string;
      };
    };
  };
}

const statusMap: Record<string, DisputeStatus> = {
  PENDING: "PENDING",
  OPEN: "PENDING",
  RESOLVED: "RESOLVED",
  ESCALATED: "ESCALATED",
  REFUNDED: "REFUNDED"
};

function normalizeStatus(status: string): DisputeStatus {
  return statusMap[status?.toUpperCase?.() ?? ""] ?? "PENDING";
}

function mapDisputeItem(item: ApiDisputeItem): DisputeManagementDispute {
  return {
    id: item.id,
    claimId: item.id,
    orderId: item.order?.orderNumber ?? item.order?.id ?? "N/A",
    customerName: item.user?.name ?? "Unknown Customer",
    customerEmail: item.user?.email ?? "",
    operatorId: item.operator?.id ?? "",
    operatorName: item.operator?.user?.name ?? "Unknown Operator",
    status: normalizeStatus(item.status),
    description: item.description ?? "",
    photos: item.images ?? [],
    createdAt: item.createdAt ?? new Date().toISOString()
  };
}

export async function fetchDisputes(params: FetchDisputesParams): Promise<FetchDisputesResponse> {
  const searchParams = new URLSearchParams();
  searchParams.append("page", params.page.toString());
  searchParams.append("limit", params.pageSize.toString());

  if (params.search.trim()) {
    searchParams.append("searchTerm", params.search.trim());
  }

  if (params.filters?.status) {
    searchParams.append("status", params.filters.status);
  }

  const response = await get<FetchOrderIssuesResponse>(`/order-issue?${searchParams.toString()}`);
  const items = response.data.map(mapDisputeItem);
  const total = response.meta?.total ?? items.length;
  const totalPages = response.meta?.totalPage ?? Math.max(Math.ceil(total / params.pageSize), 1);

  return {
    items,
    page: response.meta?.page ?? params.page,
    pageSize: response.meta?.limit ?? params.pageSize,
    total,
    totalPages
  };
}

export async function getDisputeDetails(id: string): Promise<DisputeDetails> {
  const response = await get<GetOrderIssueDetailsResponse>(`/order-issue/${id}`);

  return {
    id: response.data.id,
    description: response.data.description,
    images: response.data.images ?? [],
    status: normalizeStatus(response.data.status),
    order: {
      orderNumber: response.data.order?.orderNumber ?? "N/A",
      subtotal: response.data.order?.subtotal ?? 0,
      pickupAndDeliveryFee: response.data.order?.pickupAndDeliveryFee ?? 0,
      totalAmount: response.data.order?.totalAmount ?? 0,
      orderItems: response.data.order?.orderItems ?? []
    },
    user: {
      name: response.data.user?.name ?? "Unknown Customer",
      avatar: response.data.user?.avatar ?? null
    },
    operator: {
      user: {
        name: response.data.operator?.user?.name ?? "Unknown Operator"
      }
    }
  };
}

export async function resolveDispute(
  disputeId: string,
  payload: ResolveDisputePayload
): Promise<void> {
  await patch<
    { success: boolean },
    { action: DisputeResolveAction; amount?: number; note?: string }
  >(`/order-issue/${disputeId}/resolve`, payload);
}

export async function respondToDispute(
  disputeId: string,
  payload: RespondToDisputePayload
): Promise<void> {
  await patch<
    { success: boolean },
    { action: DisputeOperatorAction; amount?: number; note?: string }
  >(`/order-issue/${disputeId}/respond`, payload);
}
