"use client";

import { useState } from "react";

import { Button } from "@/ui/button";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

import type { Order, OrderFilters } from "../data/orders";

interface OrdersFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: OrderFilters) => void;
  onClearFilters: () => void;
}

const statusOptions: Array<Order["status"]> = [
  "Processing",
  "Shipped",
  "Delivered",
  "Pending",
  "Cancelled"
];

export default function OrdersFilterSheet({
  open,
  onOpenChange,
  onApplyFilters,
  onClearFilters
}: OrdersFilterSheetProps) {
  const [status, setStatus] = useState<Order["status"] | "">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  function handleApplyFilters() {
    const filters: OrderFilters = {};

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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Orders</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 px-4">
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
              <SelectTrigger id="status-filter" className="w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption}>
                    {statusOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="from-date-filter">From Date</Label>
            <input
              id="from-date-filter"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-md px-3 py-2 text-sm w-full border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="to-date-filter">To Date</Label>
            <input
              id="to-date-filter"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-md px-3 py-2 text-sm w-full border"
            />
          </div>

          <div className="gap-3 flex">
            <Button variant="outline" onClick={handleClearFilters} className="flex-1">
              Clear
            </Button>
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
