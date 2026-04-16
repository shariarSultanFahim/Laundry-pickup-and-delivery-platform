import { useQuery } from "@tanstack/react-query";

import type {
  MyOrdersResponse,
  OperatorDashboardStatsResponse,
  OperatorPayoutHistoryResponse,
  OperatorRevenueChartResponse,
  OperatorTopServicesResponse
} from "@/types/operator-analytics";

import { get } from "@/lib/api";

export type RevenueFilter = 3 | 6 | 12;

interface OperatorAnalyticsParams {
  storeId?: string;
}

interface PayoutHistoryParams extends OperatorAnalyticsParams {
  page?: number;
  limit?: number;
  status?: "PAID" | "PENDING" | "FAILED";
  month?: number;
  year?: number;
}

export function useGetOperatorRevenueChart(
  filter: RevenueFilter = 12,
  params?: OperatorAnalyticsParams
) {
  return useQuery({
    queryKey: ["operator-dashboard", "revenue-chart", filter, params],
    queryFn: () =>
      get<OperatorRevenueChartResponse>("/operator-analytics/revenue-chart", {
        params: {
          filter,
          storeId: params?.storeId
        }
      })
  });
}

export function useGetOperatorDashboardStats(params?: OperatorAnalyticsParams) {
  return useQuery({
    queryKey: ["operator-dashboard", "stats", params],
    queryFn: () =>
      get<OperatorDashboardStatsResponse>("/operator-analytics/stats", {
        params: {
          storeId: params?.storeId
        }
      })
  });
}

export function useGetOperatorTopServices(params?: OperatorAnalyticsParams) {
  return useQuery({
    queryKey: ["operator-dashboard", "top-services", params],
    queryFn: () =>
      get<OperatorTopServicesResponse>("/operator-analytics/top-services", {
        params: {
          limit: 10,
          storeId: params?.storeId
        }
      })
  });
}

export function useGetOperatorPayoutHistory(params?: PayoutHistoryParams) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;

  return useQuery({
    queryKey: ["operator-dashboard", "payout-history", params],
    queryFn: () =>
      get<OperatorPayoutHistoryResponse>("/operator-analytics/payout-history", {
        params: {
          page,
          limit,
          storeId: params?.storeId,
          status: params?.status,
          month: params?.month,
          year: params?.year
        }
      })
  });
}

export function useGetMyRecentOrders() {
  return useQuery({
    queryKey: ["operator-dashboard", "my-orders", { page: 1, limit: 5 }],
    queryFn: () =>
      get<MyOrdersResponse>("/order/my-orders", {
        params: { page: 1, limit: 5 }
      })
  });
}
