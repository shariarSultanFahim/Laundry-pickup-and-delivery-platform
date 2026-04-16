"use client";

import { useQuery } from "@tanstack/react-query";

import {
  AdminAnalyticsStatsResponse,
  OperatorActivityOverviewResponse,
  OrdersChartResponse,
  OrderVolumeChartResponse,
  PaymentSuccessChartResponse,
  RevenueAnalyticsResponse,
  RevenueChartResponse,
  StorePerformanceResponse,
  TopOperatorsResponse
} from "@/types/admin-analytics";

import { get } from "@/lib/api";

export const useGetAdminStats = (params?: { operatorId?: string; from?: string; to?: string }) => {
  return useQuery({
    queryKey: ["admin-stats", params],
    queryFn: () => get<AdminAnalyticsStatsResponse>("/admin-analytics/stats", { params })
  });
};

export const useGetRevenueChart = (
  filter: string = "monthly",
  extraParams?: { operatorId?: string; from?: string; to?: string }
) => {
  return useQuery({
    queryKey: ["revenue-chart", filter, extraParams],
    queryFn: () =>
      get<RevenueChartResponse>("/admin-analytics/revenue-chart", {
        params: { filter, ...extraParams }
      })
  });
};

export const useGetOrdersChart = (
  period: string = "weekly",
  extraParams?: { operatorId?: string; from?: string; to?: string }
) => {
  return useQuery({
    queryKey: ["orders-chart", period, extraParams],
    queryFn: () =>
      get<OrdersChartResponse>("/admin-analytics/orders-chart", {
        params: { period, ...extraParams }
      })
  });
};

export const useGetTopOperators = (params?: {
  operatorId?: string;
  from?: string;
  to?: string;
}) => {
  return useQuery({
    queryKey: ["top-operators", params],
    queryFn: () => get<TopOperatorsResponse>("/admin-analytics/top-operators", { params })
  });
};

export const useGetStorePerformance = (params?: {
  operatorId?: string;
  from?: string;
  to?: string;
}) => {
  return useQuery({
    queryKey: ["store-performance", params],
    queryFn: () => get<StorePerformanceResponse>("/admin-analytics/store-performance", { params })
  });
};

export const useGetRevenueAnalytics = (params?: { operatorId?: string }) => {
  return useQuery({
    queryKey: ["revenue-analytics", params],
    queryFn: () => get<RevenueAnalyticsResponse>("/admin-analytics/revenue-analytics", { params })
  });
};

export const useGetOrderVolumeChart = (params?: {
  operatorId?: string;
  month?: number;
  year?: number;
}) => {
  return useQuery({
    queryKey: ["order-volume-chart", params],
    queryFn: () => get<OrderVolumeChartResponse>("/admin-analytics/order-volume-chart", { params })
  });
};

export const useGetPaymentSuccessChart = (params?: { operatorId?: string }) => {
  return useQuery({
    queryKey: ["payment-success-chart", params],
    queryFn: () =>
      get<PaymentSuccessChartResponse>("/admin-analytics/payment-success-chart", {
        params
      })
  });
};

export const useGetOperatorActivityOverview = () => {
  return useQuery({
    queryKey: ["operator-activity-overview"],
    queryFn: () => get<OperatorActivityOverviewResponse>("/admin-analytics/operator-activity")
  });
};
