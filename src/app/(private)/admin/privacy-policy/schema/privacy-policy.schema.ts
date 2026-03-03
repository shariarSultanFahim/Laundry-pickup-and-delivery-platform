import { z } from "zod";

export const privacyPolicySchema = z.object({
  content: z.string().min(10, "Privacy policy content must be at least 10 characters long")
});

export type PrivacyPolicyFormData = z.infer<typeof privacyPolicySchema>;
