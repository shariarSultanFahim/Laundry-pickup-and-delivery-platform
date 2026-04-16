export interface ReviewManagementReview {
  id: string;
  reviewNumber: string | null;
  userId: string;
  storeServiceId: string | null;
  storeBundleId: string | null;
  rating: number;
  comment: string;
  operatorReply: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar: string | null;
  };
  service: {
    id: string;
    storeId: string;
    serviceId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    service: {
      id: string;
      operatorId: string;
      categoryId: string;
      name: string;
      basePrice: string;
      description: string;
      image: string | null;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
    store: {
      id: string;
      operatorId: string;
      name: string;
      logo: string | null;
      banner: string | null;
      address: string;
      country: string;
      state: string | null;
      city: string;
      postalCode: string | null;
      lat: number | null;
      lng: number | null;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
  } | null;
  bundle: {
    id: string;
    name?: string;
    bundle?: {
      name: string;
    } | null;
    store?: {
      name: string;
    } | null;
  } | null;
}

export interface AdminReviewStatsData {
  overallRating: number;
  totalReviews: number;
  positiveReviews: number;
  negativeReviews: number;
}

export interface AdminReviewStatsResponse {
  success: boolean;
  data: AdminReviewStatsData;
}

export interface ReviewStats {
  title: string;
  value: string;
  subtitle: string;
  icon: "star" | "reviews" | "thumbs-up" | "thumbs-down";
}

export interface ReviewByRating {
  rating: string;
  count: number;
}

export interface AdminReviewRatingChartResponse {
  success: boolean;
  data: ReviewByRating[];
}

export interface RatingTrend {
  date: string;
  rating: number;
}

export interface AdminReviewTrendChartResponse {
  success: boolean;
  data: RatingTrend[];
}

export interface OperatorRanking {
  rank: number;
  operatorName: string;
  operatorId?: string;
  avgRating: number;
  totalReviews: number;
  positive: number;
  negative: number;
}

export interface AdminReviewTopOperatorsResponse {
  success: boolean;
  data: OperatorRanking[];
}

export interface ReviewFilters {
  rating?: number;
  operatorId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface FetchReviewsParams {
  page: number;
  limit: number;
  search?: string;
}

export interface FetchReviewsResponse {
  items: ReviewManagementReview[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetReviewsResponse {
  success: boolean;
  message: string;
  meta: {
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  };
  data: ReviewManagementReview[];
}
