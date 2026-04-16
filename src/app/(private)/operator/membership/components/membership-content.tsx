"use client";

import { useMemo } from "react";

import type {
  MembershipBreakdownData,
  MembershipDistributionItem,
  MembershipSummaryRow
} from "@/types/membership-breakdown";

import {
  useGetMembershipStats,
  useGetOrderDistribution,
  useGetOrdersOverTime,
  useGetOrderSummary
} from "@/lib/actions/operator/use-operator-membership";

import { Card, CardContent } from "@/ui/card";

import MembershipCharts from "./membership-charts";
import MembershipStatsCards from "./membership-stats-cards";
import MembershipSummaryTable from "./membership-summary-table";

export default function MembershipContent() {
  // Fetch data from API
  const { data: statsData, isLoading: isLoadingStats } = useGetMembershipStats();

  const { data: distributionData, isLoading: isLoadingDistribution } = useGetOrderDistribution();

  const { data: ordersOverTimeData, isLoading: isLoadingOverTime } = useGetOrdersOverTime({
    months: 6
  });

  const { data: summaryData, isLoading: isLoadingSummary } = useGetOrderSummary();

  const isLoading =
    isLoadingStats || isLoadingDistribution || isLoadingOverTime || isLoadingSummary;

  // Transform API responses to component data structure
  const data = useMemo((): MembershipBreakdownData | null => {
    if (
      !statsData?.data ||
      !distributionData?.data ||
      !ordersOverTimeData?.data ||
      !summaryData?.data
    ) {
      return null;
    }

    const stats = statsData.data;
    const distribution = distributionData.data;
    const ordersOverTime = ordersOverTimeData.data;
    const summary = summaryData.data;

    // Convert distribution to expected format
    const distributionFormatted: MembershipDistributionItem[] = distribution.map((item) => ({
      name: item.label,
      orders: item.value,
      fill: item.label === "Membership Orders" ? "#3b82f6" : "#84cc16"
    }));

    // Convert orders over time
    const ordersOverTimeFormatted = ordersOverTime.map((item) => ({
      label: item.month,
      membershipOrders: item.membershipOrders,
      nonMembershipOrders: item.nonMembershipOrders
    }));

    // Convert summary rows to expected format
    const summaryRowsFormatted: MembershipSummaryRow[] = summary.summary.map((row) => {
      let colorClassName = "bg-gray-400";
      if (row.type === "Membership Orders") {
        colorClassName = "bg-blue-500";
      } else if (row.type === "Non-Membership Orders") {
        colorClassName = "bg-lime-600";
      }

      return {
        orderType: row.type as "Membership Orders" | "Non-Membership Orders",
        totalOrders: row.totalOrders,
        percentage: row.percentage,
        revenue: parseFloat(String(row.revenue)),
        averageOrderValue: parseFloat(String(row.avgOrderValue)),
        colorClassName
      };
    });

    // Extract totals from the summary (last row should be Total)
    const totalRow = summary.summary.find((row) => row.type === "Total");
    const summaryTotals = {
      totalOrders: totalRow?.totalOrders ?? 0,
      totalRevenue: totalRow ? parseFloat(String(totalRow.revenue)) : 0,
      averageOrderValue: totalRow ? parseFloat(String(totalRow.avgOrderValue)) : 0
    };

    // Calculate growth percentages from trend data
    const membershipGrowthPercent =
      stats.membershipOrders.direction === "up"
        ? stats.membershipOrders.trend
        : -stats.membershipOrders.trend;

    const nonMembershipGrowthPercent =
      stats.nonMembershipOrders.direction === "up"
        ? stats.nonMembershipOrders.trend
        : -stats.nonMembershipOrders.trend;

    return {
      membershipOrders: stats.membershipOrders.count,
      nonMembershipOrders: stats.nonMembershipOrders.count,
      membershipGrowthPercent,
      nonMembershipGrowthPercent,
      distribution: distributionFormatted,
      ordersOverTime: ordersOverTimeFormatted,
      summaryRows: summaryRowsFormatted,
      summaryTotals
    };
  }, [statsData, distributionData, ordersOverTimeData, summaryData]);

  if (isLoading || !data) {
    return (
      <Card>
        <CardContent className="h-40 text-muted-foreground flex items-center justify-center">
          Loading membership breakdown...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <MembershipStatsCards data={data} />
      <MembershipCharts data={data} />
      <MembershipSummaryTable data={data} />
    </div>
  );
}
