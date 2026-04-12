"use client";

import { useState } from "react";

import type { SupportTicketStatus } from "@/types/ticket-management";

import { Button } from "@/ui/button";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

interface TicketsFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: { status?: SupportTicketStatus }) => void;
  onClearFilters: () => void;
}

export default function TicketsFilterSheet({
  open,
  onOpenChange,
  onApplyFilters,
  onClearFilters
}: TicketsFilterSheetProps) {
  const [status, setStatus] = useState<SupportTicketStatus | "">("");

  function handleApplyFilters() {
    const filters: { status?: SupportTicketStatus } = {};

    if (status) {
      filters.status = status as SupportTicketStatus;
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
      <SheetContent className="p-4">
        <SheetHeader className="p-0">
          <SheetTitle>Filter Tickets</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as SupportTicketStatus | "")}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
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
