"use client";

import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import {
  AdminAnalyticsStatsResponse,
  RevenueChartResponse,
  OrdersChartResponse,
  TopOperatorsResponse,
  StorePerformanceResponse
} from "@/types/admin-analytics";

export const useGetAdminStats = (params?: { operatorId?: string; from?: string; to?: string }) => {
  return useQuery({
    queryKey: ["admin-stats", params],
    queryFn: () => get<AdminAnalyticsStatsResponse>("/admin-analytics/stats", { params })
  });
};

export const useGetRevenueChart = (filter: string = "monthly", extraParams?: { operatorId?: string; from?: string; to?: string }) => {
  return useQuery({
    queryKey: ["revenue-chart", filter, extraParams],
    queryFn: () => get<RevenueChartResponse>("/admin-analytics/revenue-chart", { params: { filter, ...extraParams } })
  });
};

export const useGetOrdersChart = (period: string = "weekly", extraParams?: { operatorId?: string; from?: string; to?: string }) => {
  return useQuery({
    queryKey: ["orders-chart", period, extraParams],
    queryFn: () => get<OrdersChartResponse>("/admin-analytics/orders-chart", { params: { period, ...extraParams } })
  });
};

export const useGetTopOperators = (params?: { operatorId?: string; from?: string; to?: string }) => {
  return useQuery({
    queryKey: ["top-operators", params],
    queryFn: () => get<TopOperatorsResponse>("/admin-analytics/top-operators", { params })
  });
};

export const useGetStorePerformance = (params?: { operatorId?: string; from?: string; to?: string }) => {
  return useQuery({
    queryKey: ["store-performance", params],
    queryFn: () => get<StorePerformanceResponse>("/admin-analytics/store-performance", { params })
  });
};
