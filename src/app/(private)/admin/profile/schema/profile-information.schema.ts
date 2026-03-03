import zod from "zod";

export const profileInformationSchema = zod.object({
  fullName: zod.string().min(2, "Full name must be at least 2 characters"),
  email: zod.email({ message: "Please enter a valid email address" }),
  phoneNumber: zod.string().min(7, "Phone number is required"),
  role: zod.string().min(2, "Role is required"),
  avatarUrl: zod.string().url("Please provide a valid avatar URL"),
  avatarFile: zod
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

export type ProfileInformationFormData = zod.infer<typeof profileInformationSchema>;
