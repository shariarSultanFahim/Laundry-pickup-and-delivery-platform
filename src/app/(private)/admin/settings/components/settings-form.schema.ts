import zod from "zod";

export const payoutScheduleOptions = ["WEEKLY", "MONTHLY", "YEARLY"] as const;

const paymentMethodSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  description: zod.string(),
  isActive: zod.boolean()
});

const businessRulesSchema = zod.object({
  calcellationWindow: zod.number().min(0, "Cancellation window cannot be negative"),
  bookingLeadTime: zod.number().min(0, "Booking lead time cannot be negative"),
  requirePaymentUpFront: zod.boolean(),
  allowPartialPayment: zod.boolean()
});

const commissionSettingsSchema = zod.object({
  platformCommission: zod
    .number()
    .min(0, "Platform commission must be at least 0")
    .max(100, "Platform commission cannot exceed 100"),
  paymentProcessingFee: zod.number().min(0, "Payment processing fee must be at least 0"),
  fixedTransactionFee: zod.number().min(0, "Transaction fee must be at least 0"),
  payoutSchedule: zod.enum(payoutScheduleOptions)
});

export const settingsFormSchema = zod.object({
  paymentMethods: zod.array(paymentMethodSchema),
  businessRules: businessRulesSchema,
  commissionSettings: commissionSettingsSchema
});

export type SettingsFormData = zod.infer<typeof settingsFormSchema>;
