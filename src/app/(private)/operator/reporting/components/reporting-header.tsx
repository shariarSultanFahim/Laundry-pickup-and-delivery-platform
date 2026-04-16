"use client";

import { Card } from "@/components/ui/card";

interface ReportingHeaderProps {
  title: string;
  subtitle: string;
  extraControl?: React.ReactNode;
  onPeriodChange?: (
    period: "today" | "last-7-days" | "last-month" | "6-months" | "year" | "lifetime"
  ) => void;
}

export default function ReportingHeader({ title, subtitle, extraControl }: ReportingHeaderProps) {
  return (
    <Card className="p-6 gap-4 sm:flex-row sm:items-center flex-col items-start justify-between">
      <div className="gap-2 flex flex-col items-start justify-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="gap-3 flex items-center">{extraControl}</div>
    </Card>
  );
}
