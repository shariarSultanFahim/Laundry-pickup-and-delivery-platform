"use client";

import { useMemo, useState } from "react";

import { DollarSign, Settings, ShoppingCart, Truck } from "lucide-react";

import {
  RevenueFilter,
  useGetMyRecentOrders,
  useGetOperatorDashboardStats,
  useGetOperatorRevenueChart,
  useGetOperatorTopServices
} from "@/lib/actions/operator/use-operator-dashboard";
import { useGetOperatorMe } from "@/lib/actions/user/get.operator-me";

import { Card } from "@/components/ui";

import MonthlyRevenueChart from "../../components/monthly-revenue-chart";
import OperatorStoreCombobox from "../../components/operator-store-combobox";
import StatsCard from "../../components/statsCard";
import type { StatsCardData } from "../data/dashboard";
import RecentOrdersTable from "./recent-orders-table";
import TopSellingServices from "./top-selling-services";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2
});

export default function DashboardPage() {
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [revenueFilter, setRevenueFilter] = useState<RevenueFilter>(12);

  const { data: operatorMe } = useGetOperatorMe();
  const storeId = selectedStoreId || undefined;

  const { data: statsResponse } = useGetOperatorDashboardStats({ storeId });
  const { data: revenueChartResponse } = useGetOperatorRevenueChart(revenueFilter, { storeId });
  const { data: topServicesResponse } = useGetOperatorTopServices({ storeId });
  const { data: recentOrdersResponse } = useGetMyRecentOrders();

  const operatorName = operatorMe?.data?.name || "Operator";
  const dashboardSubtitle = selectedStoreId
    ? "Here's what's happening in the selected store today."
    : "Here's what's happening across all stores today.";

  const stats = statsResponse?.data;

  const dashboardStats = useMemo<StatsCardData[]>(
    () => [
      {
        title: "Total Orders",
        value: stats?.totalOrders ?? 0,
        icon: ShoppingCart,
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600"
      },
      {
        title: "Total Revenue",
        value: CURRENCY_FORMATTER.format(stats?.totalRevenue ?? 0),
        subtitle: `Net payout: ${CURRENCY_FORMATTER.format(stats?.netPayout ?? 0)}`,
        icon: DollarSign,
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600"
      },
      {
        title: "In Processing",
        value: stats?.processingOrders ?? 0,
        subtitle: `Completed: ${stats?.completedOrders ?? 0}`,
        icon: Settings,
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600"
      },
      {
        title: "Out for Delivery",
        value: stats?.outForDeliveryOrders ?? 0,
        subtitle: `Wallet: ${CURRENCY_FORMATTER.format(stats?.walletBalance ?? 0)}`,
        icon: Truck,
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600"
      }
    ],
    [stats]
  );

  const monthlyRevenueData = useMemo(() => {
    return revenueChartResponse?.data?.data ?? [];
  }, [revenueChartResponse]);

  const topSellingServices = useMemo(() => {
    return topServicesResponse?.data ?? [];
  }, [topServicesResponse]);

  const recentOrders = useMemo(() => {
    return recentOrdersResponse?.data ?? [];
  }, [recentOrdersResponse]);

  return (
    <div className="space-y-6">
      <Card className="p-6 gap-2 md:flex-row flex-col items-center justify-between">
        <div className="gap-2 flex flex-col items-start justify-center">
          <h1 className="text-2xl font-bold">{`Welcome back, ${operatorName}!`}</h1>
          <p className="text-sm text-muted-foreground">{dashboardSubtitle}</p>
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
        {dashboardStats.map((stat, index) => (
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

      {/* Charts Section */}
      <div className="gap-4 lg:grid-cols-3 grid">
        <div className="lg:col-span-2">
          <MonthlyRevenueChart
            data={monthlyRevenueData}
            selectedPeriod={revenueFilter}
            onPeriodChange={setRevenueFilter}
          />
        </div>
        <TopSellingServices data={topSellingServices} />
      </div>

      {/* Recent Orders Table */}
      <RecentOrdersTable data={recentOrders} />
    </div>
  );
}
