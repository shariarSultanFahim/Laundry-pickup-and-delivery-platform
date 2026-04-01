import zod from "zod";

export const serviceCategorySchema = zod.object({
  name: zod.string().min(2, "Category name must be at least 2 characters").max(100),
  description: zod.string().min(4, "Description must be at least 4 characters").max(120),
  status: zod.enum(["active", "inactive"])
});

export type ServiceCategoryFormData = zod.infer<typeof serviceCategorySchema>;
