import zod from "zod";

export const notificationPreferencesSchema = zod.object({
  email: zod.boolean(),
  push: zod.boolean(),
  sms: zod.boolean()
});

export type NotificationPreferencesFormData = zod.infer<typeof notificationPreferencesSchema>;
