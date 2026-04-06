import zod from "zod";

export const storeSchema = zod.object({
  name: zod.string().min(2, "Store name must be at least 2 characters").max(100),
  address: zod.string().min(5, "Address must be at least 5 characters"),
  country: zod.string().min(2, "Country is required"),
  state: zod.string().min(2, "State is required"),
  city: zod.string().min(2, "City is required"),
  postalCode: zod.string().min(2, "Postal code is required"),
  lat: zod.number(),
  lng: zod.number(),
  isActive: zod.boolean().optional(),
  logo: zod.any().optional(),
  banner: zod.any().optional()
});

export type StoreFormData = zod.infer<typeof storeSchema>;
