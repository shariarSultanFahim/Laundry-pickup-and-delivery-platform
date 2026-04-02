import zod from "zod";

const bundleServiceSchema = zod.object({
  serviceId: zod.string().min(1, "Service is required"),
  serviceName: zod.string(),
  servicePrice: zod.number()
});

export const addBundleSchema = zod.object({
  name: zod.string().min(2, "Bundle name must be at least 2 characters").max(100),
  description: zod.string().min(10, "Description must be at least 10 characters").max(500),
  services: zod.array(bundleServiceSchema).min(1, "Bundle must include at least 1 service"),
  bundlePrice: zod.number().positive("Bundle price must be greater than 0"),
  image: zod.instanceof(File).optional().nullable()
});

export type AddBundleFormData = zod.infer<typeof addBundleSchema>;
