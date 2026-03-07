"use client";

import { Suspense, useMemo, useState } from "react";

import { Filter } from "lucide-react";

import { Button } from "@/ui/button";

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
import DashboardFilterSheet, { type DashboardFilters } from "./dashboard-filter-sheet";
import { ChartGridSkeleton, StatsCardGridSkeleton, TableSkeleton } from "./skeleton-loaders";
import StorePerformanceTable from "./store-performance-table";

export default function DashboardPage() {
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const filteredDashboardStats = useMemo(() => {
    if (!filters.operatorId) {
      return dashboardStats;
    }

    const operatorHiddenStats = ["Active operators", "Membership count", "Membership churn"];
    return dashboardStats.filter((stat) => !operatorHiddenStats.includes(stat.title));
  }, [filters.operatorId]);

  const selectedOperatorFactor = useMemo(() => {
    if (!filters.operatorId) {
      return 1;
    }

    const operatorIndex = Number(filters.operatorId.split("-")[1] ?? "1");
    return 0.8 + (operatorIndex % 5) * 0.04;
  }, [filters.operatorId]);

  const filteredMonthlyRevenueData = useMemo(() => {
    if (!filters.dateRange?.from) {
      return monthlyRevenueData;
    }

    const monthLookup = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11
    } as const;

    const fromDate = new Date(filters.dateRange.from);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(filters.dateRange.to ?? filters.dateRange.from);
    toDate.setHours(23, 59, 59, 999);

    const currentYear = new Date().getFullYear();

    return monthlyRevenueData.filter((item) => {
      const monthIndex = monthLookup[item.month as keyof typeof monthLookup];
      const itemDate = new Date(currentYear, monthIndex, 1);
      return itemDate >= fromDate && itemDate <= toDate;
    });
  }, [filters.dateRange]);

  const filteredTopOperatorsData = useMemo(() => {
    if (!filters.operatorId) {
      return topOperatorsData;
    }

    return topOperatorsData.filter((operator) => operator.operatorId === filters.operatorId);
  }, [filters.operatorId]);

  const filteredOrdersData = useMemo(() => {
    if (!filters.operatorId) {
      return ordersData;
    }

    return ordersData.map((item) => ({
      ...item,
      orders: Math.max(Math.round(item.orders * selectedOperatorFactor), 0)
    }));
  }, [filters.operatorId, selectedOperatorFactor]);

  const filteredOrderStatusData = useMemo(() => {
    if (!filters.operatorId) {
      return orderStatusData;
    }

    return orderStatusData.map((item) => ({
      ...item,
      value: Math.max(Math.round(item.value * selectedOperatorFactor), 1)
    }));
  }, [filters.operatorId, selectedOperatorFactor]);

  const filteredStorePerformanceData = useMemo(() => {
    const monthLookup = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11
    } as const;

    const currentYear = new Date().getFullYear();

    let result = storePerformanceData;

    if (filters.dateRange?.from) {
      const fromDate = new Date(filters.dateRange.from);
      fromDate.setHours(0, 0, 0, 0);

      const toDate = new Date(filters.dateRange.to ?? filters.dateRange.from);
      toDate.setHours(23, 59, 59, 999);

      result = result.filter((item) => {
        const monthIndex = monthLookup[item.month as keyof typeof monthLookup];
        const itemDate = new Date(currentYear, monthIndex, 1);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    if (!filters.operatorId) {
      return result;
    }

    return result.map((item) => ({
      ...item,
      currentSales: Math.max(Math.round(item.currentSales * selectedOperatorFactor), 0),
      previousSales: Math.max(Math.round(item.previousSales * selectedOperatorFactor), 0),
      growth: Number(item.growth.toFixed(1))
    }));
  }, [filters.dateRange, filters.operatorId, selectedOperatorFactor]);

  return (
    <section className="">
      <Header
        title="Dashboard"
        subtitle="Welcome to the admin dashboard!"
        Button={
          <Button variant="outline" size="icon" onClick={() => setFilterSheetOpen(true)}>
            <Filter className="h-4 w-4" />
          </Button>
        }
      />

      {/* Stats Cards */}
      <Suspense fallback={<StatsCardGridSkeleton />}>
        <div className="mt-6 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid">
          {filteredDashboardStats.map((stat, index) => (
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
            <MonthlyRevenueChart data={filteredMonthlyRevenueData} />
          </div>
          <OrderStatusChart data={filteredOrderStatusData} />
        </div>
      </Suspense>

      <Suspense fallback={<ChartGridSkeleton />}>
        <div className="mt-6 gap-4 lg:grid-cols-3 grid">
          <div className="lg:col-span-2">
            <OrdersChart data={filteredOrdersData} />
          </div>
          <TopOperators data={filteredTopOperatorsData} />
        </div>
      </Suspense>

      {/* Store Performance Table */}
      <Suspense fallback={<TableSkeleton />}>
        <div className="mt-6">
          <StorePerformanceTable data={filteredStorePerformanceData} />
        </div>
      </Suspense>

      <DashboardFilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        filters={filters}
        onApplyFilters={setFilters}
        onClearFilters={() => setFilters({})}
      />
    </section>
  );
}
