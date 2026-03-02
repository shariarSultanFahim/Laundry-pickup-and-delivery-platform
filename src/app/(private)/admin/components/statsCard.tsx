import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down";
    period: string;
  };
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconBgColor,
  iconColor
}: StatsCardProps) {
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
                  <ArrowUp className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-green-600" />
                )}
                <span className="text-sm font-medium text-green-600">
                  {change.value} {change.period}
                </span>
              </div>
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
