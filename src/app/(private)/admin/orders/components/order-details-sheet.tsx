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
      <SheetContent className="sm:max-w-md space-y-4 p-4 w-full overflow-y-auto">
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Order Summary</h3>
              <span className="text-sm text-muted-foreground">3 Items</span>
            </div>

            <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
              <div className="text-sm flex items-center justify-between">
                <div className="gap-2 flex items-center">
                  <div className="h-8 w-8 bg-blue-100 rounded text-base flex items-center justify-center">
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
                  <div className="h-8 w-8 bg-purple-100 rounded text-base flex items-center justify-center">
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
                  <div className="h-8 w-8 bg-cyan-100 rounded text-base flex items-center justify-center">
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

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>$51.50</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Pickup & Delivery</span>
                <span>$4.99</span>
              </div>
              <div className="text-green-600 flex items-center justify-between">
                <span>Discount (FIRST20)</span>
                <span>-$10.30</span>
              </div>
            </div>

            <div className="text-lg font-bold pt-2 flex items-center justify-between border-t">
              <span>Total</span>
              <span className="text-blue-600">$66.19</span>
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
