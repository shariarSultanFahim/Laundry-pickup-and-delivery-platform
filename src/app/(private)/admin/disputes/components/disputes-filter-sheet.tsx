"use client";

import { useMemo, useState } from "react";

import type { DisputeFilters, DisputeManagementDispute } from "@/types/dispute-management";

import { useGetTopOperators } from "@/lib/actions/admin/use-analytics";
import { Button } from "@/ui/button";
import { Combobox } from "@/ui/combobox";
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
  const [operatorId, setOperatorId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { data: operatorsResponse, isLoading: operatorsLoading } = useGetTopOperators();

  const operatorOptions = useMemo(() => {
    return operatorsResponse?.data?.map((operator) => ({
      value: operator.operatorId,
      label: operator.name
    })) ?? [];
  }, [operatorsResponse]);

  function handleApplyFilters() {
    const filters: DisputeFilters = {};

    if (status) {
      filters.status = status;
    }

    if (operatorId) {
      filters.operatorId = operatorId;
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
    setOperatorId("");
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
            <Label>Operator</Label>
            <Combobox
              options={operatorOptions}
              value={operatorId}
              onValueChange={setOperatorId}
              placeholder={operatorsLoading ? "Loading operators..." : "Select an operator"}
              searchPlaceholder="Search operators..."
              emptyText="No operator found."
              disabled={operatorsLoading}
            />
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
