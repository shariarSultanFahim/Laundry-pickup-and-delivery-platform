import zod from "zod";

import { sessionTimeoutOptions } from "../data/security";

export const securityFormSchema = zod.object({
  twoFactorAuth: zod.boolean(),
  sessionTimeout: zod
    .number()
    .refine((val) => sessionTimeoutOptions.includes(val as any), "Invalid session timeout value"),
  passwordComplexity: zod.boolean(),
  loginNotifications: zod.boolean()
});

export type SecurityFormData = zod.infer<typeof securityFormSchema>;
