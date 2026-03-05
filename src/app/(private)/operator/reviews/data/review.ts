export interface OperatorReview {
  id: string;
  customerName: string;
  customerImage: string;
  rating: number;
  comment: string;
  orderId: string;
  serviceType: string;
  createdAt: string;
}

export interface RatingDistribution {
  stars: number;
  count: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution[];
}

export interface FetchOperatorReviewsParams {
  page: number;
  pageSize: number;
  rating?: string;
  serviceType?: string;
  sortBy: "newest" | "oldest" | "highest" | "lowest";
}

export interface FetchOperatorReviewsResponse {
  items: OperatorReview[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  summary: ReviewSummary;
}

export const serviceTypeOptions = [
  { value: "wash-fold", label: "Wash & Fold" },
  { value: "dry-cleaning", label: "Dry Cleaning" },
  { value: "express-service", label: "Express Service" },
  { value: "ironing", label: "Ironing" }
];

export const ratingOptions = [
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4+ Stars" },
  { value: "3", label: "3+ Stars" },
  { value: "2", label: "2+ Stars" },
  { value: "1", label: "1+ Stars" }
];

export const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest", label: "Highest Rating" },
  { value: "lowest", label: "Lowest Rating" }
];
