export interface ReviewManagementReview {
  id: string;
  reviewId: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  review: string;
  date: string;
  orderId: string;
  operatorName: string;
}

export interface ReviewStats {
  title: string;
  value: string;
  subtitle: string;
  icon: "star" | "reviews" | "thumbs-up" | "thumbs-down";
}

export interface ReviewByRating {
  stars: number;
  count: number;
}

export interface RatingTrend {
  date: string;
  rating: number;
}

export interface OperatorRanking {
  rank: number;
  operatorName: string;
  operatorId: string;
  averageRating: number;
  totalReviews: number;
  positiveReviews: number;
  negativeReviews: number;
}

export interface ReviewFilters {
  rating?: number;
  fromDate?: string;
  toDate?: string;
}

export interface FetchReviewsParams {
  page: number;
  pageSize: number;
  search: string;
  filters?: ReviewFilters;
}

export interface FetchReviewsResponse {
  items: ReviewManagementReview[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
