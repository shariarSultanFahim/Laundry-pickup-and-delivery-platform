"use client";

import { Suspense, useState } from "react";

import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { Combobox } from "@/ui/combobox";

import { operatorsData } from "../common/data/operators";
import Header from "../components/header";
import { ReportsContent } from "./components/reports-content";
import { ReportsSkeleton } from "./components/skeletons";

export default function AdminReportsPage() {
  const [operatorId, setOperatorId] = useState<string | undefined>(undefined);
  const [isExporting, setIsExporting] = useState(false);

  const onExport = async () => {
    try {
      setIsExporting(true);
      // TODO: Implement actual export to CSV/PDF
      toast.success("Report exported successfully!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to export report";
      toast.error(message);
    } finally {
      setIsExporting(false);
    }
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
            <Button
              variant="outline"
              onClick={() => setOperatorId(undefined)}
              disabled={!operatorId}
            >
              Clear
            </Button>
            <Button onClick={onExport} disabled={isExporting}>
              <Download /> {isExporting ? "Exporting..." : "Export Report"}
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
