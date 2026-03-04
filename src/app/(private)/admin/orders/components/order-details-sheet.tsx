"use client";

import type { OrderManagementOrder } from "@/types/order-management";

import { Badge } from "@/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

interface OrderDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderManagementOrder | null;
}

function getOrderStatusVariant(status: OrderManagementOrder["orderStatus"]) {
  if (status === "completed") {
    return "default";
  }

  if (status === "in-progress" || status === "pending") {
    return "secondary";
  }

  return "destructive";
}

function getPaymentStatusVariant(status: OrderManagementOrder["paymentStatus"]) {
  if (status === "paid") {
    return "default";
  }

  if (status === "pending") {
    return "secondary";
  }

  return "destructive";
}

export default function OrderDetailsSheet({ open, onOpenChange, order }: OrderDetailsSheetProps) {
  if (!order) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md space-y-4 p-4 w-full">
        <SheetHeader className="p-0">
          <SheetTitle>Order Details</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <div className="gap-4 rounded-lg border-border bg-muted/30 p-4 flex items-start justify-between border">
            <div>
              <p className="font-semibold text-foreground">Order #{order.id}</p>
              <p className="text-sm text-muted-foreground">{order.date}</p>
            </div>
            <Badge variant={getOrderStatusVariant(order.orderStatus)} className="capitalize">
              {order.orderStatus}
            </Badge>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Customer Information</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Name:</span>{" "}
                <span className="font-medium">{order.customerName}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                <a href={`mailto:${order.customerEmail}`} className="font-medium text-blue-600">
                  {order.customerEmail}
                </a>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Pickup & Delivery Address</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Pickup Address:</p>
                <p className="font-medium">{order.pickupAddress}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Delivery Address:</p>
                <p className="font-medium">{order.deliveryAddress}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Payment Details</h3>
            <div className="space-y-1 text-sm">
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">${order.amount.toFixed(2)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  variant={getPaymentStatusVariant(order.paymentStatus)}
                  className="capitalize"
                >
                  {order.paymentStatus}
                </Badge>
              </p>
              <p>
                <span className="text-muted-foreground">Transaction ID:</span>{" "}
                <span className="font-medium">{order.transactionId}</span>
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
