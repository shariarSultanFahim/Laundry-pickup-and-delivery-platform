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
  } | null;
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
  operatorId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface FetchReviewsParams {
  page: number;
  pageSize: number;
  search?: string;
}

export interface FetchReviewsResponse {
  items: ReviewManagementReview[];
  page: number;
  pageSize: number;
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
