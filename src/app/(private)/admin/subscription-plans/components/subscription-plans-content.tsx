"use client";

import { useState } from "react";

import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { AdSubscriptionPlan } from "@/types/operator-ad";

import {
  useCreateAdSubscriptionPlan,
  useGetAdSubscriptionPlans
} from "@/lib/actions/operator/use-operator-ads";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/ui";

const createPlanSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  durationMonth: z.coerce
    .number()
    .int("Duration must be a whole number")
    .positive("Duration must be greater than 0")
});

type CreatePlanFormValues = z.infer<typeof createPlanSchema>;

interface ApiErrorResponse {
  message?: string;
}

function formatPlanPrice(price: number | string) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "-";
  }

  return `$${numericPrice.toFixed(2)}`;
}

function getPlanDurationLabel(plan: AdSubscriptionPlan) {
  if (typeof plan.durationMonth === "number") {
    return `${plan.durationMonth} month${plan.durationMonth === 1 ? "" : "s"}`;
  }

  if (typeof plan.durationDays === "number") {
    return `${plan.durationDays} day${plan.durationDays === 1 ? "" : "s"}`;
  }

  return "-";
}

export default function SubscriptionPlansContent() {
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

  const { data, isLoading, isError } = useGetAdSubscriptionPlans();
  const { mutateAsync: createPlan, isPending: isCreating } = useCreateAdSubscriptionPlan();

  const form = useForm<CreatePlanFormValues>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      name: "",
      price: 0,
      durationMonth: 1
    }
  });

  const plans = data?.data ?? [];

  async function handleCreatePlan(values: CreatePlanFormValues) {
    try {
      await createPlan(values);
      toast.success("Subscription plan created successfully");
      form.reset({
        name: "",
        price: 0,
        durationMonth: 1
      });
      setIsCreateSheetOpen(false);
    } catch (error: unknown) {
      const errorMessage = isAxiosError<ApiErrorResponse>(error)
        ? (error.response?.data?.message ?? error.message)
        : "Failed to create subscription plan";

      toast.error(errorMessage);
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between flex flex-col">
          <div>
            <CardTitle>Subscription Plans</CardTitle>
            <p className="text-muted-foreground text-sm">
              Configure available subscription options for operator promotions.
            </p>
          </div>

          <Button onClick={() => setIsCreateSheetOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Plan
          </Button>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="h-24 text-muted-foreground flex items-center justify-center">
              Loading plans...
            </div>
          ) : isError ? (
            <div className="rounded-xl border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive border">
              Failed to load subscription plans. Please refresh and try again.
            </div>
          ) : plans.length === 0 ? (
            <div className="h-24 text-muted-foreground flex items-center justify-center">
              No subscription plans found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{formatPlanPrice(plan.price)}</TableCell>
                    <TableCell>{getPlanDurationLabel(plan)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
        <SheetContent className="sm:max-w-md p-4 w-full">
          <SheetHeader className="p-0">
            <SheetTitle>Create Subscription Plan</SheetTitle>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreatePlan)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Premium Laundry Subscription" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="99.95" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Months)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" step="1" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Plan"}
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}
