import type { Service, ServiceCategory, ServiceResponse } from "@/types/service-management";
import { mockServices } from "../data/services";

// Mock data storage (will be replaced with backend API calls)
const serviceList: Service[] = [...mockServices];
let nextId = Math.max(...serviceList.map((s) => parseInt(s.id, 10))) + 1;

export async function fetchServices(): Promise<Service[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...serviceList];
}

export async function createService(formData: FormData): Promise<ServiceResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const addOnServices = JSON.parse(formData.get("addOnServices") as string);
    const price = parseFloat(formData.get("price") as string);
    const bannerImageFile = formData.get("bannerImage") as File | null;

    let bannerImage: string | undefined;
    if (bannerImageFile) {
      const reader = new FileReader();
      bannerImage = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(bannerImageFile);
      });
    }

    const newService: Service = {
      id: String(nextId),
      name,
      category: category as unknown as ServiceCategory,
      addOnServices,
      price,
      bannerImage,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    serviceList.push(newService);
    nextId++;

    return {
      success: true,
      message: "Service created successfully",
      data: newService
    };
  } catch {
    return {
      success: false,
      message: "Failed to create service"
    };
  }
}

export async function toggleServiceStatus(
  serviceId: string,
  isActive: boolean
): Promise<ServiceResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const service = serviceList.find((s) => s.id === serviceId);
  if (!service) {
    return {
      success: false,
      message: "Service not found"
    };
  }

  service.isActive = isActive;
  service.updatedAt = new Date().toISOString();

  return {
    success: true,
    message: "Service updated successfully",
    data: service
  };
}

export async function updateService(
  serviceId: string,
  formData: FormData
): Promise<ServiceResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const service = serviceList.find((s) => s.id === serviceId);
    if (!service) {
      return {
        success: false,
        message: "Service not found"
      };
    }

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const addOnServices = JSON.parse(formData.get("addOnServices") as string);
    const price = parseFloat(formData.get("price") as string);
    const bannerImageFile = formData.get("bannerImage") as File | null;

    let bannerImage = service.bannerImage;
    if (bannerImageFile && bannerImageFile.size > 0) {
      const reader = new FileReader();
      bannerImage = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(bannerImageFile);
      });
    }

    service.name = name;
    service.category = category as unknown as ServiceCategory;
    service.addOnServices = addOnServices;
    service.price = price;
    service.bannerImage = bannerImage;
    service.updatedAt = new Date().toISOString();

    return {
      success: true,
      message: "Service updated successfully",
      data: service
    };
  } catch {
    return {
      success: false,
      message: "Failed to update service"
    };
  }
}

export async function deleteService(serviceId: string): Promise<ServiceResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const index = serviceList.findIndex((s) => s.id === serviceId);
  if (index === -1) {
    return {
      success: false,
      message: "Service not found"
    };
  }

  const deleted = serviceList.splice(index, 1)[0];

  return {
    success: true,
    message: "Service deleted successfully",
    data: deleted
  };
}
