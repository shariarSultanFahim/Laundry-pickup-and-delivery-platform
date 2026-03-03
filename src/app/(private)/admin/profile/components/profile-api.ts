"use client";

import { toast } from "sonner";

import { type ChangePasswordFormData } from "../schema/change-password.schema";
import { type NotificationPreferencesFormData } from "../schema/notification-preferences.schema";
import { type ProfileInformationFormData } from "../schema/profile-information.schema";

export async function updateProfileInformation(data: ProfileInformationFormData) {
  try {
    const formData = new FormData();

    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("role", data.role);
    formData.append("avatarUrl", data.avatarUrl);

    if (data.avatarFile) {
      formData.append("avatar", data.avatarFile);
    }

    // TODO: Implement actual API call to update profile information
    // await post("/profile/information", formData);

    console.log("Profile information updated:", {
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      role: data.role,
      avatar: data.avatarFile,
      hasAvatarFile: Boolean(data.avatarFile)
    });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast.success("Profile updated successfully", {
      position: "top-center"
    });
  } catch {
    toast.error("Failed to update profile information", {
      position: "top-center"
    });
  }
}

export async function updateNotificationPreference(
  key: keyof NotificationPreferencesFormData,
  value: boolean
) {
  try {
    // await post("/profile/notification-preferences", { [key]: value });
    console.log("Notification preference updated:", { [key]: value });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Notification preference updated", {
      position: "top-center"
    });
  } catch {
    toast.error("Failed to update notification preference", {
      position: "top-center"
    });
  }
}

export async function updatePassword(data: ChangePasswordFormData) {
  try {
    // await post("/profile/change-password", data);
    console.log("Password updated with data:", data);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Password updated successfully", {
      position: "top-center"
    });
  } catch {
    toast.error("Failed to update password", {
      position: "top-center"
    });
  }
}

export async function endAllSessions() {
  try {
    // await post("/profile/end-all-sessions");
    console.log("All sessions ended");
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("All sessions ended successfully", {
      position: "top-center"
    });
  } catch {
    toast.error("Failed to end all sessions", {
      position: "top-center"
    });
  }
}

export async function logoutCurrentSession() {
  try {
    // await post("/profile/logout");
    console.log("Current session logged out");
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast.success("Logged out successfully", {
      position: "top-center"
    });
  } catch {
    toast.error("Failed to logout", {
      position: "top-center"
    });
  }
}
