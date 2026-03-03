import { toast } from "sonner";

import type { Banner } from "../data/banner";
import type { BannerFormData } from "../schema/banner.schema";

export async function createBanner(data: BannerFormData): Promise<Banner> {
  try {
    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("buttonText", data.buttonText);
    formData.append("bannerType", data.bannerType);
    formData.append("backgroundColor", data.backgroundColor);
    formData.append("textColor", data.textColor);
    formData.append("isActive", String(data.isActive));
    formData.append("image", data.imageFile);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Creating Banner with FormData:", {
      title: data.title,
      description: data.description,
      buttonText: data.buttonText,
      bannerType: data.bannerType,
      backgroundColor: data.backgroundColor,
      textColor: data.textColor,
      isActive: data.isActive,
      imageFile: data.imageFile.name
    });

    // Simulate backend response with URL (in real scenario, backend generates this)
    const imageUrl = URL.createObjectURL(data.imageFile);

    const newBanner: Banner = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      buttonText: data.buttonText,
      bannerType: data.bannerType,
      backgroundColor: data.backgroundColor,
      textColor: data.textColor,
      imageUrl,
      isActive: data.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    toast.success("Banner created successfully!", {
      position: "top-center"
    });

    return newBanner;
  } catch (error) {
    console.error("Error creating banner:", error);
    toast.error("Failed to create banner. Please try again.", {
      position: "top-center"
    });
    throw error;
  }
}

export async function updateBannerStatus(bannerId: string, isActive: boolean): Promise<void> {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    console.log(`Updating Banner ${bannerId} status to ${isActive ? "active" : "inactive"}`);

    toast.success(`Banner ${isActive ? "activated" : "deactivated"} successfully!`, {
      position: "top-center"
    });
  } catch (error) {
    console.error("Error updating banner status:", error);
    toast.error("Failed to update banner status. Please try again.", {
      position: "top-center"
    });
    throw error;
  }
}

export async function deleteBanner(bannerId: string): Promise<void> {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    console.log(`Deleting Banner ${bannerId}`);

    toast.success("Banner deleted successfully!", {
      position: "top-center"
    });
  } catch (error) {
    console.error("Error deleting banner:", error);
    toast.error("Failed to delete banner. Please try again.", {
      position: "top-center"
    });
    throw error;
  }
}
