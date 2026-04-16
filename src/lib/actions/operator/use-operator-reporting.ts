"use client";

import { useQuery } from "@tanstack/react-query";

import type {
  OperatorReportingPerformanceSummaryResponse,
  OperatorReportingStatsResponse,
  OperatorReportingStatusDistributionResponse,
  OperatorReportingWeeklyChartResponse
} from "@/types/operator-reporting";

import { get } from "@/lib/api";

interface OperatorReportingParams {
  storeId?: string;
}

export const operatorReportingQueryKeys = {
  stats: (params?: OperatorReportingParams) => ["operator-reporting", "stats", params] as const,
  weeklyChart: (params?: OperatorReportingParams) =>
    ["operator-reporting", "weekly-chart", params] as const,
  statusDistribution: (params?: OperatorReportingParams) =>
    ["operator-reporting", "status-distribution", params] as const,
  performanceSummary: (params?: OperatorReportingParams) =>
    ["operator-reporting", "performance-summary", params] as const
};

export function useGetOperatorReportingStats(params?: OperatorReportingParams) {
  return useQuery({
    queryKey: operatorReportingQueryKeys.stats(params),
    queryFn: () =>
      get<OperatorReportingStatsResponse>("/operator-reporting/stats", {
        params: {
          storeId: params?.storeId
        }
      })
  });
}

export function useGetOperatorReportingWeeklyChart(params?: OperatorReportingParams) {
  return useQuery({
    queryKey: operatorReportingQueryKeys.weeklyChart(params),
    queryFn: () =>
      get<OperatorReportingWeeklyChartResponse>("/operator-reporting/weekly-chart", {
        params: {
          storeId: params?.storeId
        }
      })
  });
}

export function useGetOperatorReportingStatusDistribution(params?: OperatorReportingParams) {
  return useQuery({
    queryKey: operatorReportingQueryKeys.statusDistribution(params),
    queryFn: () =>
      get<OperatorReportingStatusDistributionResponse>("/operator-reporting/status-distribution", {
        params: {
          storeId: params?.storeId
        }
      })
  });
}

export function useGetOperatorReportingPerformanceSummary(params?: OperatorReportingParams) {
  return useQuery({
    queryKey: operatorReportingQueryKeys.performanceSummary(params),
    queryFn: () =>
      get<OperatorReportingPerformanceSummaryResponse>("/operator-reporting/performance-summary", {
        params: {
          storeId: params?.storeId
        }
      })
  });
}
