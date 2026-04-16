"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { DisputeManagementDispute } from "@/types/dispute-management";

import { useGetDisputeDetails, useRespondToDispute } from "@/lib/actions/disputes/use-disputes";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";
import { Textarea } from "@/ui/textarea";

interface DisputeResponseSheetProps {
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

export default function DisputeResponseSheet({
  open,
  onOpenChange,
  dispute
}: DisputeResponseSheetProps) {
  const { data: details, isLoading: isLoadingDetails } = useGetDisputeDetails(
    dispute?.id ?? "",
    open && Boolean(dispute?.id)
  );
  const [responseNote, setResponseNote] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const { mutateAsync: runRespondToDispute, isPending: isSubmitting } = useRespondToDispute();

  const orderItemsCount = useMemo(() => {
    return details?.order.orderItems.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  }, [details]);

  if (!dispute) {
    return null;
  }

  async function handleRespond(action: "ESCALATE" | "REFUND") {
    if (action === "ESCALATE" && !responseNote.trim()) {
      toast.error("Escalation reason is required");
      return;
    }

    const parsedRefundAmount = Number(refundAmount);
    if (
      action === "REFUND" &&
      (!refundAmount || Number.isNaN(parsedRefundAmount) || parsedRefundAmount <= 0)
    ) {
      toast.error("Please enter a valid refund amount");
      return;
    }

    try {
      await runRespondToDispute({
        disputeId: dispute.id,
        payload: {
          action,
          amount: action === "REFUND" ? parsedRefundAmount : undefined,
          note: responseNote.trim() || undefined
        }
      });
      toast.success("Dispute response submitted successfully");
      setResponseNote("");
      setRefundAmount("");
      onOpenChange(false);
    } catch {
      toast.error("Failed to submit dispute response");
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

            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold text-foreground">Operator Actions</h3>

              <Input
                placeholder="Refund amount"
                type="number"
                min="0"
                step="0.01"
                value={refundAmount}
                onChange={(event) => setRefundAmount(event.target.value)}
              />

              <Textarea
                placeholder="Add note (required for escalation)"
                value={responseNote}
                onChange={(event) => setResponseNote(event.target.value)}
                className="min-h-20"
              />

              <Button
                className="bg-green-600 hover:bg-green-700 w-full"
                disabled={isSubmitting}
                onClick={() => void handleRespond("REFUND")}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refund"}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                disabled={isSubmitting}
                onClick={() => void handleRespond("ESCALATE")}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Escalate to Admin"}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
