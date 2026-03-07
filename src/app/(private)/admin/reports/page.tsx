"use client";

import { Suspense, useState } from "react";

import { Download } from "lucide-react";

import { Button } from "@/components/ui";
import { Combobox } from "@/ui/combobox";

import { operatorsData } from "../common/data/operators";
import Header from "../components/header";
import { ReportsContent } from "./components/reports-content";
import { ReportsSkeleton } from "./components/skeletons";

export default function AdminReportsPage() {
  const [operatorId, setOperatorId] = useState("");

  const onExport = () => {
    // Implement export functionality here
    alert("Exporting report...");
  };

  return (
    <div className="space-y-6">
      <Header
        title="Revenue Analytics Report"
        subtitle="Comprehensive overview of your business performance"
        Button={
          <div className="gap-2 md:flex-row md:items-center flex flex-col">
            <div className="md:w-64 w-full">
              <Combobox
                options={operatorsData.map((operator) => ({
                  value: operator.id,
                  label: operator.name
                }))}
                value={operatorId}
                onValueChange={setOperatorId}
                placeholder="Filter by operator"
                searchPlaceholder="Search operators..."
                emptyText="No operator found."
              />
            </div>
            <Button variant="outline" onClick={() => setOperatorId("")} disabled={!operatorId}>
              Clear
            </Button>
            <Button onClick={() => onExport()}>
              <Download /> Export Report
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
