export type ServiceCategory =
  | "Wash"
  | "Dry Wash"
  | "Fold"
  | "Iron"
  | "Stain Removal"
  | "Dry Cleaning"
  | "Alterations";

export type AddOnService =
  | "Express Service"
  | "Stain Removal"
  | "Heavy Prewash"
  | "Delicate Wash"
  | "Fabric Softener"
  | "Urgent Service";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  addOnServices: AddOnService[];
  price: number;
  bannerImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFormData {
  name: string;
  category: ServiceCategory;
  addOnServices: AddOnService[];
  price: number;
  bannerImage: string | null;
  bannerImageFile: File | null;
}

export interface ServiceResponse {
  success: boolean;
  message?: string;
  data?: Service;
}

export interface ServicesListResponse {
  success: boolean;
  data: Service[];
  total: number;
}
