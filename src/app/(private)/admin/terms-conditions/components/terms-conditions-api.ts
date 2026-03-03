import { toast } from "sonner";

import type { TermsConditionsFormData } from "../schema/terms-conditions.schema";

export async function updateTermsConditions(data: TermsConditionsFormData): Promise<void> {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Updating Terms & Conditions:", data);

    toast.success("Terms and conditions updated successfully!", {
      position: "top-center"
    });
  } catch (error) {
    console.error("Error updating terms and conditions:", error);
    toast.error("Failed to update terms and conditions. Please try again.", {
      position: "top-center"
    });
    throw error;
  }
}
