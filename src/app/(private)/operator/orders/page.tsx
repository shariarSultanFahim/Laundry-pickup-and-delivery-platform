"use client";

import { useMemo, useState } from "react";

import { TrendingDown, TrendingUp } from "lucide-react";

import { useGetOperatorPerformanceMetrics } from "@/lib/actions/operator/use-operator-dashboard";

import { Card } from "@/components/ui";

import OperatorStoreCombobox from "../components/operator-store-combobox";
import StatsCard from "../components/statsCard";
import { NewOrdersTable, OrdersTable } from "./components";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2
});

const formatPercent = (value: number) => `${value}%`;

const formatDelta = (value: number, metricType: "percent" | "currency") => {
  if (metricType === "currency") {
    return CURRENCY_FORMATTER.format(value);
  }

  return `${value}%`;
};

export default function OperatorOrdersPage() {
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const storeId = selectedStoreId || undefined;

  const { data: performanceMetricsResponse } = useGetOperatorPerformanceMetrics({ storeId });

  const metrics = performanceMetricsResponse?.data;

  const operatorOrdersStats = useMemo(
    () => [
      {
        title: "Cancellation Rate",
        value: formatPercent(metrics?.cancellationRate.value ?? 0),
        change: {
          value: formatDelta(metrics?.cancellationRate.change ?? 0, "percent"),
          trend: metrics?.cancellationRate.direction ?? "down",
          tone: ((metrics?.cancellationRate.direction ?? "down") === "down"
            ? "positive"
            : "negative") as "positive" | "negative",
          period: "vs last week"
        },
        icon:
          (metrics?.cancellationRate.direction ?? "down") === "down" ? TrendingDown : TrendingUp,
        iconBgColor:
          (metrics?.cancellationRate.direction ?? "down") === "down"
            ? "bg-green-100"
            : "bg-red-100",
        iconColor:
          (metrics?.cancellationRate.direction ?? "down") === "down"
            ? "text-green-600"
            : "text-red-600"
      },
      {
        title: "Repeat Customer Rate",
        value: formatPercent(metrics?.repeatedCustomerRate.value ?? 0),
        change: {
          value: formatDelta(metrics?.repeatedCustomerRate.change ?? 0, "percent"),
          trend: metrics?.repeatedCustomerRate.direction ?? "up",
          period: "vs last week"
        },
        icon:
          (metrics?.repeatedCustomerRate.direction ?? "up") === "up" ? TrendingUp : TrendingDown,
        iconBgColor:
          (metrics?.repeatedCustomerRate.direction ?? "up") === "up"
            ? "bg-green-100"
            : "bg-red-100",
        iconColor:
          (metrics?.repeatedCustomerRate.direction ?? "up") === "up"
            ? "text-green-600"
            : "text-red-600"
      },
      {
        title: "On-time Completion",
        value: formatPercent(metrics?.ontimeCompletion.value ?? 0),
        change: {
          value: formatDelta(metrics?.ontimeCompletion.change ?? 0, "percent"),
          trend: metrics?.ontimeCompletion.direction ?? "up",
          period: "vs last week"
        },
        icon: (metrics?.ontimeCompletion.direction ?? "up") === "up" ? TrendingUp : TrendingDown,
        iconBgColor:
          (metrics?.ontimeCompletion.direction ?? "up") === "up" ? "bg-green-100" : "bg-red-100",
        iconColor:
          (metrics?.ontimeCompletion.direction ?? "up") === "up" ? "text-green-600" : "text-red-600"
      },
      {
        title: "Average Ticket",
        value: CURRENCY_FORMATTER.format(metrics?.averageTicket.value ?? 0),
        change: {
          value: formatDelta(metrics?.averageTicket.change ?? 0, "currency"),
          trend: metrics?.averageTicket.direction ?? "up",
          period: "vs last week"
        },
        subtitle: `Total orders: ${metrics?.totalOrders ?? 0}`,
        icon: (metrics?.averageTicket.direction ?? "up") === "up" ? TrendingUp : TrendingDown,
        iconBgColor:
          (metrics?.averageTicket.direction ?? "up") === "up" ? "bg-green-100" : "bg-red-100",
        iconColor:
          (metrics?.averageTicket.direction ?? "up") === "up" ? "text-green-600" : "text-red-600"
      }
    ],
    [metrics]
  );

  return (
    <div className="space-y-6">
      <Card className="p-6 gap-2 md:flex-row flex-col items-center justify-between">
        <div className="gap-2 flex flex-col items-start justify-center">
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">Manage and view all your orders</p>
        </div>
        <OperatorStoreCombobox
          value={selectedStoreId}
          onValueChange={setSelectedStoreId}
          mode="none"
          placeholder="All stores"
        />
      </Card>

      {/* Stats Cards */}
      <div className="gap-4 sm:grid-cols-2 lg:grid-cols-4 grid">
        {operatorOrdersStats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            subtitle={stat.subtitle}
            icon={stat.icon}
            iconBgColor={stat.iconBgColor}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* New Orders */}
      <NewOrdersTable />

      {/* Orders Table */}
      <OrdersTable />
    </div>
  );
}
