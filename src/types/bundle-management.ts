import { OperatorProfile } from "./user";

export interface BundleService {
  id: string;
  bundleId: string;
  serviceId: string;
  createdAt: string;
  updatedAt: string;
  service: {
    id: string;
    operatorId: string;
    categoryId: string;
    name: string;
    basePrice: string;
    image: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Bundle {
  id: string;
  operatorId: string;
  name: string;
  description: string;
  image: string | null;
  bundlePrice: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  services: BundleService[];
  operator: {
    id: string;
    userId: string;
    storeName: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    platformFee: string | null;
    stripeConnectId: string;
    onboardingComplete: boolean;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
      name: string;
      email: string;
    };
  };
  totalOriginalPrice: number;
  discountAmount: number;
  discountPercentage: number;
}

export interface BundleResponse {
  success: boolean;
  message: string;
  data: Bundle;
}

export interface BundlesListResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: Bundle[];
}
