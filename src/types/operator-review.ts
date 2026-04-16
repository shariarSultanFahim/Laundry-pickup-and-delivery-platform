export interface OperatorReviewStatsDistributionItem {
  rating: number;
  count: number;
}

export interface OperatorReviewStatsData {
  averageRating: number;
  totalReviews: number;
  distribution: OperatorReviewStatsDistributionItem[];
}

export interface OperatorReviewStatsResponse {
  success: boolean;
  data: OperatorReviewStatsData;
}

export interface OperatorReviewListItem {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    avatar: string | null;
  };
  service: {
    service: {
      name: string;
    };
    store: {
      name: string;
    };
  } | null;
}

export interface OperatorReviewListMeta {
  page: number;
  limit: number;
  total: number;
}

export interface OperatorReviewListResponse {
  success: boolean;
  meta: OperatorReviewListMeta;
  data: OperatorReviewListItem[];
}

export interface OperatorReviewListQueryParams {
  rating?: string;
  serviceType?: string;
  sortBy?: "createdAt" | "rating";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
