export interface Category {
  id: string;
  name: string;
  isActive: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryListResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface CategoryQueryParams {
  searchTerm?: string;
  status?: "ACTIVE" | "INACTIVE";
}
