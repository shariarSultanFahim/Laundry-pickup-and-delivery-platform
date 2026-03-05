"use client";

import { toast } from "sonner";

import { type ChangePasswordFormData } from "../schema/change-password.schema";
import { type NotificationPreferencesFormData } from "../schema/notification-preferences.schema";
import { type ProfileInformationFormData } from "../schema/profile-information.schema";
import { type WorkHoursFormData } from "../schema/work-hours.schema";

export async function updateProfileInformation(data: ProfileInformationFormData) {
  try {
    const formData = new FormData();

    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("jobTitle", data.jobTitle);
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
      jobTitle: data.jobTitle,
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

export async function updateNotificationPreference(value: NotificationPreferencesFormData) {
  try {
    // TODO: Implement actual API call to update notification preferences
    // await post(`/profile/notifications/${key}`, { enabled: value });
    console.log("Notification preferences updated:", value);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    toast.success("Notification preferences updated", {
      position: "top-center"
    });
  } catch {
    toast.error("Failed to update notification preferences", {
      position: "top-center"
    });
  }
}

export async function updateWorkHours(data: WorkHoursFormData) {
  try {
    // TODO: Implement actual API call to update work hours
    // await post("/profile/work-hours", data);

    console.log("Work hours updated:", {
      startTime: data.startTime,
      endTime: data.endTime
    });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast.success("Work hours updated successfully", {
      position: "top-center"
    });
  } catch {
    toast.error("Failed to update work hours", {
      position: "top-center"
    });
  }
}

export async function updatePassword(data: ChangePasswordFormData) {
  try {
    // TODO: Implement actual API call to update password
    // await post("/profile/password", data);

    console.log("Password updated successfully", {
      currentPassword: data.currentPassword.length > 0 ? "***" : "",
      newPassword: data.newPassword.length > 0 ? "***" : ""
    });

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
