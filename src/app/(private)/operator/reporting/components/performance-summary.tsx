"use client";

import { CheckCircle2, DollarSign, LucideIcon, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";

import { PerformanceMetric } from "../data/reporting";

interface PerformanceSummaryProps {
  metrics: PerformanceMetric[];
}

const iconMap: Record<string, LucideIcon> = {
  ShoppingCart,
  CheckCircle2,
  DollarSign
};

export default function PerformanceSummary({ metrics }: PerformanceSummaryProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Performance Summary</h2>
      <div className="gap-4 sm:grid-cols-3 grid grid-cols-1">
        {metrics.map((metric, index) => (
          <PerformanceCard key={index} metric={metric} />
        ))}
      </div>
    </div>
  );
}

interface PerformanceCardProps {
  metric: PerformanceMetric;
}

function PerformanceCard({ metric }: PerformanceCardProps) {
  const Icon = iconMap[metric.iconName];

  return (
    <Card className="hover:shadow-md overflow-hidden transition-shadow">
      <CardContent>
        <div className="gap-3 py-6 flex flex-col items-center justify-center text-center">
          <div
            className={cn(
              "h-12 w-12 rounded-lg flex items-center justify-center",
              metric.iconBgColor
            )}
          >
            <Icon className={cn("h-6 w-6", metric.iconColor)} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
            <p className="text-2xl font-bold tracking-tight mt-1">{metric.value}</p>
            <p className="text-xs text-muted-foreground mt-2">{metric.subtitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
