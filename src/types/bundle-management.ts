import { OperatorProfile } from "./user";

export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceOperator {
  id: string;
  operatorId: string | null;
  userId: string;
  approvalStatus: string;
  stripeConnectedAccountId: string;
  onboardingUrl: string;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  isActive: any;
  id: string;
  name: string;
  basePrice: string;
  image: string | null;
  description: string;
  category: Category;
  operator: ServiceOperator;
  reviews: any[]; // Adjust if you have a Review type
  bundleServices?: any[];
  storeServices?: any[];
}

export interface BundleService {
  serviceId: string;
  service: Service;
  store: any | null; // Adjust if you have a Store type
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
  bundleServices: BundleService[];
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
    // totalPage: number; // The new res doesn't show totalPage, but it might be there. I'll keep it simple for now based on res.
  };
  data: Bundle[];
}
