import { AlertTriangle, Clock3, DollarSign, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

import { orderPaymentStatsData } from "../data/orders";

const statsIcons = [DollarSign, TrendingUp, Clock3, AlertTriangle] as const;

export default function OrdersStatsCards() {
  return (
    <div className="gap-4 md:grid-cols-2 xl:grid-cols-4 grid">
      {orderPaymentStatsData.map((stat, index) => {
        const Icon = statsIcons[index];

        return (
          <Card key={stat.title}>
            <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
