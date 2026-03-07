"use client";

import { useState } from "react";

import { Button } from "@/ui/button";
import { Combobox } from "@/ui/combobox";
import { Label } from "@/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

import { operatorsData } from "../../common/data/operators";
import DateRangePicker from "../../users/components/date-range-picker";

export interface DashboardFilters {
  operatorId?: string;
  dateRange?: {
    from: Date;
    to?: Date;
  };
}

interface DashboardFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: DashboardFilters;
  onApplyFilters: (filters: DashboardFilters) => void;
  onClearFilters: () => void;
}

export default function DashboardFilterSheet({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  onClearFilters
}: DashboardFilterSheetProps) {
  const [operatorId, setOperatorId] = useState(filters.operatorId ?? "");
  const [fromDate, setFromDate] = useState<Date | undefined>(filters.dateRange?.from);
  const [toDate, setToDate] = useState<Date | undefined>(filters.dateRange?.to);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setOperatorId(filters.operatorId ?? "");
      setFromDate(filters.dateRange?.from);
      setToDate(filters.dateRange?.to);
    }

    onOpenChange(nextOpen);
  }

  function handleApplyFilters() {
    const nextFilters: DashboardFilters = {};

    if (operatorId) {
      nextFilters.operatorId = operatorId;
    }

    if (fromDate) {
      nextFilters.dateRange = {
        from: fromDate,
        to: toDate
      };
    }

    onApplyFilters(nextFilters);
    onOpenChange(false);
  }

  function handleClearFilters() {
    setOperatorId("");
    setFromDate(undefined);
    setToDate(undefined);
    onClearFilters();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="p-4">
        <SheetHeader className="p-0">
          <SheetTitle>Filter Dashboard</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Operator</Label>
            <Combobox
              options={operatorsData.map((operator) => ({
                value: operator.id,
                label: operator.name
              }))}
              value={operatorId}
              onValueChange={setOperatorId}
              placeholder="Select an operator"
              searchPlaceholder="Search operators..."
              emptyText="No operator found."
            />
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <DateRangePicker
              from={fromDate}
              to={toDate}
              onApply={(from, to) => {
                setFromDate(from);
                setToDate(to);
              }}
              onClear={() => {
                setFromDate(undefined);
                setToDate(undefined);
              }}
            />
          </div>

          <div className="gap-3 pt-4 flex">
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button onClick={handleClearFilters} variant="outline" className="flex-1">
              Clear
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
