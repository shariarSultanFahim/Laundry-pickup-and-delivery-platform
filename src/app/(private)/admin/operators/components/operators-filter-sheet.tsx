"use client";

import { useEffect, useState } from "react";

import { OperatorStatus, type GetOperatorsQueryParams } from "@/types/operator-management";

import { Button } from "@/ui/button";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

interface OperatorsFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: GetOperatorsQueryParams) => void;
  onClearFilters: () => void;
  initialFilters: GetOperatorsQueryParams;
}

export default function OperatorsFilterSheet({
  open,
  onOpenChange,
  onApplyFilters,
  onClearFilters,
  initialFilters
}: OperatorsFilterSheetProps) {
  const [status, setStatus] = useState<OperatorStatus | "">(initialFilters.status || "");

  useEffect(() => {
    if (!open) {
      return;
    }

    setStatus(initialFilters.status || "");
  }, [initialFilters, open]);

  function handleApplyFilters() {
    const filters: GetOperatorsQueryParams = {};

    if (status) {
      filters.status = status;
    }

    onApplyFilters(filters);
    onOpenChange(false);
  }

  function handleClearFilters() {
    setStatus("");
    onClearFilters();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Operators</SheetTitle>
        </SheetHeader>

        <div className="p-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as OperatorStatus)}>
              <SelectTrigger className="w-full" id="status-filter">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="BANNED">Banned</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="gap-2 pt-4 flex">
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleClearFilters} className="flex-1">
              Clear Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
