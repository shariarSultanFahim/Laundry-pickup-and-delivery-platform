import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(5, "Description must be at least 5 characters").max(250),
  buttonText: z.string().min(2, "Button text must be at least 2 characters").max(50),
  bannerType: z.enum(["promotion", "membership", "offer", "seasonal"]),
  backgroundColor: z.string().min(1, "Background color is required"),
  textColor: z.string().min(1, "Text color is required"),
  imageFile: z
    .custom<File>((value) => value instanceof File, "Image is required")
    .refine((file) => file.size <= 5242880, "Image must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type),
      "Image must be JPEG, PNG, WebP, or GIF"
    ),
  isActive: z.boolean()
});

export type BannerFormData = z.infer<typeof bannerSchema>;
