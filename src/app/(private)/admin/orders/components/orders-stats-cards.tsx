"use client";

import { AlertTriangle, Clock3, DollarSign, TrendingUp } from "lucide-react";
import { useGetAdminStats } from "@/lib/actions/admin/use-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";

export default function OrdersStatsCards() {
  const { data: statsResponse, isLoading } = useGetAdminStats();
  const stats = statsResponse?.data;

  if (isLoading) {
    return (
      <div className="gap-4 md:grid-cols-2 xl:grid-cols-4 grid">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const grossRevenue = stats?.grossRevenue?.value ?? 0;
  const totalOrders = stats?.totalOrders?.value ?? 0;
  const avgTicket = totalOrders > 0 ? grossRevenue / totalOrders : 0;
  
  // Mapping order statuses to pending/failed for the stats display
  const pendingCount = stats?.orderStatus?.find(s => s.status.toUpperCase() === "PENDING")?.count ?? 0;
  const cancelledCount = stats?.orderStatus?.find(s => s.status.toUpperCase() === "CANCELLED")?.count ?? 0;

  const cards = [
    {
      title: "Gross Revenue",
      value: `$${grossRevenue.toLocaleString()}`,
      subtitle: stats?.netPlatformRevenue?.change !== undefined 
        ? `${stats.netPlatformRevenue.change}% ${stats.netPlatformRevenue.direction} from last period`
        : "Total revenue generated",
      icon: DollarSign,
    },
    {
      title: "Average Ticket",
      value: `$${avgTicket.toFixed(2)}`,
      subtitle: "Avg order value",
      icon: TrendingUp,
    },
    {
      title: "Pending Orders",
      value: pendingCount.toString(),
      subtitle: "Orders awaiting processing",
      icon: Clock3,
    },
    {
      title: "Cancelled Orders",
      value: cancelledCount.toString(),
      subtitle: "Total cancelled orders",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="gap-4 md:grid-cols-2 xl:grid-cols-4 grid">
      {cards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
