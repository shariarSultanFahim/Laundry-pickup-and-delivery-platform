export interface Addon {
  id: string;
  operatorId: string;
  name: string;
  price: string | number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  };
}

export interface AddonListResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: Addon[];
}

export interface AddonResponse {
  success: boolean;
  message: string;
  data: Addon;
}

export interface AddonQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

export interface CreateAddonPayload {
  name: string;
  price: number;
  description?: string;
  isActive: boolean;
}

export interface UpdateAddonPayload extends Partial<CreateAddonPayload> {}
