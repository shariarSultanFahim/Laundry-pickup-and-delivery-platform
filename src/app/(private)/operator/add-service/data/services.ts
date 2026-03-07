import type { Service } from "@/types/service-management";

export const mockServices: Service[] = [
  {
    id: "1",
    name: "Premium Wash",
    category: "Wash",
    addOnServices: ["Express Service", "Stain Removal"],
    price: 5.99,
    bannerImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=200&fit=crop",
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "2",
    name: "Dry Wash Delicate",
    category: "Dry Wash",
    addOnServices: ["Delicate Wash"],
    price: 7.99,
    bannerImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=200&fit=crop",
    isActive: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt:new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    name: "Professional Fold",
    category: "Fold",
    addOnServices: ["Fabric Softener"],
    price: 3.49,
    bannerImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=200&fit=crop",
    isActive: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "4",
    name: "Heavy Duty Iron",
    category: "Iron",
    addOnServices: ["Heavy Prewash", "Express Service"],
    price: 4.99,
    bannerImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=200&fit=crop",
    isActive: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "5",
    name: "Stain Removal Expert",
    category: "Stain Removal",
    addOnServices: ["Stain Removal"],
    price: 2.99,
    bannerImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=200&fit=crop",
    isActive: true,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "6",
    name: "Dry Cleaning Suit",
    category: "Dry Cleaning",
    addOnServices: ["Urgent Service"],
    price: 12.99,
    bannerImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=200&fit=crop",
    isActive: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];
