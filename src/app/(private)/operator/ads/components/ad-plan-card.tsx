import type { AdSubscriptionPlan } from "@/types/operator-ad";

import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/ui";

interface AdPlanCardProps {
  plan: AdSubscriptionPlan;
  isLoading?: boolean;
  hasActiveSubscription?: boolean;
  onBuy: (planId: string) => void;
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

export default function AdPlanCard({
  plan,
  isLoading = false,
  hasActiveSubscription = false,
  onBuy
}: AdPlanCardProps) {
  const isDisabled = isLoading || plan.isActive === false || hasActiveSubscription;

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="gap-2 flex items-center justify-between">
          <CardTitle className="text-base">{plan.name}</CardTitle>
          <Badge variant={plan.isActive === false ? "secondary" : "default"}>
            {plan.isActive === false ? "Inactive" : "Available"}
          </Badge>
        </div>
        <p className="text-3xl font-bold">{CURRENCY_FORMATTER.format(plan.price)}</p>
        <p className="text-sm text-muted-foreground">{plan.durationDays} days access</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {plan.description || "Boost visibility of your services and reach more local customers."}
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={isDisabled} onClick={() => onBuy(plan.id)}>
          {hasActiveSubscription ? "Subscription Active" : "Buy Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}
