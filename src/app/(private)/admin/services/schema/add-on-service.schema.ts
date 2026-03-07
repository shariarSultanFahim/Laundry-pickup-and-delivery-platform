import zod from "zod";

export const addOnServiceSchema = zod.object({
  name: zod.string().min(2, "Add-on service name must be at least 2 characters").max(100),
  price: zod.number().positive("Price must be greater than 0"),
  description: zod
    .string()
    .min(2, "Description must be at least 2 characters")
    .max(30, "Description must be 30 characters or less"),
  status: zod.enum(["active", "inactive"])
});

export type AddOnServiceFormData = zod.infer<typeof addOnServiceSchema>;
