export interface PaginationMeta {
  total: number;
  totalPage?: number;
  page: number;
  limit: number;
}

export type AdSubscriptionStatus = "ACTIVE" | "INACTIVE" | "EXPIRED" | "CANCELLED";
export type AdStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";

export interface AdSubscription {
  id: string;
  operatorId: string;
  planId: string;
  status: AdSubscriptionStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface AdSubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  description?: string;
  isActive?: boolean;
}

export interface AdSubscriptionCheckoutSessionPayload {
  planId: string;
}

export interface AdSubscriptionCheckoutSessionResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    url: string;
  };
}

export interface OperatorAdSubscriptionsResponse {
  success: boolean;
  message?: string;
  meta?: PaginationMeta;
  data:
    | AdSubscription[]
    | {
        meta: PaginationMeta;
        data: AdSubscription[];
      };
}

export interface AdSubscriptionPlanListResponse {
  success: boolean;
  message?: string;
  data: AdSubscriptionPlan[];
}

export interface OperatorAd {
  id: string;
  operatorId?: string;
  subscriptionId?: string;
  storeServiceId?: string | null;
  storeBundleId?: string | null;
  status: AdStatus;
  serviceName: string | null;
  serviceImage: string | null;
  bundleName: string | null;
  bundleImage: string | null;
  avgRating: number;
  totalReviewCount: number;
  distanceMile: number | null;
  operator: {
    id: string;
    user: {
      name: string;
      avatar: string | null;
    };
  };
  store?: {
    id: string;
    name: string;
    lat: number;
    lng: number;
  };
}

export interface OperatorActiveAd {
  id: string;
  operatorId: string;
  subscriptionId: string;
  storeServiceId: string | null;
  storeBundleId: string | null;
  status: AdStatus;
  createdAt: string;
}

export interface OperatorAdsResponse {
  success: boolean;
  message?: string;
  meta?: PaginationMeta;
  data:
    | OperatorAd[]
    | {
        meta: PaginationMeta;
        data: OperatorAd[];
      };
}

export interface CreateAdPayload {
  storeServiceId?: string;
  planId?: string;
}

export interface CreateAdPaymentRequiredResult {
  type: "PAYMENT_REQUIRED";
  checkoutUrl: string;
}

export interface CreateAdCreatedResult {
  id: string;
  operatorId: string;
  storeServiceId: string | null;
  subscriptionId: string;
  status: AdStatus;
  createdAt: string;
}

export interface CreateAdResponse {
  success: boolean;
  message?: string;
  data: CreateAdPaymentRequiredResult | CreateAdCreatedResult;
}

export interface UpdateAdPayload {
  status?: AdStatus;
  storeServiceId?: string;
}

export interface UpdateAdResponse {
  success: boolean;
  message?: string;
  data: CreateAdCreatedResult;
}

export interface DeleteAdResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export interface CancelAdSubscriptionResponse {
  success: boolean;
  message?: string;
  data: {
    id: string;
    status: AdSubscriptionStatus;
  };
}

export interface MyActiveAdResponse {
  success: boolean;
  message?: string;
  data: OperatorActiveAd | null;
}

export interface DeleteMyActiveAdResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export interface OperatorStoreService {
  id: string;
  storeId: string;
  serviceId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  service: {
    id: string;
    name: string;
    basePrice: string;
    description: string;
    image: string;
    isActive: boolean;
  };
  store: {
    id: string;
    name: string;
    city: string;
    country: string;
    isActive: boolean;
  };
}

export interface OperatorStoreServicesResponse {
  success: boolean;
  message: string;
  data: OperatorStoreService[];
}

export interface OperatorAdListQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  userLat?: number;
  userLng?: number;
}

export interface OperatorAdSubscriptionListQueryParams {
  page?: number;
  limit?: number;
}
