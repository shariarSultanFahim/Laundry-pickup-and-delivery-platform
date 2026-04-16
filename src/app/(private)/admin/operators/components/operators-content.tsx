"use client";

import { useGetOperatorActivityOverview } from "@/lib/actions/admin/use-analytics";

import OperatorsStatsCards from "./operators-stats-cards";
import OperatorsTable from "./operators-table";

export default function OperatorsContent() {
  const { data: operatorActivityData, isLoading } = useGetOperatorActivityOverview();

  return (
    <div className="space-y-6">
      <OperatorsStatsCards data={operatorActivityData?.data} isLoading={isLoading} />
      <OperatorsTable />
    </div>
  );
}
