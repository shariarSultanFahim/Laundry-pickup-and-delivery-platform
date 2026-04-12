"use client";

import { useMemo, useState } from "react";

import type { ReviewFilters } from "@/types/review-management";

import { useGetTopOperators } from "@/lib/actions/admin/use-analytics";
import { Button } from "@/ui/button";
import { Combobox } from "@/ui/combobox";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

interface ReviewsFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: ReviewFilters) => void;
  onClearFilters: () => void;
}

export default function ReviewsFilterSheet({
  open,
  onOpenChange,
  onApplyFilters,
  onClearFilters
}: ReviewsFilterSheetProps) {
  const [rating, setRating] = useState<string>("");
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
    const filters: ReviewFilters = {};

    if (rating) {
      filters.rating = parseInt(rating);
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
    setRating("");
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
          <SheetTitle>Filter Reviews</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger id="rating">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
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
