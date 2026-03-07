"use client";

import { useState } from "react";

import type { OrderFilters, OrderManagementOrder } from "@/types/order-management";

import { Button } from "@/ui/button";
import { Combobox } from "@/ui/combobox";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

import { operatorsData } from "../../common/data/operators";

interface OrdersFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: OrderFilters) => void;
  onClearFilters: () => void;
}

export default function OrdersFilterSheet({
  open,
  onOpenChange,
  onApplyFilters,
  onClearFilters
}: OrdersFilterSheetProps) {
  const [orderStatus, setOrderStatus] = useState<OrderManagementOrder["orderStatus"] | "">("");
  const [paymentStatus, setPaymentStatus] = useState<OrderManagementOrder["paymentStatus"] | "">(
    ""
  );
  const [operatorId, setOperatorId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  function handleApplyFilters() {
    const filters: OrderFilters = {};

    if (orderStatus) {
      filters.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      filters.paymentStatus = paymentStatus;
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
    setOrderStatus("");
    setPaymentStatus("");
    setOperatorId("");
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
            <Label htmlFor="order-status-filter">Order Status</Label>
            <Select
              value={orderStatus}
              onValueChange={(value) => setOrderStatus(value as typeof orderStatus)}
            >
              <SelectTrigger id="order-status-filter" className="w-full">
                <SelectValue placeholder="All order statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-status-filter">Payment Status</Label>
            <Select
              value={paymentStatus}
              onValueChange={(value) => setPaymentStatus(value as typeof paymentStatus)}
            >
              <SelectTrigger id="payment-status-filter" className="w-full">
                <SelectValue placeholder="All payment statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Operator</Label>
            <Combobox
              options={operatorsData.map((operator) => ({
                value: operator.id,
                label: operator.name
              }))}
              value={operatorId}
              onValueChange={setOperatorId}
              placeholder="Select an operator"
              searchPlaceholder="Search operators..."
              emptyText="No operator found."
            />
          </div>

          <div className="gap-2 grid grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="from-date-filter">From Date</Label>
              <Input
                id="from-date-filter"
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-date-filter">To Date</Label>
              <Input
                id="to-date-filter"
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
              />
            </div>
          </div>

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
