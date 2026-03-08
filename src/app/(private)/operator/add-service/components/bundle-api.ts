import type { Bundle, BundleResponse } from "@/types/bundle-management";

// Mock data storage (will be replaced with backend API calls)
const bundleList: Bundle[] = [
  {
    id: "1",
    name: "The Signature",
    description: "Full garment care. Dry clean plus press. Premium standard.",
    services: [
      { serviceId: "1", serviceName: "Dry Cleaning", servicePrice: 15 },
      { serviceId: "2", serviceName: "Iron", servicePrice: 5 }
    ],
    totalPrice: 20,
    bundlePrice: 18,
    discount: 10,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "The Executive",
    description: "Dress shirts, slacks, blazers. Ready for work without thinking about it.",
    services: [
      { serviceId: "1", serviceName: "Dry Cleaning", servicePrice: 15 },
      { serviceId: "3", serviceName: "Wash", servicePrice: 10 },
      { serviceId: "2", serviceName: "Iron", servicePrice: 5 }
    ],
    totalPrice: 30,
    bundlePrice: 25,
    discount: 16.67,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextId = Math.max(...bundleList.map((b) => parseInt(b.id, 10))) + 1;

export async function fetchBundles(): Promise<Bundle[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...bundleList];
}

export async function createBundle(data: {
  name: string;
  description: string;
  services: Array<{ serviceId: string; serviceName: string; servicePrice: number }>;
  bundlePrice: number;
}): Promise<BundleResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const totalPrice = data.services.reduce((sum, service) => sum + service.servicePrice, 0);
    const discount = totalPrice > 0 ? ((totalPrice - data.bundlePrice) / totalPrice) * 100 : 0;

    const newBundle: Bundle = {
      id: String(nextId),
      name: data.name,
      description: data.description,
      services: data.services,
      totalPrice,
      bundlePrice: data.bundlePrice,
      discount,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    bundleList.push(newBundle);
    nextId++;

    return {
      success: true,
      message: "Bundle created successfully",
      data: newBundle
    };
  } catch {
    return {
      success: false,
      message: "Failed to create bundle"
    };
  }
}

export async function updateBundle(
  bundleId: string,
  data: {
    name: string;
    description: string;
    services: Array<{ serviceId: string; serviceName: string; servicePrice: number }>;
    bundlePrice: number;
  }
): Promise<BundleResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const bundle = bundleList.find((b) => b.id === bundleId);
    if (!bundle) {
      return {
        success: false,
        message: "Bundle not found"
      };
    }

    const totalPrice = data.services.reduce((sum, service) => sum + service.servicePrice, 0);
    const discount = totalPrice > 0 ? ((totalPrice - data.bundlePrice) / totalPrice) * 100 : 0;

    bundle.name = data.name;
    bundle.description = data.description;
    bundle.services = data.services;
    bundle.totalPrice = totalPrice;
    bundle.bundlePrice = data.bundlePrice;
    bundle.discount = discount;
    bundle.updatedAt = new Date().toISOString();

    return {
      success: true,
      message: "Bundle updated successfully",
      data: bundle
    };
  } catch {
    return {
      success: false,
      message: "Failed to update bundle"
    };
  }
}

export async function toggleBundleStatus(
  bundleId: string,
  isActive: boolean
): Promise<BundleResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const bundle = bundleList.find((b) => b.id === bundleId);
  if (!bundle) {
    return {
      success: false,
      message: "Bundle not found"
    };
  }

  bundle.isActive = isActive;
  bundle.updatedAt = new Date().toISOString();

  return {
    success: true,
    message: "Bundle updated successfully",
    data: bundle
  };
}

export async function deleteBundle(bundleId: string): Promise<BundleResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const index = bundleList.findIndex((b) => b.id === bundleId);
  if (index === -1) {
    return {
      success: false,
      message: "Bundle not found"
    };
  }

  bundleList.splice(index, 1);

  return {
    success: true,
    message: "Bundle deleted successfully"
  };
}
