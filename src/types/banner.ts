export type BannerType = "PROMOTION" | "MEMBERSHIP" | "SEASONAL" | "OFFER";

export interface Banner {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  bannerType: BannerType;
  backgroundColor: string;
  textColor: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BannerListResponse {
  success: boolean;
  message: string;
  data: Banner[];
}

export interface BannerResponse {
  success: boolean;
  message: string;
  data: Banner;
}
