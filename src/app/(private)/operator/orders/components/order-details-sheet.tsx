"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

import type { Order } from "../data/orders";

interface OrderDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  statusOptions?: Array<Order["status"]>;
  statusLabelMap?: Partial<Record<Order["status"], string>>;
  onStatusChange?: (orderId: string, status: Order["status"]) => void;
}

function getStatusVariant(
  status: Order["status"]
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "Delivered") {
    return "default";
  }

  if (status === "Processing" || status === "Shipped") {
    return "secondary";
  }

  if (status === "Cancelled") {
    return "destructive";
  }

  return "outline";
}

const defaultStatusOptions: Array<Order["status"]> = [
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled"
];

export default function OrderDetailsSheet({
  open,
  onOpenChange,
  order,
  statusOptions = defaultStatusOptions,
  statusLabelMap,
  onStatusChange
}: OrderDetailsSheetProps) {
  const [selectedStatus, setSelectedStatus] = useState<Order["status"]>("Processing");

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  if (!order) {
    return null;
  }

  const handleStatusChange = (status: Order["status"]) => {
    setSelectedStatus(status);
    onStatusChange?.(order.id, status);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md space-y-4 p-4 w-full overflow-y-auto">
        <SheetHeader className="p-0 text-left">
          <SheetTitle>Order Details</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* Order Header Info */}
          <div className="gap-4 pb-4 grid grid-cols-2 border-b">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Order ID :</p>
              <p className="text-blue-600 font-medium">{order.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Date</p>
              <p className="font-medium">12/12/2025</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Customer Name :</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Status</p>
              <Badge variant={getStatusVariant(order.status)} className="capitalize">
                {order.status}
              </Badge>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Order Summary</h3>
              <span className="text-sm text-muted-foreground">{order.items} Items</span>
            </div>

            <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
              {/* Sample items - in a real app, you'd get these from the order */}
              <div className="text-sm flex items-center justify-between">
                <div className="gap-2 flex items-center">
                  <div className="h-6 w-6 bg-blue-100 rounded text-xs flex items-center justify-center">
                    👕
                  </div>
                  <div>
                    <p className="font-medium">Wash & Fold</p>
                    <p className="text-xs text-muted-foreground">5 items</p>
                  </div>
                </div>
                <span className="font-medium">$24.50</span>
              </div>

              <div className="text-sm flex items-center justify-between">
                <div className="gap-2 flex items-center">
                  <div className="h-6 w-6 bg-purple-100 rounded text-xs flex items-center justify-center">
                    🧥
                  </div>
                  <div>
                    <p className="font-medium">Dry Cleaning</p>
                    <p className="text-xs text-muted-foreground">2 items</p>
                  </div>
                </div>
                <span className="font-medium">$18.00</span>
              </div>

              <div className="text-sm flex items-center justify-between">
                <div className="gap-2 flex items-center">
                  <div className="h-6 w-6 bg-cyan-100 rounded text-xs flex items-center justify-center">
                    🔥
                  </div>
                  <div>
                    <p className="font-medium">Iron & Press</p>
                    <p className="text-xs text-muted-foreground">3 items</p>
                  </div>
                </div>
                <span className="font-medium">$9.00</span>
              </div>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="space-y-2 py-3 text-sm border-t border-b">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>$51.50</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pickup & Delivery</span>
              <span>$4.99</span>
            </div>
            <div className="text-green-600 flex items-center justify-between">
              <span className="text-muted-foreground">Discount (FIRST20)</span>
              <span>-$10.30</span>
            </div>
          </div>

          {/* Total */}
          <div className="text-lg font-bold flex items-center justify-between">
            <span>Total</span>
            <span className="text-blue-600">${order.amount.toFixed(2)}</span>
          </div>

          {/* Status Action */}
          <div className="pt-4 space-y-2">
            <label className="text-sm font-medium">Update Order Status</label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabelMap?.[status] ?? status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
