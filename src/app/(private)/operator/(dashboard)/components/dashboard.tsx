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

import Header from "../../components/header";
import MonthlyRevenueChart from "../../components/monthly-revenue-chart";
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
  const [revenueFilter, setRevenueFilter] = useState<RevenueFilter>(12);

  const { data: operatorMe } = useGetOperatorMe();
  const { data: statsResponse } = useGetOperatorDashboardStats();
  const { data: revenueChartResponse } = useGetOperatorRevenueChart(revenueFilter);
  const { data: topServicesResponse } = useGetOperatorTopServices();
  const { data: recentOrdersResponse } = useGetMyRecentOrders();

  const operatorName = operatorMe?.data?.name || "Operator";
  const storeName = operatorMe?.data?.operatorProfile?.stores?.[0]?.name || "your store";

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
      <Header
        title={`Welcome back, ${operatorName}!`}
        subtitle={`Here's what's happening with ${storeName} today.`}
      />

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
