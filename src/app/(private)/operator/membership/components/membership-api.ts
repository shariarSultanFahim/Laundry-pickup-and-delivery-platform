"use client";

import type {
  FetchMembershipBreakdownParams,
  MembershipBreakdownData,
  MembershipOrdersTrendItem,
  MembershipSummaryRow
} from "@/types/membership-breakdown";

interface MonthlySnapshot {
  membershipOrders: number;
  nonMembershipOrders: number;
  membershipRevenue: number;
  nonMembershipRevenue: number;
}

const monthlySnapshots: Record<string, MonthlySnapshot> = {
  "2025-11": {
    membershipOrders: 102,
    nonMembershipOrders: 76,
    membershipRevenue: 20400,
    nonMembershipRevenue: 11400
  },
  "2025-12": {
    membershipOrders: 110,
    nonMembershipOrders: 79,
    membershipRevenue: 22000,
    nonMembershipRevenue: 11850
  },
  "2026-01": {
    membershipOrders: 120,
    nonMembershipOrders: 80,
    membershipRevenue: 24000,
    nonMembershipRevenue: 12000
  },
  "2026-02": {
    membershipOrders: 130,
    nonMembershipOrders: 92,
    membershipRevenue: 26000,
    nonMembershipRevenue: 13800
  },
  "2026-03": {
    membershipOrders: 150,
    nonMembershipOrders: 108,
    membershipRevenue: 30000,
    nonMembershipRevenue: 16200
  },
  "2026-04": {
    membershipOrders: 140,
    nonMembershipOrders: 98,
    membershipRevenue: 28000,
    nonMembershipRevenue: 14700
  },
  "2026-05": {
    membershipOrders: 136,
    nonMembershipOrders: 94,
    membershipRevenue: 27200,
    nonMembershipRevenue: 14100
  },
  "2026-06": {
    membershipOrders: 124,
    nonMembershipOrders: 88,
    membershipRevenue: 24800,
    nonMembershipRevenue: 13200
  }
};

const monthLabels: Record<string, string> = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec"
};

function getLastSixMonthsSnapshots(targetYear: string, targetMonth: string) {
  const snapshots: Array<{ key: string; label: string; data: MonthlySnapshot }> = [];

  const dateCursor = new Date(Number(targetYear), Number(targetMonth) - 1, 1);

  for (let index = 5; index >= 0; index -= 1) {
    const sample = new Date(dateCursor);
    sample.setMonth(sample.getMonth() - index);

    const year = sample.getFullYear();
    const month = String(sample.getMonth() + 1).padStart(2, "0");
    const key = `${year}-${month}`;
    const data = monthlySnapshots[key] ?? {
      membershipOrders: 0,
      nonMembershipOrders: 0,
      membershipRevenue: 0,
      nonMembershipRevenue: 0
    };

    snapshots.push({
      key,
      label: monthLabels[month],
      data
    });
  }

  return snapshots;
}

function buildSummaryRows(
  membershipOrders: number,
  nonMembershipOrders: number,
  membershipRevenue: number,
  nonMembershipRevenue: number
): { rows: MembershipSummaryRow[]; totalOrders: number; totalRevenue: number } {
  const totalOrders = membershipOrders + nonMembershipOrders;
  const totalRevenue = membershipRevenue + nonMembershipRevenue;

  const membershipPercentage = totalOrders === 0 ? 0 : (membershipOrders / totalOrders) * 100;
  const nonMembershipPercentage = totalOrders === 0 ? 0 : (nonMembershipOrders / totalOrders) * 100;

  const rows: MembershipSummaryRow[] = [
    {
      orderType: "Membership Orders",
      totalOrders: membershipOrders,
      percentage: Number(membershipPercentage.toFixed(0)),
      revenue: membershipRevenue,
      averageOrderValue:
        membershipOrders === 0 ? 0 : Number((membershipRevenue / membershipOrders).toFixed(0)),
      colorClassName: "bg-blue-500"
    },
    {
      orderType: "Non-Membership Orders",
      totalOrders: nonMembershipOrders,
      percentage: Number(nonMembershipPercentage.toFixed(0)),
      revenue: nonMembershipRevenue,
      averageOrderValue:
        nonMembershipOrders === 0
          ? 0
          : Number((nonMembershipRevenue / nonMembershipOrders).toFixed(0)),
      colorClassName: "bg-green-500"
    }
  ];

  return { rows, totalOrders, totalRevenue };
}

function buildTodayTrend(): MembershipOrdersTrendItem[] {
  return [
    { label: "6 AM", membershipOrders: 2, nonMembershipOrders: 1 },
    { label: "9 AM", membershipOrders: 4, nonMembershipOrders: 2 },
    { label: "12 PM", membershipOrders: 3, nonMembershipOrders: 2 },
    { label: "3 PM", membershipOrders: 5, nonMembershipOrders: 3 },
    { label: "6 PM", membershipOrders: 4, nonMembershipOrders: 3 },
    { label: "9 PM", membershipOrders: 2, nonMembershipOrders: 1 }
  ];
}

