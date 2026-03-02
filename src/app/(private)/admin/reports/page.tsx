"use client";

import { Suspense } from "react";

import { Download } from "lucide-react";

import { Button } from "@/components/ui";

import Header from "../components/header";
import { ReportsContent } from "./components/reports-content";
import { ReportsSkeleton } from "./components/skeletons";

export default function AdminReportsPage() {
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
          <Button onClick={() => onExport()}>
            <Download /> Export Report
          </Button>
        }
      />
      <Suspense fallback={<ReportsSkeleton />}>
        <ReportsContent />
      </Suspense>
    </div>
  );
}
