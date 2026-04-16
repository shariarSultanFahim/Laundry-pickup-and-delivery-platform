"use client";

import { Suspense, useMemo, useState } from "react";

import { useGetOperators } from "@/lib/actions/operators/use-get-operators";

import { Button } from "@/components/ui";
import { Combobox } from "@/ui/combobox";

import Header from "../components/header";
import { ReportsContent } from "./components/reports-content";
import { ReportsSkeleton } from "./components/skeletons";

export default function AdminReportsPage() {
  const [operatorId, setOperatorId] = useState<string | undefined>(undefined);

  const { data: operatorsResponse, isLoading: operatorsLoading } = useGetOperators({
    page: 1,
    limit: 200
  });

  const operatorOptions = useMemo(() => {
    return (operatorsResponse?.data ?? [])
      .map((operator) => ({
        value: operator.operatorProfile?.id ?? operator.id,
        label: operator.name
      }))
      .filter((operator) => Boolean(operator.value));
  }, [operatorsResponse?.data]);

  return (
    <div className="space-y-6">
      <Header
        title="Revenue Analytics Report"
        subtitle="Comprehensive overview of your business performance"
        Button={
          <div className="gap-2 md:flex-row md:items-center flex flex-col">
            <div className="md:w-64 w-full">
              <Combobox
                options={operatorOptions}
                value={operatorId}
                onValueChange={(value) => setOperatorId(value || undefined)}
                placeholder="Filter by operator"
                searchPlaceholder="Search operators..."
                emptyText="No operator found."
                disabled={operatorsLoading}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setOperatorId(undefined)}
              disabled={!operatorId}
            >
              Clear
            </Button>
          </div>
        }
      />
      <Suspense fallback={<ReportsSkeleton />}>
        <ReportsContent operatorId={operatorId} />
      </Suspense>
    </div>
  );
}
