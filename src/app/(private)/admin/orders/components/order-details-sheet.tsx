"use client";

import { useEffect, useState } from "react";

import { Flame, Loader2, Shirt, Sparkles } from "lucide-react";

import type { AdminOrder } from "@/types/order-management";

import { Badge } from "@/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

import { fetchOrderById } from "./orders-api";

interface OrderDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId?: string;
}

function getOrderStatusVariant(status: AdminOrder["status"]) {
  switch (status) {
    case "DELIVERED":
      return "default";
    case "PENDING":
      return "outline";
    case "PROCESSING":
    case "OUT_FOR_PICKUP":
    case "PICKED_UP":
    case "RECEIVED_BY_STORE":
    case "IN_PROGRESS":
    case "READY_FOR_DELIVERY":
    case "OUT_FOR_DELIVERY":
      return "secondary";
    case "CANCELLED":
    case "REFUNDED":
      return "destructive";
    default:
      return "outline";
  }
}

function getPaymentStatusVariant(status: AdminOrder["paymentStatus"]) {
  switch (status) {
    case "PAID":
    case "DISBURSED":
      return "default";
    case "UNPAID":
    case "ESCROW_HELD":
      return "secondary";
    case "REFUNDED":
      return "destructive";
    default:
      return "outline";
  }
}

export default function OrderDetailsSheet({ open, onOpenChange, orderId }: OrderDetailsSheetProps) {
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && orderId) {
      async function loadOrder() {
        setIsLoading(true);
        try {
          const response = await fetchOrderById(orderId!);
          setOrder(response.data);
        } catch (error) {
          console.error("Failed to fetch order details:", error);
        } finally {
          setIsLoading(false);
        }
      }
      void loadOrder();
    } else if (!open) {
      setOrder(null);
    }
  }, [open, orderId]);

  if (!open) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md space-y-4 p-4 w-full overflow-y-auto">
        <SheetHeader className="p-0 border-b pb-4">
          <SheetTitle>Order Details</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : order ? (
          <div className="space-y-6 pt-2">
            <div className="gap-4 rounded-lg border-border bg-muted/30 p-4 flex items-start justify-between border">
              <div>
                <p className="font-semibold text-foreground">Order #{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()} at{" "}
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <Badge variant={getOrderStatusVariant(order.status)} className="capitalize">
                {order.status.replace(/_/g, " ")}
              </Badge>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                Customer Info
              </h3>
              <div className="space-y-1 text-sm bg-muted/20 p-3 rounded-md border text-slate-700">
                <p className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Name:</span>
                  <span className="font-semibold">{order.user.name}</span>
                </p>
                <p className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Email:</span>
                  <a href={`mailto:${order.user.email}`} className="font-semibold text-blue-600">
                    {order.user.email}
                  </a>
                </p>
                {order.user.phone && (
                  <p className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Phone:</span>
                    <span className="font-semibold">{order.user.phone}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground text-sm">Pickup Address</h3>
                <p className="text-xs text-muted-foreground p-3 border rounded-md">
                  {order.pickupAddress.streetAddress}, {order.pickupAddress.city}, {order.pickupAddress.state} {order.pickupAddress.postalCode}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground text-sm">Delivery Address</h3>
                <p className="text-xs text-muted-foreground p-3 border rounded-md">
                  {order.deliveryAddress.streetAddress}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Order Items</h3>
                <span className="text-xs text-muted-foreground">{order.orderItems?.length || 0} Items</span>
              </div>

              <div className="space-y-2 bg-muted/30 p-3 rounded-lg border">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="text-sm flex items-center justify-between py-1 first:pt-0 last:pb-0 border-b last:border-0 border-slate-100">
                    <div className="gap-2 flex items-center">
                      <div className="h-7 w-7 bg-blue-50 rounded flex items-center justify-center">
                        <Shirt className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-xs">{item.serviceName}</p>
                        <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-xs">${Number(item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 text-sm pt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">${Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Pickup & Delivery</span>
                  <span className="font-medium text-slate-800">${Number(order.pickupAndDeliveryFee).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Platform Fee</span>
                  <span className="font-medium text-slate-800">${Number(order.platformFee).toFixed(2)}</span>
                </div>
                <div className="text-base font-bold pt-3 flex items-center justify-between border-t mt-2">
                  <span>Total</span>
                  <span className="text-blue-600">${Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-semibold text-foreground text-sm">Transaction Details</h3>
              <div className="space-y-2 text-sm bg-muted/10 p-3 rounded-lg border">
                <p className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <Badge variant={getPaymentStatusVariant(order.paymentStatus)} className="text-[10px] font-bold">
                    {order.paymentStatus}
                  </Badge>
                </p>
                <div className="flex items-center justify-between text-xs overflow-hidden">
                  <span className="text-muted-foreground shrink-0">Order ID:</span>
                  <span className="font-medium truncate ml-4 font-mono text-[10px]">{order.id}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            Order not found
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
