"use client";

import { useState } from "react";

import type { DisputeFilters, DisputeManagementDispute } from "@/types/dispute-management";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

interface DisputesFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: DisputeFilters) => void;
  onClearFilters: () => void;
}

export default function DisputesFilterSheet({
  open,
  onOpenChange,
  onApplyFilters,
  onClearFilters
}: DisputesFilterSheetProps) {
  const [status, setStatus] = useState<DisputeManagementDispute["status"] | "">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  function handleApplyFilters() {
    const filters: DisputeFilters = {};

    if (status) {
      filters.status = status;
    }

    if (fromDate) {
      filters.fromDate = fromDate;
    }

    if (toDate) {
      filters.toDate = toDate;
    }

    onApplyFilters(filters);
    onOpenChange(false);
  }

  function handleClearFilters() {
    setStatus("");
    setFromDate("");
    setToDate("");
    onClearFilters();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-4">
        <SheetHeader className="p-0">
          <SheetTitle>Filter Disputes</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as DisputeManagementDispute["status"] | "")}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="from-date">From Date</Label>
            <Input
              id="from-date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="to-date">To Date</Label>
            <Input
              id="to-date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
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
