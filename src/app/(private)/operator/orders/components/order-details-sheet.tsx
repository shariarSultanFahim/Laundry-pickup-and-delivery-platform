"use client";

import { toast } from "sonner";

import type { OrderStatus } from "@/types/order-management";

import { useGetOrderDetails } from "@/lib/actions/order/use-get-order-details";
import { useUpdateOrderStatus } from "@/lib/actions/order/use-update-order-status";

import { Badge } from "@/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

interface OrderDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string | null;
}

const TERMINAL_STATUSES: OrderStatus[] = ["DELIVERED", "CANCELLED", "REFUNDED"];

function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "DELIVERED") {
    return "default";
  }

  if (
    status === "PENDING" ||
    status === "PROCESSING" ||
    status === "OUT_FOR_PICKUP" ||
    status === "PICKED_UP" ||
    status === "RECEIVED_BY_STORE" ||
    status === "IN_PROGRESS" ||
    status === "READY_FOR_DELIVERY" ||
    status === "OUT_FOR_DELIVERY"
  ) {
    return "secondary";
  }

  if (status === "REFUNDED") {
    return "outline";
  }

  return "destructive";
}

function getNextStatusOptions(currentStatus: OrderStatus): OrderStatus[] {
  if (TERMINAL_STATUSES.includes(currentStatus)) {
    return [currentStatus];
  }

  if (currentStatus === "PENDING") {
    return ["PENDING", "PROCESSING", "CANCELLED"];
  }

  if (currentStatus === "PROCESSING") {
    return ["PROCESSING", "OUT_FOR_PICKUP", "CANCELLED"];
  }

  if (currentStatus === "OUT_FOR_PICKUP") {
    return ["OUT_FOR_PICKUP", "PICKED_UP"];
  }

  if (currentStatus === "PICKED_UP") {
    return ["PICKED_UP", "RECEIVED_BY_STORE"];
  }

  if (currentStatus === "RECEIVED_BY_STORE") {
    return ["RECEIVED_BY_STORE", "IN_PROGRESS"];
  }

  if (currentStatus === "IN_PROGRESS") {
    return ["IN_PROGRESS", "READY_FOR_DELIVERY"];
  }

  if (currentStatus === "READY_FOR_DELIVERY") {
    return ["READY_FOR_DELIVERY", "OUT_FOR_DELIVERY"];
  }

  if (currentStatus === "OUT_FOR_DELIVERY") {
    return ["OUT_FOR_DELIVERY", "DELIVERED"];
  }

  return [currentStatus];
}

export default function OrderDetailsSheet({ open, onOpenChange, orderId }: OrderDetailsSheetProps) {
  const { data, isLoading } = useGetOrderDetails(orderId, open);
  const { mutateAsync: updateOrderStatus, isPending: isUpdatingStatus } = useUpdateOrderStatus();

  const order = data?.data;

  async function handleStatusChange(value: string) {
    if (!order) {
      return;
    }

    const nextStatus = value as OrderStatus;

    if (nextStatus === "REFUNDED") {
      return;
    }

    if (TERMINAL_STATUSES.includes(order.status)) {
      return;
    }

    if (nextStatus === order.status) {
      return;
    }

    const allowed = getNextStatusOptions(order.status);
    if (!allowed.includes(nextStatus)) {
      toast.error("Invalid status transition.", { position: "top-center" });
      return;
    }

    try {
      await updateOrderStatus({ id: order.id, status: nextStatus });
      toast.success("Order status updated", { position: "top-center" });
    } catch {
      toast.error("Failed to update order status", { position: "top-center" });
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="space-y-4 p-4 sm:max-w-md w-full overflow-y-auto">
        <SheetHeader className="p-0 text-left">
          <SheetTitle>Order Details</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <p className="py-8 text-muted-foreground text-center">Loading order details...</p>
        ) : !order ? (
          <p className="py-8 text-muted-foreground text-center">Order details not found</p>
        ) : (
          <div className="space-y-4">
            <div className="gap-4 pb-4 grid grid-cols-2 border-b">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Order Number</p>
                <p className="font-medium text-blue-600">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Date</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Customer</p>
                <p className="font-medium">{order.user?.name ?? "Unknown"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Status</p>
                <Badge variant={getStatusVariant(order.status)}>
                  {formatStatusLabel(order.status)}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Order Items</h3>
                <span className="text-sm text-muted-foreground">
                  {(order.orderItems ?? []).reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
              </div>

              <div className="space-y-2 rounded-lg bg-muted/30 p-3">
                {(order.orderItems ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No items found for this order.</p>
                ) : (
                  (order.orderItems ?? []).map((item) => (
                    <div key={item.id} className="text-sm flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.serviceName}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity} item(s)</p>
                      </div>
                      <span className="font-medium">${Number(item.price).toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-2 py-3 text-sm border-y">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Pickup & Delivery</span>
                <span>${Number(order.pickupAndDeliveryFee).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Platform Fee</span>
                <span>${Number(order.platformFee).toFixed(2)}</span>
              </div>
            </div>

            <div className="text-lg font-bold flex items-center justify-between">
              <span>Total</span>
              <span className="text-blue-600">${Number(order.totalAmount).toFixed(2)}</span>
            </div>

            <div className="space-y-2 pt-4">
              <label className="text-sm font-medium">Update Order Status</label>
              <Select
                value={order.status}
                onValueChange={(value) => {
                  void handleStatusChange(value);
                }}
                disabled={TERMINAL_STATUSES.includes(order.status) || isUpdatingStatus}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {getNextStatusOptions(order.status)
                    .filter((status) => status !== "REFUNDED" || status === order.status)
                    .map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatStatusLabel(status)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {TERMINAL_STATUSES.includes(order.status) ? (
                <p className="text-xs text-muted-foreground">
                  This order is in a terminal state and cannot be changed.
                </p>
              ) : null}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
