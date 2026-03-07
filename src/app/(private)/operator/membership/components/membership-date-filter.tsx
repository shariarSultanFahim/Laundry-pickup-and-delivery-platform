"use client";

import { Calendar } from "lucide-react";

import type { MembershipDateFilter } from "@/types/membership-breakdown";

import { Card, CardContent } from "@/ui";

import DateRangePicker from "./date-range-picker";

interface MembershipDateFilterProps {
  filter: MembershipDateFilter;
  onFilterChange: (filter: MembershipDateFilter) => void;
}

export default function MembershipDateFilter({
  filter,
  onFilterChange
}: MembershipDateFilterProps) {
  return (
    <Card>
      <CardContent className="gap-4 p-4 md:flex-row md:items-center flex flex-col">
        <div className="gap-2 text-muted-foreground flex items-center">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">Date Range:</span>
        </div>

        <DateRangePicker value={filter} onChange={onFilterChange} />
      </CardContent>
    </Card>
  );
}
