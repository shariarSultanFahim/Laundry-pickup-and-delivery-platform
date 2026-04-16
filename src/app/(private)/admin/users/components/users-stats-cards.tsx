import { AlertTriangle, TrendingDown, TrendingUp, UserPlus, Users } from "lucide-react";

import { UserStatsAnalytics } from "@/types/user-management";

import { Card, CardContent } from "@/ui/card";

const statsIconMap = {
  "Total Users": Users,
  "Active Users": TrendingUp,
  "New This Month": UserPlus,
  "Suspended Users": AlertTriangle
};

interface UsersStatsCardsProps {
  data?: UserStatsAnalytics;
  isLoading: boolean;
}

interface UsersStatCard {
  title: keyof typeof statsIconMap;
  value: string;
  subtitle: string;
  trend: "up" | "down";
}

const formatNumber = (value: number) => value.toLocaleString();

const formatPercent = (value: number) => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
};

const getStatCards = (data?: UserStatsAnalytics): UsersStatCard[] => {
  if (!data) {
    return [
      { title: "Total Users", value: "-", subtitle: "Loading...", trend: "up" },
      { title: "Active Users", value: "-", subtitle: "Loading...", trend: "up" },
      { title: "New This Month", value: "-", subtitle: "Loading...", trend: "up" },
      { title: "Suspended Users", value: "-", subtitle: "Loading...", trend: "down" }
    ];
  }

  return [
    {
      title: "Total Users",
      value: formatNumber(data.totalUsers.value),
      subtitle: `${formatPercent(data.totalUsers.change)} from last month`,
      trend: data.totalUsers.direction
    },
    {
      title: "Active Users",
      value: formatNumber(data.activeUsers.value),
      subtitle: `${data.activeUsers.activationRate.toFixed(1)}% activation rate`,
      trend: "up"
    },
    {
      title: "New This Month",
      value: formatNumber(data.newThisMonth.value),
      subtitle: `${formatPercent(data.newThisMonth.change)} from previous month`,
      trend: data.newThisMonth.direction
    },
    {
      title: "Suspended Users",
      value: formatNumber(data.suspendedUsers.value),
      subtitle: `${formatPercent(data.suspendedUsers.change)} from last month`,
      trend: data.suspendedUsers.direction
    }
  ];
};

export default function UsersStatsCards({ data, isLoading }: UsersStatsCardsProps) {
  const stats = getStatCards(data);

  return (
    <div className="gap-4 md:grid-cols-2 xl:grid-cols-4 grid">
      {stats.map((stat) => {
        const Icon = statsIconMap[stat.title as keyof typeof statsIconMap] ?? Users;

        return (
          <Card key={stat.title}>
            <CardContent className="">
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
