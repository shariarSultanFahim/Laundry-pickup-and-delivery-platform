"use client";

import { useQuery } from "@tanstack/react-query";

import type {
  OperatorReviewListQueryParams,
  OperatorReviewListResponse,
  OperatorReviewStatsResponse
} from "@/types/operator-review";

import { get } from "@/lib/api";

interface OperatorReviewStatsParams {
  storeId?: string;
}

type SortPreset = "newest" | "oldest" | "highest" | "lowest";

interface OperatorReviewFeedParams {
  rating?: string;
  serviceType?: string;
  sortBy?: SortPreset;
  page: number;
  limit: number;
}

const sortPresetMap: Record<
  SortPreset,
  Pick<OperatorReviewListQueryParams, "sortBy" | "sortOrder">
> = {
  newest: { sortBy: "createdAt", sortOrder: "desc" },
  oldest: { sortBy: "createdAt", sortOrder: "asc" },
  highest: { sortBy: "rating", sortOrder: "desc" },
  lowest: { sortBy: "rating", sortOrder: "asc" }
};

const buildParams = (params?: OperatorReviewListQueryParams) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  ) as Partial<OperatorReviewListQueryParams>;

export const operatorReviewsQueryKeys = {
  stats: (params?: OperatorReviewStatsParams) => ["operator-review", "stats", params] as const,
  feed: (params: OperatorReviewFeedParams) => ["operator-review", "feed", params] as const
};

export function useGetOperatorReviewStats(params?: OperatorReviewStatsParams) {
  return useQuery({
    queryKey: operatorReviewsQueryKeys.stats(params),
    queryFn: () =>
      get<OperatorReviewStatsResponse>("/operator-review/stats", {
        params: {
          storeId: params?.storeId
        }
      })
  });
}

export function useGetOperatorReviewFeed(params: OperatorReviewFeedParams) {
  const querySort = sortPresetMap[params.sortBy ?? "newest"];
  const queryParams = buildParams({
    rating: params.rating,
    serviceType: params.serviceType,
    sortBy: querySort.sortBy,
    sortOrder: querySort.sortOrder,
    page: params.page,
    limit: params.limit
  });

  return useQuery({
    queryKey: operatorReviewsQueryKeys.feed(params),
    queryFn: () =>
      get<OperatorReviewListResponse>("/operator-review/reviews", {
        params: queryParams
      })
  });
}
