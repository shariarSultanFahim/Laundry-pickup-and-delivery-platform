"use client";

import { useState } from "react";

import StatsCard from "../../components/statsCard";
import {
  keyInsights,
  orderStatusDistribution,
  performanceMetrics,
  reportingStats,
  weeklyOrdersData
} from "../data/reporting";
import KeyInsights from "./key-insights";
import OrderStatusDistributionChart from "./order-status-distribution-chart";
import PerformanceSummary from "./performance-summary";
import ReportingHeader from "./reporting-header";
import WeeklyOrdersChart from "./weekly-orders-chart";

export default function ReportingPageContent() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPeriod, setSelectedPeriod] = useState<
    "today" | "last-7-days" | "last-month" | "6-months" | "year" | "lifetime"
  >("last-7-days");

  const handlePeriodChange = (
    period: "today" | "last-7-days" | "last-month" | "6-months" | "year" | "lifetime"
  ) => {
    setSelectedPeriod(period);
    // Data updates can be triggered here based on the selected period
    // This can be connected to API calls or data filtering logic
  };

  return (
    <div className="space-y-6">
      <ReportingHeader
        title="Reporting Dashboard"
        subtitle="Monitor your operations performance and analytics"
        onPeriodChange={handlePeriodChange}
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
      <KeyInsights insights={keyInsights} />
    </div>
  );
}
