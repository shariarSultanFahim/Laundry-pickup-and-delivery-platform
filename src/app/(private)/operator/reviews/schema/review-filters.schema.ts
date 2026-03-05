import zod from "zod";

export const operatorReviewFiltersSchema = zod.object({
  rating: zod.string().optional(),
  serviceType: zod.string().optional(),
  sortBy: zod.enum(["newest", "oldest", "highest", "lowest"]).default("newest")
});

export type OperatorReviewFiltersFormData = zod.infer<typeof operatorReviewFiltersSchema>;

export interface OperatorReviewFilters {
  rating?: string;
  serviceType?: string;
  sortBy: "newest" | "oldest" | "highest" | "lowest";
}
