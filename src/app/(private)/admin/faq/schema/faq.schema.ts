import { z } from "zod";

export const faqSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters").max(500),
  answer: z.string().min(10, "Answer must be at least 10 characters").max(2000),
  isActive: z.boolean()
});

export type FAQFormData = z.infer<typeof faqSchema>;
