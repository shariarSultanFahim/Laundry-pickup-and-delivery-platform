import { toast } from "sonner";

import type { PrivacyPolicyFormData } from "../schema/privacy-policy.schema";

export async function updatePrivacyPolicy(data: PrivacyPolicyFormData): Promise<void> {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Updating Privacy Policy:", data);

    toast.success("Privacy policy updated successfully!", {
      position: "top-center"
    });
  } catch (error) {
    console.error("Error updating privacy policy:", error);
    toast.error("Failed to update privacy policy. Please try again.", {
      position: "top-center"
    });
    throw error;
  }
}
