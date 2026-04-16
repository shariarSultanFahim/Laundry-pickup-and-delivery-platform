"use client";

import { useQuery } from "@tanstack/react-query";

import type {
  AdminReviewRatingChartResponse,
  AdminReviewStatsResponse,
  AdminReviewTopOperatorsResponse,
  AdminReviewTrendChartResponse,
  FetchReviewsParams,
  GetReviewsResponse
} from "@/types/review-management";

import { get } from "@/lib/api";

const buildParams = (params?: FetchReviewsParams) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  ) as Partial<FetchReviewsParams>;

export const adminReviewsQueryKeys = {
  stats: ["admin-review-stats"] as const,
  ratingChart: ["admin-review-rating-chart"] as const,
  trendChart: ["admin-review-trend-chart"] as const,
  reviews: (params?: Partial<FetchReviewsParams>) => ["admin-reviews", params] as const,
  topOperators: ["admin-review-top-operators"] as const
};

export const useGetAdminReviewStats = () => {
  return useQuery({
    queryKey: adminReviewsQueryKeys.stats,
    queryFn: () => get<AdminReviewStatsResponse>("/admin-review/stats")
  });
};

export const useGetAdminReviewRatingChart = () => {
  return useQuery({
    queryKey: adminReviewsQueryKeys.ratingChart,
    queryFn: () => get<AdminReviewRatingChartResponse>("/admin-review/rating-chart")
  });
};

export const useGetAdminReviewTrendChart = () => {
  return useQuery({
    queryKey: adminReviewsQueryKeys.trendChart,
    queryFn: () => get<AdminReviewTrendChartResponse>("/admin-review/trend-chart")
  });
};

export const useGetAdminReviews = (params: FetchReviewsParams, enabled = true) => {
  const sanitizedParams = buildParams(params);

  return useQuery({
    queryKey: adminReviewsQueryKeys.reviews(sanitizedParams),
    enabled,
    queryFn: () => get<GetReviewsResponse>("/review", { params: sanitizedParams })
  });
};

export const useGetAdminReviewTopOperators = () => {
  return useQuery({
    queryKey: adminReviewsQueryKeys.topOperators,
    queryFn: () => get<AdminReviewTopOperatorsResponse>("/admin-review/top-operators")
  });
};
