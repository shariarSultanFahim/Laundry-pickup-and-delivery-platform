import zod from "zod";

export const workHoursSchema = zod.object({
  startTime: zod.string().min(1, "Start time is required"),
  endTime: zod.string().min(1, "End time is required")
});

export type WorkHoursFormData = zod.infer<typeof workHoursSchema>;
