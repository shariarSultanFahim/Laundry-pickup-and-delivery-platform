import { useQuery } from "@tanstack/react-query";

import type {
  MyOrdersResponse,
  OperatorDashboardStatsResponse,
  OperatorRevenueChartResponse,
  OperatorTopServicesResponse
} from "@/types/operator-analytics";

import { get } from "@/lib/api";

export type RevenueFilter = 3 | 6 | 12;

export function useGetOperatorRevenueChart(filter: RevenueFilter = 12) {
  return useQuery({
    queryKey: ["operator-dashboard", "revenue-chart", filter],
    queryFn: () =>
      get<OperatorRevenueChartResponse>("/operator-analytics/revenue-chart", {
        params: { filter }
      })
  });
}

export function useGetOperatorDashboardStats() {
  return useQuery({
    queryKey: ["operator-dashboard", "stats"],
    queryFn: () => get<OperatorDashboardStatsResponse>("/operator-analytics/stats")
  });
}

export function useGetOperatorTopServices() {
  return useQuery({
    queryKey: ["operator-dashboard", "top-services"],
    queryFn: () => get<OperatorTopServicesResponse>("/operator-analytics/top-services")
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
