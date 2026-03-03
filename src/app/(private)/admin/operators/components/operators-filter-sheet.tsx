"use client";

import { useState } from "react";

import type { Operator, OperatorFilters } from "@/types/operator-management";

import { Button } from "@/ui/button";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

interface OperatorsFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: OperatorFilters) => void;
  onClearFilters: () => void;
}

export default function OperatorsFilterSheet({
  open,
  onOpenChange,
  onApplyFilters,
  onClearFilters
}: OperatorsFilterSheetProps) {
  const [status, setStatus] = useState<Operator["status"] | "">("");
  const [region, setRegion] = useState<Operator["region"] | "">("");

  function handleApplyFilters() {
    const filters: OperatorFilters = {};

    if (status) {
      filters.status = status as Operator["status"];
    }

    if (region) {
      filters.region = region as Operator["region"];
    }

    onApplyFilters(filters);
    onOpenChange(false);
  }

  function handleClearFilters() {
    setStatus("");
    setRegion("");
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
          <div className="gap-2 flex items-center justify-between">
            {/* Status Filter */}
            <div className="space-y-2 w-full">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
                <SelectTrigger className="w-full" id="status-filter">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Region Filter */}
            <div className="space-y-2 w-full">
              <Label htmlFor="region-filter">Region</Label>
              <Select value={region} onValueChange={(value) => setRegion(value as typeof region)}>
                <SelectTrigger className="w-full" id="region-filter">
                  <SelectValue placeholder="All regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="North">North</SelectItem>
                  <SelectItem value="East">East</SelectItem>
                  <SelectItem value="West">West</SelectItem>
                  <SelectItem value="South">South</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
