export interface Addon {
  id: string;
  operatorId: string;
  name: string;
  description: string;
  price: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddonListResponse {
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
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
