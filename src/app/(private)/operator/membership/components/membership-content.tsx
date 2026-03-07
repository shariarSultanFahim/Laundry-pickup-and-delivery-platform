"use client";

import { useEffect, useState } from "react";

import type { MembershipBreakdownData, MembershipDateFilter } from "@/types/membership-breakdown";

import { Card, CardContent } from "@/ui/card";

import { fetchMembershipBreakdown } from "./membership-api";
import MembershipCharts from "./membership-charts";
import MembershipDateFilterControl from "./membership-date-filter";
import MembershipStatsCards from "./membership-stats-cards";
import MembershipSummaryTable from "./membership-summary-table";

const todayIsoDate = new Date().toISOString().slice(0, 10);

const defaultFilter: MembershipDateFilter = {
  fromDate: todayIsoDate,
  toDate: todayIsoDate
};

export default function MembershipContent() {
  const [filter, setFilter] = useState<MembershipDateFilter>(defaultFilter);
  const [data, setData] = useState<MembershipBreakdownData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadBreakdown() {
      setIsLoading(true);
      const response = await fetchMembershipBreakdown({ filter });

      if (!isMounted) {
        return;
      }

      setData(response);
      setIsLoading(false);
    }

    void loadBreakdown();

    return () => {
      isMounted = false;
    };
  }, [filter]);

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
      <MembershipDateFilterControl filter={filter} onFilterChange={setFilter} />
      <MembershipStatsCards data={data} />
      <MembershipCharts data={data} />
      <MembershipSummaryTable data={data} />
    </div>
  );
}
