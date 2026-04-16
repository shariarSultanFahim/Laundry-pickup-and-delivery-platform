"use client";

import { useMemo, useState } from "react";

import { useGetOperatorDashboardStats } from "@/lib/actions/operator/use-operator-dashboard";
import { formatDate } from "@/lib/date";

import { Card } from "@/components/ui";

import OperatorStoreCombobox from "../components/operator-store-combobox";
import EarningsOverview from "./components/earnings-overview";
import NextPayoutCard from "./components/next-payout-card";
import PayoutHistoryTable from "./components/payout-history-table";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2
});

export default function OperatorEarningsPage() {
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const storeId = selectedStoreId || undefined;

  const { data: statsResponse } = useGetOperatorDashboardStats({ storeId });

  const stats = statsResponse?.data;

  const earningsStats = useMemo(
    () => [
      {
        title: "Gross Revenue",
        value: CURRENCY_FORMATTER.format(stats?.grossRevenue ?? 0),
        subtitle: "Total revenue from orders"
      },
      {
        title: "Commission",
        value: `-${CURRENCY_FORMATTER.format(stats?.platformCommission ?? 0)}`,
        subtitle: "Platform fee"
      },
      {
        title: "Processing",
        value: String(stats?.processingOrders ?? 0),
        subtitle: "Orders in processing"
      }
    ],
    [stats]
  );

  const nextPayoutInfo = useMemo(
    () => ({
      amount: CURRENCY_FORMATTER.format(stats?.netPayout ?? 0),
      nextPayoutDate: formatDate(stats?.nextPayout?.scheduledDate ?? new Date().toISOString()),
      nextPayoutAmount: CURRENCY_FORMATTER.format(stats?.nextPayout?.amount ?? 0)
    }),
    [stats]
  );

  return (
    <div className="space-y-6">
      <Card className="p-6 gap-2 md:flex-row flex-col items-center justify-between">
        <div className="gap-2 flex flex-col items-start justify-center">
          <h1 className="text-2xl font-bold">Earnings</h1>
          <p className="text-sm text-muted-foreground">View and track your earnings and payouts</p>
        </div>
        <OperatorStoreCombobox
          value={selectedStoreId}
          onValueChange={setSelectedStoreId}
          mode="none"
          placeholder="All stores"
        />
      </Card>

      {/* Earnings Overview Stats */}
      <EarningsOverview stats={earningsStats} netPayout={nextPayoutInfo.amount} />

      {/* Next Payout Card */}
      <NextPayoutCard data={nextPayoutInfo} />

      {/* Payout History Table */}
      <PayoutHistoryTable storeId={storeId} />
    </div>
  );
}
