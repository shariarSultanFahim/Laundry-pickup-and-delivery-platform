export interface BundleService {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  services: BundleService[];
  totalPrice: number;
  bundlePrice: number;
  discount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BundleFormData {
  name: string;
  description: string;
  services: BundleService[];
  bundlePrice: number;
}

export interface BundleResponse {
  success: boolean;
  message?: string;
  data?: Bundle;
}

export interface BundlesListResponse {
  success: boolean;
  data: Bundle[];
  total: number;
}
