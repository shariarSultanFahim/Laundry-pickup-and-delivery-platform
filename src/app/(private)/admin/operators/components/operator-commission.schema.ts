import zod from "zod";

export const payoutScheduleOptions = ["weekly", "bi-weekly", "monthly"] as const;

export const operatorCommissionSchema = zod.object({
  platformCommission: zod
    .number()
    .min(0, "Platform commission must be at least 0")
    .max(100, "Platform commission cannot exceed 100"),
  paymentProcessingFee: zod
    .number()
    .min(0, "Payment processing fee must be at least 0")
    .max(100, "Payment processing fee cannot exceed 100"),
  fixedTransactionFee: zod.number().min(0, "Transaction fee must be at least 0"),
  payoutSchedule: zod.enum(payoutScheduleOptions)
});

export type OperatorCommissionData = zod.infer<typeof operatorCommissionSchema>;
