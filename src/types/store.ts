import { UserProfile } from "./user";
import { Service } from "./bundle-management";
import { Bundle } from "./bundle-management";

export interface Store {
  id: string;
  operatorId: string;
  name: string;
  logo: string | null;
  banner: string | null;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  lat: number;
  lng: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  operator?: {
    user: {
      name: string;
      email: string;
      phone: string;
      avatar: string | null;
    };
  };
}

export interface StoreService {
  service: Service;
}

export interface StoreBundle {
  bundle: Bundle;
}

export interface StoreDetails extends Store {
  storeServices: StoreService[];
  storeBundles: StoreBundle[];
}

export interface StoreListResponse {
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: Store[];
}

export interface StoreResponse {
  success: boolean;
  message: string;
  data: Store;
}

export interface StoreDetailsResponse {
  success: boolean;
  message: string;
  data: StoreDetails;
}

export interface CreateStorePayload {
  name: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  lat: number;
  lng: number;
}

export interface UpdateStorePayload extends Partial<CreateStorePayload> {
  isActive?: boolean;
}

export interface StoreQueryParams {
  operatorId?: string;
  searchTerm?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
