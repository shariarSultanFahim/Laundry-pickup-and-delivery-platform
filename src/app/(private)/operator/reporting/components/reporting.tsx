"use client";

import { useMemo, useState } from "react";

import { AlertCircle, CheckCircle2, Clock, ShoppingCart } from "lucide-react";

import {
  useGetOperatorReportingPerformanceSummary,
  useGetOperatorReportingStats,
  useGetOperatorReportingStatusDistribution,
  useGetOperatorReportingWeeklyChart
} from "@/lib/actions/operator/use-operator-reporting";

import OperatorStoreCombobox from "../../components/operator-store-combobox";
import StatsCard from "../../components/statsCard";
import OrderStatusDistributionChart from "./order-status-distribution-chart";
import PerformanceSummary from "./performance-summary";
import ReportingHeader from "./reporting-header";
import WeeklyOrdersChart from "./weekly-orders-chart";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "hsl(38, 92%, 50%)",
  PROCESSING: "hsl(206, 100%, 50%)",
  OUT_FOR_PICKUP: "hsl(262, 83%, 58%)",
  PICKED_UP: "hsl(262, 83%, 48%)",
  RECEIVED_BY_STORE: "hsl(221, 83%, 53%)",
  IN_PROGRESS: "hsl(217, 91%, 60%)",
  READY_FOR_DELIVERY: "hsl(188, 94%, 43%)",
  OUT_FOR_DELIVERY: "hsl(160, 84%, 39%)",
  DELIVERED: "hsl(142, 71%, 45%)",
  CANCELLED: "hsl(0, 84%, 60%)",
  REFUNDED: "hsl(24, 95%, 53%)"
};

export default function ReportingPageContent() {
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const storeId = selectedStoreId || undefined;
  const { data: reportingStatsResponse } = useGetOperatorReportingStats({ storeId });
  const { data: weeklyChartResponse } = useGetOperatorReportingWeeklyChart({ storeId });
  const { data: statusDistributionResponse } = useGetOperatorReportingStatusDistribution({
    storeId
  });
  const { data: performanceSummaryResponse } = useGetOperatorReportingPerformanceSummary({
    storeId
  });

  const reportingStats = useMemo(() => {
    const stats = reportingStatsResponse?.data;

    return [
      {
        title: "Total Orders",
        value: stats?.totalOrders.value.toLocaleString() ?? 0,
        change: {
          value: `${stats?.totalOrders.trend ?? 0}%`,
          trend: stats?.totalOrders.direction ?? "up",
          period: "vs last week"
        },
        icon: ShoppingCart,
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600"
      },
      {
        title: "Completed",
        value: stats?.completedOrders.value.toLocaleString() ?? 0,
        change: {
          value: `${stats?.completedOrders.trend ?? 0}%`,
          trend: stats?.completedOrders.direction ?? "up",
          period: "vs last week"
        },
        icon: CheckCircle2,
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600"
      },
      {
        title: "Pending",
        value: stats?.pendingOrders.value.toLocaleString() ?? 0,
        change: {
          value: `${stats?.pendingOrders.trend ?? 0}%`,
          trend: stats?.pendingOrders.direction ?? "down",
          period: "vs last week"
        },
        icon: Clock,
        iconBgColor: "bg-yellow-100",
        iconColor: "text-yellow-600"
      },
      {
        title: "Delayed",
        value: stats?.delayedOrders.value.toLocaleString() ?? 0,
        change: {
          value: `${stats?.delayedOrders.trend ?? 0}%`,
          trend: stats?.delayedOrders.direction ?? "down",
          period: "vs last week"
        },
        icon: AlertCircle,
        iconBgColor: "bg-red-100",
        iconColor: "text-red-600"
      }
    ];
  }, [reportingStatsResponse]);

  const weeklyOrdersData = useMemo(
    () => (weeklyChartResponse?.data ?? []).map((item) => ({ day: item.day, orders: item.count })),
    [weeklyChartResponse]
  );

  const orderStatusDistribution = useMemo(
    () =>
      (statusDistributionResponse?.data ?? []).map((item) => ({
        status: item.label,
        value: item.percentage,
        color: STATUS_COLORS[item.label] ?? "hsl(215, 20%, 65%)"
      })),
    [statusDistributionResponse]
  );

  const performanceMetrics = useMemo(() => {
    const performance = performanceSummaryResponse?.data;

    return [
      {
        title: performance?.efficiencyRate.label ?? "Efficiency Rate",
        value: `${performance?.efficiencyRate.value ?? 0}%`,
        subtitle: performance?.efficiencyRate.subtext ?? "Completed vs assigned ratio",
        iconName: "ShoppingCart" as const,
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600"
      },
      {
        title: performance?.customerSatisfaction.label ?? "Customer Satisfaction",
        value: String(performance?.customerSatisfaction.value ?? 0),
        subtitle: performance?.customerSatisfaction.subtext ?? "Based on 0 reviews",
        iconName: "CheckCircle2" as const,
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600"
      },
      {
        title: performance?.revenueImpact.label ?? "Revenue Impact",
        value: `$${(performance?.revenueImpact.value ?? 0).toLocaleString()}`,
        subtitle: `${performance?.revenueImpact.direction === "down" ? "-" : "+"}${
          performance?.revenueImpact.trend ?? 0
        }% ${performance?.revenueImpact.subtext ?? "Total subtotal processed"}`,
        iconName: "DollarSign" as const,
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600"
      }
    ];
  }, [performanceSummaryResponse]);

  return (
    <div className="space-y-6">
      <ReportingHeader
        title="Reporting Dashboard"
        subtitle="Monitor your operations performance and analytics"
        extraControl={
          <OperatorStoreCombobox
            value={selectedStoreId}
            onValueChange={setSelectedStoreId}
            mode="none"
            placeholder="All stores"
          />
        }
      />

      {/* Stats Cards */}
      <div className="gap-4 sm:grid-cols-2 lg:grid-cols-4 grid">
        {reportingStats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            iconBgColor={stat.iconBgColor}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="gap-4 lg:grid-cols-2 grid">
        <WeeklyOrdersChart data={weeklyOrdersData} />
        <OrderStatusDistributionChart data={orderStatusDistribution} />
      </div>

      {/* Performance Summary */}
      <PerformanceSummary metrics={performanceMetrics} />

      {/* Key Insights */}
      {/* <KeyInsights insights={keyInsights} /> */}
    </div>
  );
}
