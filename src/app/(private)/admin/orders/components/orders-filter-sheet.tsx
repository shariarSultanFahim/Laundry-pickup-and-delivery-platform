"use client";

import { useMemo, useState } from "react";

import type { OrderFilters, OrderStatus, PaymentStatus } from "@/types/order-management";

import { Button } from "@/ui/button";
import { Combobox } from "@/ui/combobox";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

import { useGetTopOperators } from "@/lib/actions/admin/use-analytics";

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
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [operatorID, setOperatorId] = useState("");
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
    const filters: OrderFilters = {};

    if (status) {
      filters.status = status;
    }

    if (paymentStatus) {
      filters.paymentStatus = paymentStatus;
    }

    if (operatorID) {
      filters.operatorID = operatorID;
    }

    if (fromDate) {
      const date = new Date(fromDate);
      date.setUTCHours(0, 0, 0, 0);
      filters.fromDate = date.toISOString();
    }
    if (toDate) {
      const date = new Date(toDate);
      date.setUTCHours(23, 59, 59, 999);
      filters.toDate = date.toISOString();
    }

    onApplyFilters(filters);
    onOpenChange(false);
  }

  function handleClearFilters() {
    setStatus("");
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

        <div className="space-y-6 px-4 py-8">
          <div className="space-y-2">
            <Label htmlFor="order-status-filter">Order Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as OrderStatus)}
            >
              <SelectTrigger id="order-status-filter" className="w-full">
                <SelectValue placeholder="All order statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="PICKED_UP">Picked Up</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-status-filter">Payment Status</Label>
            <Select
              value={paymentStatus}
              onValueChange={(value) => setPaymentStatus(value as PaymentStatus)}
            >
              <SelectTrigger id="payment-status-filter" className="w-full">
                <SelectValue placeholder="All payment statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UNPAID">Unpaid</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="ESCROW_HELD">Escrow Held</SelectItem>
                <SelectItem value="DISBURSED">Disbursed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Operator</Label>
            <Combobox
              options={operatorOptions}
              value={operatorID}
              onValueChange={setOperatorId}
              placeholder={operatorsLoading ? "Loading operators..." : "Select an operator"}
              searchPlaceholder="Search operators..."
              emptyText="No operator found."
              disabled={operatorsLoading}
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
