export type BannerType = "promotion" | "membership" | "offer" | "seasonal";

export interface Banner {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  bannerType: BannerType;
  backgroundColor: string;
  textColor: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const bannerTypeConfig: Record<BannerType, { label: string; description: string }> = {
  promotion: {
    label: "Promotion",
    description: "Promotional offers and discounts"
  },
  membership: {
    label: "Membership",
    description: "Membership plans and benefits"
  },
  offer: {
    label: "Special Offer",
    description: "Limited-time special offers"
  },
  seasonal: {
    label: "Seasonal",
    description: "Seasonal campaigns"
  }
};

export const defaultBanners: Banner[] = [
  {
    id: "1",
    title: "Dry Clean 30% OFF",
    description: "Free Delivery Included",
    buttonText: "Schedule Now",
    bannerType: "promotion",
    backgroundColor: "linear-gradient(135deg, #1e40af 0%, #0891b2 100%)",
    textColor: "#ffffff",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Join Membership",
    description: "Unlimited care for your clothes at just $14.99/month",
    buttonText: "Join Now",
    bannerType: "membership",
    backgroundColor: "linear-gradient(135deg, #7c3aed 0%, #059669 100%)",
    textColor: "#ffffff",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Spring Cleaning Simplified",
    description: "Enjoy 20% Off delivery for a limited time",
    buttonText: "Find A Cleaner",
    bannerType: "seasonal",
    backgroundColor: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
    textColor: "#ffffff",
    imageUrl:
      "https://images.unsplash.com/photo-1635274605638-d44babc08a4f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "25% Off",
    description:
      "Experience our premium laundry service with an exclusive discount for first-time users.",
    buttonText: "Get Started",
    bannerType: "offer",
    backgroundColor: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)",
    textColor: "#ffffff",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=250&fit=crop",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
