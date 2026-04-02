import zod from "zod";

export const addServiceSchema = zod.object({
  name: zod.string().min(2, "Service name must be at least 2 characters").max(100),
  categoryId: zod.string().min(1, "Category is required"),
  addOnServices: zod.array(zod.string()),
  price: zod
    .number()
    .positive("Price must be greater than 0"),
  isActive: zod.boolean().optional(),
  bannerImage: zod.string().nullable().optional(),
  bannerImageFile: zod
    .custom<File | null>(
      (value) => value === null || (typeof File !== "undefined" && value instanceof File),
      "Please select a valid image"
    )
    .optional()
    .nullable()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Image size must be 5MB or less"
    })
    .refine((file) => !file || file.type.startsWith("image/"), {
      message: "Only image files are allowed"
    })
});

export type AddServiceFormData = zod.infer<typeof addServiceSchema>;
