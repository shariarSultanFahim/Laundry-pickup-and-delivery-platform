import { TrendingDown, TrendingUp, Users, UserX } from "lucide-react";

import { OperatorActivityOverview } from "@/types/admin-analytics";

import { Card, CardContent } from "@/ui/card";

const statsIconMap = {
  "Total Operators": Users,
  "Active Operators": TrendingUp,
  "Inactive Operators": UserX
};

interface OperatorStatCard {
  title: keyof typeof statsIconMap;
  value: string;
  subtitle: string;
  trend: "up" | "down";
}

interface OperatorsStatsCardsProps {
  data?: OperatorActivityOverview;
  isLoading: boolean;
}

const formatNumber = (value: number) => value.toLocaleString();

const getOperatorStatsCards = (data?: OperatorActivityOverview): OperatorStatCard[] => {
  if (!data) {
    return [
      {
        title: "Total Operators",
        value: "-",
        subtitle: "Loading...",
        trend: "up"
      },
      {
        title: "Active Operators",
        value: "-",
        subtitle: "Loading...",
        trend: "up"
      },
      {
        title: "Inactive Operators",
        value: "-",
        subtitle: "Loading...",
        trend: "down"
      }
    ];
  }

  const totalChangePrefix = data.totalOperators.change >= 0 ? "+" : "";

  return [
    {
      title: "Total Operators",
      value: formatNumber(data.totalOperators.value),
      subtitle: `${totalChangePrefix}${data.totalOperators.change.toFixed(1)}% from last month`,
      trend: data.totalOperators.direction
    },
    {
      title: "Active Operators",
      value: formatNumber(data.activeOperators.value),
      subtitle: `${data.activeOperators.percentage.toFixed(1)}% online now`,
      trend: "up"
    },
    {
      title: "Inactive Operators",
      value: formatNumber(data.inactiveOperators.value),
      subtitle: `${data.inactiveOperators.percentage.toFixed(1)}% offline`,
      trend: "down"
    }
  ];
};

export default function OperatorsStatsCards({ data, isLoading }: OperatorsStatsCardsProps) {
  const stats = getOperatorStatsCards(data);

  return (
    <div className="gap-4 md:grid-cols-3 grid">
      {stats.map((stat) => {
        const Icon = statsIconMap[stat.title as keyof typeof statsIconMap] ?? Users;

        return (
          <Card key={stat.title}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
                  <div className="mt-1 gap-1 text-xs text-muted-foreground flex items-center">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                    )}
                    <span>{isLoading ? "Loading..." : stat.subtitle}</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
