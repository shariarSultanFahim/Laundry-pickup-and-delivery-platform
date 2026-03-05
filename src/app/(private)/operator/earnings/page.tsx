import Header from "../components/header";
import EarningsOverview from "./components/earnings-overview";
import NextPayoutCard from "./components/next-payout-card";
import PayoutHistoryTable from "./components/payout-history-table";
import { earningsStats, nextPayoutInfo } from "./data/earnings";

export default function OperatorEarningsPage() {
  return (
    <div className="space-y-6">
      <Header title="Earnings" subtitle="View and track your earnings and payouts" />

      {/* Earnings Overview Stats */}
      <EarningsOverview stats={earningsStats} netPayout={nextPayoutInfo.amount} />

      {/* Next Payout Card */}
      <NextPayoutCard data={nextPayoutInfo} />

      {/* Payout History Table */}
      <PayoutHistoryTable />
    </div>
  );
}
