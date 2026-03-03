"use client";

import { useState } from "react";

import type { UserFilters, UserManagementUser } from "@/types/user-management";

import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

interface UsersFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: UserFilters) => void;
  onClearFilters: () => void;
}

export default function UsersFilterSheet({
  open,
  onOpenChange,
  onApplyFilters,
  onClearFilters
}: UsersFilterSheetProps) {
  const [role, setRole] = useState<UserManagementUser["role"] | "">("");
  const [status, setStatus] = useState<UserManagementUser["status"] | "">("");
  const [minOrderSpent, setMinOrderSpent] = useState<string>("");

  function handleApplyFilters() {
    const filters: UserFilters = {};

    if (role) {
      filters.role = role as UserManagementUser["role"];
    }

    if (status) {
      filters.status = status as UserManagementUser["status"];
    }

    if (minOrderSpent) {
      filters.minOrderSpent = parseFloat(minOrderSpent);
    }

    onApplyFilters(filters);
    onOpenChange(false);
  }

  function handleClearFilters() {
    setRole("");
    setStatus("");
    setMinOrderSpent("");
    onClearFilters();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Users</SheetTitle>
        </SheetHeader>

        <div className="px-4 space-y-6">
          {/* Role Filter */}
          <div className="space-y-2">
            <Label htmlFor="role-filter">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as typeof role)}>
              <SelectTrigger id="role-filter">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="operator">Operator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Min Order Spent Filter */}
          <div className="space-y-2">
            <Label htmlFor="min-spent-filter">Minimum Total Spent ($)</Label>
            <Input
              id="min-spent-filter"
              type="number"
              placeholder="Enter minimum amount"
              value={minOrderSpent}
              onChange={(event) => setMinOrderSpent(event.target.value)}
              min="0"
            />
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
