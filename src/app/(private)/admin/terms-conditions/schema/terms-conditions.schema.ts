import { z } from "zod";

export const termsConditionsSchema = z.object({
  content: z.string().min(10, "Terms and conditions content must be at least 10 characters long")
});

export type TermsConditionsFormData = z.infer<typeof termsConditionsSchema>;
