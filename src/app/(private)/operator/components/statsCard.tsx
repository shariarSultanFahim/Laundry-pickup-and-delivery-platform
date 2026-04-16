import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down";
    tone?: "positive" | "negative";
    period: string;
  };
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

export default function StatsCard({
  title,
  value,
  change,
  subtitle,
  icon: Icon,
  iconBgColor,
  iconColor
}: StatsCardProps) {
  const trendTone = change?.tone ?? (change?.trend === "up" ? "positive" : "negative");

  return (
    <Card className="hover:shadow-md overflow-hidden transition-shadow">
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight">{value}</h3>
            {change && (
              <div className="mt-2 gap-1 flex items-center">
                {change.trend === "up" ? (
                  <ArrowUp
                    className={cn(
                      "h-4 w-4",
                      trendTone === "positive" ? "text-green-500" : "text-red-500"
                    )}
                  />
                ) : (
                  <ArrowDown
                    className={cn(
                      "h-4 w-4",
                      trendTone === "positive" ? "text-green-500" : "text-red-500"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    trendTone === "positive" ? "text-green-500" : "text-red-500"
                  )}
                >
                  {change.value} {change.period}
                </span>
              </div>
            )}
            {subtitle && !change && (
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center", iconBgColor)}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
