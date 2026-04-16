"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { DisputeManagementDispute } from "@/types/dispute-management";

import { useGetDisputeDetails, useResolveDispute } from "@/lib/actions/disputes/use-disputes";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";
import { Textarea } from "@/ui/textarea";

interface DisputeDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dispute: DisputeManagementDispute | null;
}

function getStatusVariant(status: DisputeManagementDispute["status"]) {
  if (status === "RESOLVED" || status === "REFUNDED") {
    return "default";
  }

  if (status === "PENDING") {
    return "secondary";
  }

  return "destructive";
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);

export default function DisputeDetailsSheet({
  open,
  onOpenChange,
  dispute
}: DisputeDetailsSheetProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const { data: details, isLoading: isLoadingDetails } = useGetDisputeDetails(
    dispute?.id ?? "",
    open && Boolean(dispute?.id)
  );
  const { mutateAsync: runResolveDispute, isPending: isSubmitting } = useResolveDispute();

  const orderItemsCount = useMemo(() => {
    return details?.order.orderItems.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  }, [details]);

  if (!dispute) {
    return null;
  }

  const disputeId = dispute.id;

  async function handleAction(action: "REFUND" | "DEDUCT_PAYOUT" | "DISMISS") {
    const parsedAmount = Number(amount);
    const shouldIncludeAmount = action === "REFUND" || action === "DEDUCT_PAYOUT";

    if (action === "DISMISS" && !note.trim()) {
      toast.error("Please add a dismissal note");
      return;
    }

    if (shouldIncludeAmount && (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0)) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await runResolveDispute({
        disputeId,
        payload: {
          action,
          amount: shouldIncludeAmount ? parsedAmount : undefined,
          note: note.trim() || undefined
        }
      });
      toast.success("Dispute action applied successfully");
      onOpenChange(false);
    } catch {
      toast.error("Failed to apply dispute action");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md p-4 space-y-4 w-full overflow-y-auto">
        <SheetHeader className="p-0">
          <SheetTitle>Dispute Details</SheetTitle>
        </SheetHeader>

        {isLoadingDetails || !details ? (
          <div className="py-10 text-sm text-muted-foreground text-center">Loading details...</div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3 rounded-lg border-border bg-muted/30 p-4 border">
              <div className="gap-4 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                  <p className="font-semibold text-foreground">{details.order.orderNumber}</p>
                </div>
                <Badge variant={getStatusVariant(details.status)}>{details.status}</Badge>
              </div>

              <div className="gap-3 sm:grid-cols-2 grid">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer</p>
                  <p className="font-medium text-foreground">{details.user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Operator</p>
                  <p className="font-medium text-foreground">{details.operator.user.name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Claim Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{details.description}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Order Summary</h3>
                <span className="text-sm text-muted-foreground">{orderItemsCount} Items</span>
              </div>

              <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
                {details.order.orderItems.map((item, index) => (
                  <div
                    key={`${item.serviceName}-${index}`}
                    className="space-y-1 rounded-md bg-background p-2"
                  >
                    <div className="text-sm flex items-center justify-between">
                      <p className="font-medium">{item.serviceName}</p>
                      <span className="font-medium">{formatCurrency(item.price)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.quantity} items</p>
                    {item.orderAddons.map((addon, addonIndex) => (
                      <div
                        key={`${item.serviceName}-${index}-addon-${addonIndex}`}
                        className="text-xs text-muted-foreground flex items-center justify-between"
                      >
                        <span>{addon.addon.name}</span>
                        <span>{formatCurrency(addon.addon.price)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(details.order.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pickup & Delivery</span>
                  <span>{formatCurrency(details.order.pickupAndDeliveryFee)}</span>
                </div>
              </div>

              <div className="text-lg font-bold pt-2 flex items-center justify-between border-t">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(details.order.totalAmount)}</span>
              </div>
            </div>

            {details.images.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Photos</h3>
                <div className="gap-2 grid grid-cols-3">
                  {details.images.map((photo, index) => (
                    <div
                      key={photo + index.toString()}
                      className="rounded-lg relative aspect-square overflow-hidden"
                    >
                      <Image
                        src={photo}
                        alt={`Dispute photo ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Resolution Actions</h3>

              <Textarea
                placeholder="Add a note for this action (optional)"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="min-h-20"
              />

              <Input
                placeholder="Amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />

              <Button
                className="bg-green-600 hover:bg-green-700 w-full"
                disabled={isSubmitting}
                onClick={() => void handleAction("REFUND")}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refund"}
              </Button>

              <Button
                className="bg-red-600 hover:bg-red-700 w-full"
                disabled={isSubmitting}
                onClick={() => void handleAction("DEDUCT_PAYOUT")}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Deduct from Operator Payout"
                )}
              </Button>

              <Button
                className="bg-slate-600 hover:bg-slate-700 w-full"
                disabled={isSubmitting}
                onClick={() => void handleAction("DISMISS")}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Dismiss"}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
