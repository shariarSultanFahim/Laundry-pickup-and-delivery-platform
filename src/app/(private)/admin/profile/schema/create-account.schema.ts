import zod from "zod";

const imageSchema = zod
  .custom<File | null>(
    (value) => value === null || (typeof File !== "undefined" && value instanceof File),
    "Please select a valid image"
  )
  .refine((file) => file === null || file.size <= 5 * 1024 * 1024, {
    message: "Image size must be 5MB or less"
  })
  .refine((file) => file === null || file.type.startsWith("image/"), {
    message: "Only image files are allowed"
  });

export const createAdminSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
  email: zod.email({ message: "Please enter a valid email address" }),
  password: zod.string().min(6, "Password must be at least 6 characters"),
  phone: zod.string().min(7, "Phone number is required"),
  imageFile: imageSchema
});

export const createOperatorSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
  email: zod.email({ message: "Please enter a valid email address" }),
  password: zod.string().min(6, "Password must be at least 6 characters"),
  imageFile: imageSchema
});

export type CreateAdminFormData = zod.infer<typeof createAdminSchema>;
export type CreateOperatorFormData = zod.infer<typeof createOperatorSchema>;
