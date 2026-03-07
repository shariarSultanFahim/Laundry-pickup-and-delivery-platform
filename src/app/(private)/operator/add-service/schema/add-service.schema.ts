import zod from "zod";

export const addServiceSchema = zod.object({
  name: zod.string().min(2, "Service name must be at least 2 characters").max(100),
  category: zod.enum(
    ["Wash", "Dry Wash", "Fold", "Iron", "Stain Removal", "Dry Cleaning", "Alterations"]
  ),
  addOnServices: zod.array(
    zod.enum([
      "Express Service",
      "Stain Removal",
      "Heavy Prewash",
      "Delicate Wash",
      "Fabric Softener",
      "Urgent Service"
    ])
  ),
  price: zod
    .number()
    .positive("Price must be greater than 0"),
  bannerImage: zod.url().nullable(),
  bannerImageFile: zod
    .custom<File | null>(
      (value) => value === null || (typeof File !== "undefined" && value instanceof File),
      "Please select a valid image"
    )
    .refine((file) => file === null || file.size <= 5 * 1024 * 1024, {
      message: "Image size must be 5MB or less"
    })
    .refine((file) => file === null || file.type.startsWith("image/"), {
      message: "Only image files are allowed"
    })
});

export type AddServiceFormData = zod.infer<typeof addServiceSchema>;
