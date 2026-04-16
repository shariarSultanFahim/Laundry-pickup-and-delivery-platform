"use client";

import { useState } from "react";

import { Button } from "@/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

export interface PayoutFilters {
  status?: "PAID" | "PENDING" | "FAILED";
  month?: number;
  year?: number;
}

interface PayoutsFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: PayoutFilters) => void;
  onClearFilters: () => void;
}

const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
];

const years = Array.from({ length: 5 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { value: year.toString(), label: year.toString() };
});

export default function PayoutsFilterSheet({
  open,
  onOpenChange,
  onApplyFilters,
  onClearFilters
}: PayoutsFilterSheetProps) {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleApplyFilters = () => {
    const filters: PayoutFilters = {};

    if (selectedMonth) filters.month = Number(selectedMonth);
    if (selectedYear) filters.year = Number(selectedYear);
    if (selectedStatus) filters.status = selectedStatus as "PAID" | "PENDING" | "FAILED";

    onApplyFilters(filters);
    onOpenChange(false);
  };

  const handleClearFilters = () => {
    setSelectedMonth("");
    setSelectedYear("");
    setSelectedStatus("");
    onClearFilters();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md space-y-0 p-4 w-full">
        <SheetHeader className="p-0">
          <SheetTitle>Filter Payouts</SheetTitle>
        </SheetHeader>

        <div className="space-y-2 gap-2 flex flex-wrap">
          <div className="space-y-2">
            <label className="text-sm font-medium">Month</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="gap-2 pt-4 flex">
          <Button variant="outline" className="flex-1" onClick={handleClearFilters}>
            Clear Filters
          </Button>
          <Button className="flex-1" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
