import zod from "zod";

export const loginSchema = zod.object({
  email: zod.email( { message: "Please enter a valid email address" }),
  password: zod.string( { message: "Password is required" })
});

export type LoginFormData = zod.infer<typeof loginSchema>;
