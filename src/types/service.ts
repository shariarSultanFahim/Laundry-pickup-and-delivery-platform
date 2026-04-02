import { Category } from "./category";

export interface Service {
  id: string;
  operatorId: string;
  categoryId: string;
  name: string;
  basePrice: string | number;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  addons: any[]; // Using any[] for now as defined in the response
  category?: Category;
  operator?: {
    id: string;
    userId: string;
    storeName: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    platformFee: number | null;
    stripeConnectId: string;
    onboardingComplete: boolean;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
      name: string;
      email: string;
      phone: string;
    };
  };
}

export interface ServiceListResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: Service[];
}

export interface ServiceResponse {
  success: boolean;
  message: string;
  data: Service;
}

export interface ServiceQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  categoryId?: string;
  operatorId?: string;
}

export interface CreateServicePayload {
  operatorId: string;
  categoryId: string;
  name: string;
  basePrice: number;
  isActive: boolean;
  addons: string[];
}
