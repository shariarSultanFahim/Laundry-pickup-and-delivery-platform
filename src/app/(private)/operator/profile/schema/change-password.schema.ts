import zod from "zod";

export const changePasswordSchema = zod
  .object({
    currentPassword: zod.string().min(6, "Current password is required"),
    newPassword: zod.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: zod.string().min(8, "Please confirm your new password")
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
  });

export type ChangePasswordFormData = zod.infer<typeof changePasswordSchema>;
