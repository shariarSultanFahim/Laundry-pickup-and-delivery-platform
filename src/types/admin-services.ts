export interface AdminServiceCategory {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
}

export interface AdminAddOnService {
  id: string;
  name: string;
  price: number;
  description: string;
  status: "active" | "inactive";
}
