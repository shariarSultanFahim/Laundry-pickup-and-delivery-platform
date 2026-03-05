import zod from "zod";

export const notificationPreferencesSchema = zod.object({
  emailNotifications: zod.boolean(),
  pushNotifications: zod.boolean(),
  smsNotifications: zod.boolean()
});

export type NotificationPreferencesFormData = zod.infer<typeof notificationPreferencesSchema>;
