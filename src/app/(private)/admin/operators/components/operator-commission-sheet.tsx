"use client";

import { Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { Operator } from "@/types/operator-management";

import {
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
  Input
} from "@/ui";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

import {
  operatorCommissionSchema,
  payoutScheduleOptions,
  type OperatorCommissionData
} from "./operator-commission.schema";

interface OperatorCommissionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operator: Operator | null;
}

function getStatusVariant(status: Operator["status"]) {
  if (status === "active") {
    return "default";
  }

  if (status === "inactive") {
    return "secondary";
  }

  return "destructive";
}

export default function OperatorCommissionSheet({
  open,
  onOpenChange,
  operator
}: OperatorCommissionSheetProps) {
  const form = useForm<OperatorCommissionData>({
    resolver: zodResolver(operatorCommissionSchema),
    defaultValues: {
      platformCommission: 15,
      paymentProcessingFee: 2.9,
      fixedTransactionFee: 0.3,
      payoutSchedule: "weekly"
    }
  });

  if (!operator) {
    return null;
  }

  function onSubmit(data: OperatorCommissionData) {
    // TODO: Replace with actual API call to update operator commission settings
    // operator is guaranteed to be non-null due to early return check above
    console.log("Operator commission data:", { operatorId: operator!.id, ...data });

    toast.success("Commission settings updated successfully!", {
      position: "top-center"
    });

    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md space-y-4 p-4 w-full overflow-y-auto">
        <SheetHeader className="p-0">
          <SheetTitle>Operator Commission Settings</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <div className="space-y-3 rounded-lg border-border bg-muted/30 p-4 border">
            <div className="gap-4 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Operator ID</p>
                <p className="font-semibold text-foreground">{operator.id}</p>
              </div>
              <Badge variant={getStatusVariant(operator.status)} className="capitalize">
                {operator.status}
              </Badge>
            </div>

            <div className="gap-3 grid">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="font-medium text-foreground">{operator.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Store/Area</p>
                <p className="font-medium text-foreground">
                  {operator.store} - {operator.area}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Region</p>
                <p className="font-medium text-foreground">{operator.region}</p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Commission Settings</CardTitle>
                </CardHeader>
                <CardContent className="gap-4 grid">
                  <FormField
                    control={form.control}
                    name="platformCommission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform Commission (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            step="0.1"
                            value={field.value}
                            onChange={(event) => field.onChange(Number(event.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentProcessingFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Processing Fee (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            step="0.1"
                            value={field.value}
                            onChange={(event) => field.onChange(Number(event.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fixedTransactionFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fixed Transaction Fee ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            value={field.value}
                            onChange={(event) => field.onChange(Number(event.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="payoutSchedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payout Schedule</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select payout schedule" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {payoutScheduleOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" className="min-w-40">
                  <Save className="size-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
