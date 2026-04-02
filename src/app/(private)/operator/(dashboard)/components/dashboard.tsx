"use client";

import { useGetOperatorMe } from "@/lib/actions/user/get.operator-me";
import Header from "../../components/header";
import MonthlyRevenueChart from "../../components/monthly-revenue-chart";
import StatsCard from "../../components/statsCard";
import {
  operatorDashboardStats,
  operatorMonthlyRevenueData,
  recentOrders,
  topSellingServices
} from "../data/dashboard";
import RecentOrdersTable from "./recent-orders-table";
import TopSellingServices from "./top-selling-services";

export default function DashboardPage() {
  const { data: operatorMe } = useGetOperatorMe();
  const operatorName = operatorMe?.data?.name || "Operator";
  const storeName = operatorMe?.data?.operatorProfile?.storeName || "your store";

  return (
    <div className="space-y-6">
      <Header
        title={`Welcome back, ${operatorName}!`}
        subtitle={`Here's what's happening with ${storeName} today.`}
      />

      {/* Stats Cards */}
      <div className="gap-4 sm:grid-cols-2 lg:grid-cols-4 grid">
        {operatorDashboardStats.map((stat, index) => (
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
          <MonthlyRevenueChart data={operatorMonthlyRevenueData} />
        </div>
        <TopSellingServices data={topSellingServices} />
      </div>

      {/* Recent Orders Table */}
      <RecentOrdersTable data={recentOrders} />
    </div>
  );
}
