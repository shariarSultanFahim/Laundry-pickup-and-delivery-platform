import { Suspense } from "react";

import Header from "../../components/header";
import MonthlyRevenueChart from "../../components/monthly-revenue-chart";
import OrderStatusChart from "../../components/order-status-chart";
import OrdersChart from "../../components/orders-chart";
import StatsCard from "../../components/statsCard";
import TopOperators from "../../components/top-operators";
import {
  dashboardStats,
  monthlyRevenueData,
  ordersData,
  orderStatusData,
  storePerformanceData,
  topOperatorsData
} from "../data/dashboard";
import { ChartGridSkeleton, StatsCardGridSkeleton, TableSkeleton } from "./skeleton-loaders";
import StorePerformanceTable from "./store-performance-table";

export default function DashboardPage() {
  return (
    <section className="">
      <Header title="Dashboard" subtitle="Welcome to the admin dashboard!" />

      {/* Stats Cards */}
      <Suspense fallback={<StatsCardGridSkeleton />}>
        <div className="mt-6 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid">
          {dashboardStats.map((stat, index) => (
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
      </Suspense>

      {/* Charts Section */}
      <Suspense fallback={<ChartGridSkeleton />}>
        <div className="mt-6 gap-4 lg:grid-cols-3 grid">
          <div className="lg:col-span-2">
            <MonthlyRevenueChart data={monthlyRevenueData} />
          </div>
          <OrderStatusChart data={orderStatusData} />
        </div>
      </Suspense>

      <Suspense fallback={<ChartGridSkeleton />}>
        <div className="mt-6 gap-4 lg:grid-cols-3 grid">
          <div className="lg:col-span-2">
            <OrdersChart data={ordersData} />
          </div>
          <TopOperators data={topOperatorsData} />
        </div>
      </Suspense>

      {/* Store Performance Table */}
      <Suspense fallback={<TableSkeleton />}>
        <div className="mt-6">
          <StorePerformanceTable data={storePerformanceData} />
        </div>
      </Suspense>
    </section>
  );
}
