"use client";

import { useMemo } from "react";

import { AlertCircle, ChartArea, Check } from "lucide-react";

import {
  useGetOrderVolumeChart,
  useGetPaymentSuccessChart,
  useGetRevenueAnalytics,
  useGetTopOperators
} from "@/lib/actions/admin/use-analytics";

import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  ChartGridSkeleton,
  StatsCardGridSkeleton,
  TableSkeleton
} from "../../(dashboard)/components/skeleton-loaders";
import StatsCard from "../../components/statsCard";
import { OperatorPerformance, OrderVolumeChart, PaymentSuccessRateChart } from "./index";

interface ReportsContentProps {
  operatorId?: string | undefined;
}

interface StatsCardItem {
  id: string;
  title: string;
  value: string;
  change: {
    value: string;
    trend: "up" | "down";
    period: string;
  };
  icon: typeof Check;
  iconBgColor: string;
  iconColor: string;
}

interface OrderVolumeDataItem {
  month: string;
  orders: number;
}

interface PaymentSuccessDataItem {
  name: string;
  value: number;
  fill: string;
}

interface OperatorPerformanceItem {
  id: string;
  name: string;
  role: string;
  revenue: string;
  growth: string;
  avatar: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);

const formatPercentChange = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

export function ReportsContent({ operatorId }: ReportsContentProps) {
  const {
    data: revenueAnalyticsData,
    isLoading: revenueAnalyticsLoading,
    isError: revenueAnalyticsError
  } = useGetRevenueAnalytics(operatorId ? { operatorId } : undefined);

  const { data: orderVolumeChartData, isLoading: orderVolumeLoading } = useGetOrderVolumeChart(
    operatorId ? { operatorId } : undefined
  );

  const { data: paymentSuccessChartData, isLoading: paymentSuccessLoading } =
    useGetPaymentSuccessChart(operatorId ? { operatorId } : undefined);

  const { data: topOperatorsData, isLoading: topOperatorsLoading } = useGetTopOperators(
    operatorId ? { operatorId } : undefined
  );

  const mappedStatsData: StatsCardItem[] = useMemo(() => {
    const analytics = revenueAnalyticsData?.data;

    return [
      {
        id: "success-rate",
        title: "Success Rate",
        value: analytics ? `${analytics.successRate.value.toFixed(1)}%` : "-",
        change: {
          value: analytics ? formatPercentChange(analytics.successRate.change) : "0.0%",
          trend: analytics?.successRate.direction ?? "up",
          period: "from last month"
        },
        icon: Check,
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600"
      },
      {
        id: "avg-order-value",
        title: "Avg. Order Value",
        value: analytics ? formatCurrency(analytics.avgOrderValue.value) : "-",
        change: {
          value: analytics ? formatPercentChange(analytics.avgOrderValue.change) : "0.0%",
          trend: analytics?.avgOrderValue.direction ?? "up",
          period: "from last month"
        },
        icon: ChartArea,
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600"
      }
    ];
  }, [revenueAnalyticsData]);

  const mappedOrderVolumeData: OrderVolumeDataItem[] = useMemo(() => {
    if (!orderVolumeChartData?.data) {
      return [];
    }

    return orderVolumeChartData.data.map((item) => ({
      month: item.label,
      orders: item.count
    }));
  }, [orderVolumeChartData]);

  const mappedPaymentSuccessData: PaymentSuccessDataItem[] = useMemo(() => {
    if (!paymentSuccessChartData?.data) {
      return [];
    }

    return paymentSuccessChartData.data.map((item) => ({
      name: item.label,
      value: item.percentage,
      fill: item.color
    }));
  }, [paymentSuccessChartData]);

  const filteredOperatorPerformanceData: OperatorPerformanceItem[] = useMemo(() => {
    if (topOperatorsData?.data && topOperatorsData.data.length > 0) {
      const transformedData = (
        topOperatorsData.data as Array<{
          operatorId: string;
          name: string;
          avatar: string | null;
          successRate: number;
          totalOrders: number;
        }>
      ).map((operator, index) => {
        const baseRevenue = (operator.totalOrders ?? 0) * 50;
        const growth = ((operator.successRate ?? 0) * 0.25).toFixed(1);

        return {
          id: operator.operatorId || `operator-${index}`,
          name: operator.name,
          role: "Operator", // API doesn't provide role, so we use a default
          revenue: `$${baseRevenue.toLocaleString()}`,
          growth: `+${growth}%`,
          avatar: operator.avatar || `https://i.pravatar.cc/150?img=${index}`
        };
      });

      if (!operatorId) {
        return transformedData;
      }

      return transformedData.filter((operator) => operator.id === operatorId);
    }

    return [];
  }, [operatorId, topOperatorsData]);

  const isLoading =
    revenueAnalyticsLoading || orderVolumeLoading || paymentSuccessLoading || topOperatorsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <StatsCardGridSkeleton />
        <ChartGridSkeleton />
        <TableSkeleton />
      </div>
    );
  }

  if (revenueAnalyticsError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load reports data. Please try again.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="gap-4 md:grid-cols-2 grid">
        {mappedStatsData.map((stat) => (
          <StatsCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            iconBgColor={stat.iconBgColor}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="gap-4 lg:grid-cols-2 grid">
        <OrderVolumeChart data={mappedOrderVolumeData} />
        <PaymentSuccessRateChart data={mappedPaymentSuccessData} />
      </div>

      {/* Operator Performance */}
      <OperatorPerformance data={filteredOperatorPerformanceData} />
    </div>
  );
}