export async function fetchMembershipBreakdown({
  filter
}: FetchMembershipBreakdownParams): Promise<MembershipBreakdownData> {
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);

  const parsedFromDate = new Date(`${filter.fromDate}T00:00:00`);
  const parsedToDate = new Date(`${filter.toDate}T00:00:00`);

  const fromDate = Number.isNaN(parsedFromDate.getTime())
    ? new Date(`${todayIso}T00:00:00`)
    : parsedFromDate;
  const toDate = Number.isNaN(parsedToDate.getTime())
    ? new Date(`${todayIso}T00:00:00`)
    : parsedToDate;

  const safeFrom = fromDate <= toDate ? fromDate : toDate;
  const safeTo = fromDate <= toDate ? toDate : fromDate;

  const safeFromIso = safeFrom.toISOString().slice(0, 10);
  const safeToIso = safeTo.toISOString().slice(0, 10);

  const last30StartDate = new Date(`${todayIso}T00:00:00`);
  last30StartDate.setDate(last30StartDate.getDate() - 29);
  const last30StartIso = last30StartDate.toISOString().slice(0, 10);

  const isTodayRange = safeFromIso === todayIso && safeToIso === todayIso;
  const isLast30DaysRange = safeFromIso === last30StartIso && safeToIso === todayIso;

  const defaultSnapshot = monthlySnapshots["2026-01"];

  let membershipOrders = defaultSnapshot.membershipOrders;
  let nonMembershipOrders = defaultSnapshot.nonMembershipOrders;
  let membershipRevenue = defaultSnapshot.membershipRevenue;
  let nonMembershipRevenue = defaultSnapshot.nonMembershipRevenue;
  let ordersOverTime: MembershipOrdersTrendItem[] = [];
  let membershipGrowthPercent = 12;
  let nonMembershipGrowthPercent = 8;

  if (isTodayRange) {
    membershipOrders = 18;
    nonMembershipOrders = 12;
    membershipRevenue = 3600;
    nonMembershipRevenue = 1800;
    ordersOverTime = buildTodayTrend();
    membershipGrowthPercent = 6;
    nonMembershipGrowthPercent = 4;
  }

  if (isLast30DaysRange) {
    membershipOrders = 120;
    nonMembershipOrders = 80;
    membershipRevenue = 24000;
    nonMembershipRevenue = 12000;

    const timeline = getLastSixMonthsSnapshots("2026", "06");
    ordersOverTime = timeline.map((item) => ({
      label: item.label,
      membershipOrders: Math.round(item.data.membershipOrders / 6),
      nonMembershipOrders: Math.round(item.data.nonMembershipOrders / 6)
    }));

    membershipGrowthPercent = 12;
    nonMembershipGrowthPercent = 8;
  }

  if (!isTodayRange && !isLast30DaysRange) {
    const selectedMonth = String(safeTo.getMonth() + 1).padStart(2, "0");
    const selectedYear = String(safeTo.getFullYear());

    const snapshotKey = `${selectedYear}-${selectedMonth}`;
    const selectedSnapshot = monthlySnapshots[snapshotKey] ?? defaultSnapshot;

    const rangeDays = Math.max(
      1,
      Math.floor((safeTo.getTime() - safeFrom.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );
    const scaleFactor = Math.min(rangeDays, 30) / 30;

    membershipOrders = Math.round(selectedSnapshot.membershipOrders * scaleFactor);
    nonMembershipOrders = Math.round(selectedSnapshot.nonMembershipOrders * scaleFactor);
    membershipRevenue = Math.round(selectedSnapshot.membershipRevenue * scaleFactor);
    nonMembershipRevenue = Math.round(selectedSnapshot.nonMembershipRevenue * scaleFactor);

    const timeline = getLastSixMonthsSnapshots(selectedYear, selectedMonth);
    ordersOverTime = timeline.map((item) => ({
      label: item.label,
      membershipOrders: Math.round(item.data.membershipOrders / 6),
      nonMembershipOrders: Math.round(item.data.nonMembershipOrders / 6)
    }));

    const previousMonth = new Date(Number(selectedYear), Number(selectedMonth) - 2, 1);
    const previousKey = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, "0")}`;
    const previousSnapshot = monthlySnapshots[previousKey];

    if (previousSnapshot) {
      const membershipDelta = membershipOrders - previousSnapshot.membershipOrders;
      const nonMembershipDelta = nonMembershipOrders - previousSnapshot.nonMembershipOrders;

      membershipGrowthPercent =
        previousSnapshot.membershipOrders === 0
          ? 0
          : Math.round((membershipDelta / previousSnapshot.membershipOrders) * 100);
      nonMembershipGrowthPercent =
        previousSnapshot.nonMembershipOrders === 0
          ? 0
          : Math.round((nonMembershipDelta / previousSnapshot.nonMembershipOrders) * 100);
    }
  }

  const { rows, totalOrders, totalRevenue } = buildSummaryRows(
    membershipOrders,
    nonMembershipOrders,
    membershipRevenue,
    nonMembershipRevenue
  );

  const averageOrderValue = totalOrders === 0 ? 0 : Number((totalRevenue / totalOrders).toFixed(0));

  await new Promise((resolve) => setTimeout(resolve, 350));

  return {
    membershipOrders,
    nonMembershipOrders,
    membershipGrowthPercent,
    nonMembershipGrowthPercent,
    distribution: [
      { name: "Membership Orders", orders: membershipOrders, fill: "#3b82f6" },
      { name: "Non-Membership Orders", orders: nonMembershipOrders, fill: "#84cc16" }
    ],
    ordersOverTime,
    summaryRows: rows,
    summaryTotals: {
      totalOrders,
      totalRevenue,
      averageOrderValue
    }
  };
}
