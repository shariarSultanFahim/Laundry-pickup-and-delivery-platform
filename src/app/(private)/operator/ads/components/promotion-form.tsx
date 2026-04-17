"use client";

import { useMemo, useState } from "react";

import type { AdSubscriptionPlan, OperatorStoreService } from "@/types/operator-ad";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Combobox,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/ui";

interface PromotionFormProps {
  services: OperatorStoreService[];
  plans: AdSubscriptionPlan[];
  isSubmitting?: boolean;
  disabled?: boolean;
  disabledMessage?: string;
  onSubmit: (payload: { storeServiceId?: string; planId?: string }) => void;
}

export default function PromotionForm({
  services,
  plans,
  isSubmitting = false,
  disabled = false,
  disabledMessage,
  onSubmit
}: PromotionFormProps) {
  const [selectedStoreServiceId, setSelectedStoreServiceId] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  const activePlans = useMemo(() => plans.filter((plan) => plan.isActive !== false), [plans]);
  const serviceOptions = useMemo(
    () =>
      services.map((service) => ({
        value: service.id,
        label: `${service.service.name} - ${service.store.name}`
      })),
    [services]
  );

  const handleSubmit = () => {
    if (!selectedStoreServiceId) {
      return;
    }

    onSubmit({
      storeServiceId: selectedStoreServiceId,
      planId: selectedPlanId || undefined
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promotion Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="store-service">Promote a Service</Label>
          <Combobox
            options={serviceOptions}
            value={selectedStoreServiceId}
            onValueChange={setSelectedStoreServiceId}
            placeholder="Select a service to promote"
            searchPlaceholder="Search services..."
            emptyText="No service found."
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="plan-id">Subscription Plan (Optional)</Label>
          <Select
            value={selectedPlanId || "none"}
            onValueChange={(value) => setSelectedPlanId(value === "none" ? "" : value)}
            disabled={disabled}
          >
            <SelectTrigger id="plan-id">
              <SelectValue placeholder="Use active subscription by default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Use active subscription</SelectItem>
              {activePlans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {disabledMessage ? (
          <p className="text-sm text-muted-foreground">{disabledMessage}</p>
        ) : null}

        <Button
          className="w-full"
          disabled={disabled || isSubmitting || !selectedStoreServiceId}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Creating..." : "Create Ad"}
        </Button>
      </CardContent>
    </Card>
  );
}
