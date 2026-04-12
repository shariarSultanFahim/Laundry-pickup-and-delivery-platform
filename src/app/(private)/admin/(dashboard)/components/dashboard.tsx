"use client";

import { useMemo, useState } from "react";

import {
  Banknote,
  Clock,
  CreditCard,
  DollarSign,
  Percent,
  RefreshCw,
  ShoppingCart,
  TrendingDown,
  UserPlus,
  UserRound,
  UserX,
} from "lucide-react";


import { useGetAdminStats, useGetOrdersChart, useGetRevenueChart, useGetStorePerformance, useGetTopOperators } from "@/lib/actions/admin/use-analytics";
import Header from "../../components/header";
import MonthlyRevenueChart from "../../components/monthly-revenue-chart";
import OrdersChart from "../../components/orders-chart";
import StatsCard from "../../components/statsCard";
import TopOperators from "../../components/top-operators";
import { ChartGridSkeleton, StatsCardGridSkeleton, TableSkeleton } from "./skeleton-loaders";
import StorePerformanceTable from "./store-performance-table";

export default function DashboardPage() {
  const [revenueFilter, setRevenueFilter] = useState("monthly");
  const [ordersPeriod, setOrdersPeriod] = useState("weekly");



  const { data: statsData, isLoading: statsLoading } = useGetAdminStats();
  const { data: revenueResponse, isLoading: revenueLoading } = useGetRevenueChart(revenueFilter);
  const { data: ordersResponse, isLoading: ordersLoading } = useGetOrdersChart(ordersPeriod);
  const { data: topOperatorsResponse, isLoading: topOperatorsLoading } = useGetTopOperators();
  const { data: performanceResponse, isLoading: performanceLoading } = useGetStorePerformance();

  const stats = statsData?.data;

  const mappedStats = useMemo(() => {
    return [
      {
        title: "Total Orders",
        value: stats?.totalOrders?.value?.toLocaleString() ?? "0",
        change: stats?.totalOrders?.change !== undefined ? {
          value: `${stats.totalOrders.change}%`,
          trend: stats.totalOrders.direction || "up",
          period: stats.totalOrders.comparedTo || "from last period"
        } : undefined,
        icon: ShoppingCart,
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600"
      },
      {
        title: "Net Revenue",
        value: `$${(stats?.netPlatformRevenue?.value ?? 0).toLocaleString()}`,
        change: stats?.netPlatformRevenue?.change !== undefined ? {
          value: `${stats.netPlatformRevenue.change}%`,
          trend: stats.netPlatformRevenue.direction || "up",
          period: stats.netPlatformRevenue.comparedTo || "from last period"
        } : undefined,
        icon: DollarSign,
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600"
      },
      {
        title: "Repeated Customer",
        value: `${stats?.repeatedCustomerRate?.value ?? 0}%`,
        icon: RefreshCw,
        iconBgColor: "bg-purple-100",
        iconColor: "text-purple-600"
      },
      {
        title: "New Customers",
        value: stats?.newCustomers?.value?.toLocaleString() ?? "0",
        change: stats?.newCustomers?.change !== undefined ? {
          value: `${stats.newCustomers.change}%`,
          trend: stats.newCustomers.direction || "up",
          period: stats.newCustomers.comparedTo || "from last period"
        } : undefined,
        icon: UserPlus,
        iconBgColor: "bg-orange-100",
        iconColor: "text-orange-600"
      },
      {
        title: "Cancellation Rate",
        value: `${stats?.cancellationRate?.value ?? 0}%`,
        change: stats?.cancellationRate?.change !== undefined ? {
          value: `${stats.cancellationRate.change}%`,
          trend: stats.cancellationRate.direction === "up" ? "down" : "up" as "up" | "down",
          period: stats.cancellationRate.comparedTo || "from last period"
        } : undefined,
        icon: TrendingDown,
        iconBgColor: "bg-red-100",
        iconColor: "text-red-600"
      },
      {
        title: "On-Time Completion",
        value: `${stats?.onTimeCompletionRate?.value ?? 0}%`,
        change: stats?.onTimeCompletionRate?.change !== undefined ? {
          value: `${stats.onTimeCompletionRate.change}%`,
          trend: stats.onTimeCompletionRate.direction || "up",
          period: stats.onTimeCompletionRate.comparedTo || "from last period"
        } : undefined,
        icon: Clock,
        iconBgColor: "bg-amber-100",
        iconColor: "text-amber-600"
      },
      {
        title: "Avg Closing Time",
        value: stats?.avgSupportTicketClosingTime?.value ?? "0h",
        icon: Clock,
        iconBgColor: "bg-slate-100",
        iconColor: "text-slate-600"
      },
      {
        title: "Active Operators",
        value: stats?.activeOperators?.value ?? 0,
        icon: UserRound,
        iconBgColor: "bg-slate-100",
        iconColor: "text-slate-600"
      },
      {
        title: "Membership Count",
        value: stats?.membershipCount?.value ?? 0,
        icon: CreditCard,
        iconBgColor: "bg-slate-100",
        iconColor: "text-slate-600"
      },
      {
        title: "Membership Churn",
        value: stats?.membershipChurnCount?.value ?? 0,
        icon: UserX,
        iconBgColor: "bg-slate-100",
        iconColor: "text-slate-600"
      },
      {
        title: "Total GMV",
        value: `${stats?.totalGMVPercentage?.value ?? 0}%`,
        icon: Percent,
        iconBgColor: "bg-slate-100",
        iconColor: "text-slate-600"
      },
      {
        title: "Gross Revenue",
        value: `$${(stats?.grossRevenue?.value ?? 0).toLocaleString()}`,
        icon: Banknote,
        iconBgColor: "bg-slate-100",
        iconColor: "text-slate-600"
      }
    ];
  }, [stats]);

  const mappedOrderStatus = useMemo(() => {
    if (!stats?.orderStatus) return [];
    const colors: Record<string, string> = {
      pending: "#f59e0b",
      processing: "#3b82f6",
      completed: "#10b981",
      cancelled: "#ef4444",
      shipped: "#8b5cf6"
    };
    return stats.orderStatus.map(item => ({
      status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      value: item.count,
      color: colors[item.status.toLowerCase()] || "#94a3b8"
    }));
  }, [stats]);

  const mappedRevenueData = useMemo(() => {
    return revenueResponse?.data || [];
  }, [revenueResponse]);

  const mappedOrdersData = useMemo(() => {
    return ordersResponse?.data?.data?.map(item => ({
      day: item.label,
      orders: item.count
    })) || [];
  }, [ordersResponse]);

  const mappedTopOperators = useMemo(() => {
    return topOperatorsResponse?.data?.map(op => ({
      operatorId: op.operatorId,
      name: op.name,
      successRate: `${op.successRate}%`,
      avatar: op.avatar || ""
    })) || [];
  }, [topOperatorsResponse]);

  const mappedPerformance = useMemo(() => {
    return performanceResponse?.data || [];
  }, [performanceResponse]);

  return (
    <section className="">
      <Header
        title="Dashboard"
        subtitle="Welcome to the admin dashboard!"

      />

      {/* Stats Cards */}
      {statsLoading ? (
        <StatsCardGridSkeleton />
      ) : (
        <div className="mt-6 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid">
          {mappedStats.map((stat, index) => (
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
      )}

      {/* Charts Section */}
      <div className="mt-6">

        {revenueLoading ? (
          <ChartGridSkeleton />
        ) : (
          <MonthlyRevenueChart
            data={mappedRevenueData}
            filter={revenueFilter}
            onFilterChange={setRevenueFilter}
          />
        )}

      </div>

      <div className="mt-6 gap-4 lg:grid-cols-3 grid">
        <div className="lg:col-span-2">
          {ordersLoading ? (
            <ChartGridSkeleton />
          ) : (
            <OrdersChart
              data={mappedOrdersData}
              period={ordersPeriod}
              onPeriodChange={setOrdersPeriod}
            />
          )}
        </div>
        {topOperatorsLoading ? (
          <ChartGridSkeleton />
        ) : (
          <TopOperators data={mappedTopOperators} />
        )}
      </div>

      {/* Store Performance Table */}
      <div className="mt-6">
        {performanceLoading ? (
          <TableSkeleton />
        ) : (
          <StorePerformanceTable data={mappedPerformance} />
        )}
      </div>


    </section>
  );
}
