"use client";

import { useState } from "react";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ReportingHeaderProps {
  title: string;
  subtitle: string;
  onPeriodChange?: (
    period: "today" | "last-7-days" | "last-month" | "6-months" | "year" | "lifetime"
  ) => void;
}

const PERIOD_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "last-7-days", label: "Last 7 days" },
  { value: "last-month", label: "Last month" },
  { value: "6-months", label: "6 months" },
  { value: "year", label: "Year" },
  { value: "lifetime", label: "Lifetime" }
] as const;

export default function ReportingHeader({ title, subtitle, onPeriodChange }: ReportingHeaderProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("last-7-days");

  const handlePeriodChange = (value: string) => {
    const period = value as
      | "today"
      | "last-7-days"
      | "last-month"
      | "6-months"
      | "year"
      | "lifetime";
    setSelectedPeriod(value);
    onPeriodChange?.(period);
  };

  return (
    <Card className="p-6 gap-4 sm:flex-row sm:items-center flex-col items-start justify-between">
      <div className="gap-2 flex flex-col items-start justify-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="gap-3 flex items-center">
        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </Card>
  );
}
