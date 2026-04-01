"use client";

import { useState } from "react";
import { UserStatus } from "@/types/user";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

export interface UsersFilterParams {
  status?: UserStatus | "";
  minspent?: number;
  isVerified?: boolean;
}

interface UsersFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: UsersFilterParams) => void;
  onClearFilters: () => void;
  initialFilters: UsersFilterParams;
}

export default function UsersFilterSheet({
  open,
  onOpenChange,
  onApplyFilters,
  onClearFilters,
  initialFilters
}: UsersFilterSheetProps) {
  const [status, setStatus] = useState<UserStatus | "">(initialFilters.status || "");
  const [minspent, setMinspent] = useState<string>(initialFilters.minspent?.toString() || "");

  const handleApplyFilters = () => {
    onApplyFilters({
      status: status || undefined,
      minspent: minspent ? parseFloat(minspent) : undefined
    });
    onOpenChange(false);
  };

  const handleClearFilters = () => {
    setStatus("");
    setMinspent("");
    onClearFilters();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Users</SheetTitle>
        </SheetHeader>

        <div className="px-4 space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as UserStatus)}>
              <SelectTrigger className="w-full" id="status-filter">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="BANNED">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-spent-filter">Minimum Total Spent ($)</Label>
            <Input
              id="min-spent-filter"
              type="number"
              placeholder="Enter minimum amount"
              value={minspent}
              onChange={(event) => setMinspent(event.target.value)}
              min="0"
            />
          </div>

          <div className="gap-2 pt-4 flex w-full">
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
