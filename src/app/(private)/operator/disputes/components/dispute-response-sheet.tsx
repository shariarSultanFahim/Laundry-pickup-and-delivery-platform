"use client";

import Image from "next/image";
import { useState } from "react";

import { Loader2 } from "lucide-react";

import type { DisputeManagementDispute } from "@/types/dispute-management";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";
import { Textarea } from "@/ui/textarea";

import { toast } from "sonner";

import {
    escalateToAdmin,
    offerCredit,
    offerRefund,
    submitResponse
} from "./disputes-api";

interface DisputeResponseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dispute: DisputeManagementDispute | null;
  onRefresh?: () => void;
}

function getStatusVariant(status: DisputeManagementDispute["status"]) {
  if (status === "resolved") {
    return "default";
  }

  if (status === "open") {
    return "secondary";
  }

  return "destructive";
}

export default function DisputeResponseSheet({
  open,
  onOpenChange,
  dispute,
  onRefresh
}: DisputeResponseSheetProps) {
  const [response, setResponse] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [escalateReason, setEscalateReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!dispute) {
    return null;
  }

  async function handleSubmitResponse() {
    if (!response.trim()) {
      toast.error("Please enter a response");
      return;
    }

    if (!dispute) {
      toast.error("No dispute selected");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitResponse(dispute.id, response);
      if (result.success) {
        toast.success(result.message);
        setResponse("");
        onRefresh?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Failed to submit response");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleOfferRefund() {
    if (!refundAmount || parseFloat(refundAmount) <= 0) {
      toast.error("Please enter a valid refund amount");
      return;
    }

    if (!dispute) {
      toast.error("No dispute selected");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await offerRefund(dispute.id, parseFloat(refundAmount));
      if (result.success) {
        toast.success(result.message);
        setRefundAmount("");
        onRefresh?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error offering refund:", error);
      toast.error("Failed to offer refund");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleOfferCredit() {
    if (!creditAmount || parseFloat(creditAmount) <= 0) {
      toast.error("Please enter a valid credit amount");
      return;
    }

    if (!dispute) {
      toast.error("No dispute selected");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await offerCredit(dispute.id, parseFloat(creditAmount));
      if (result.success) {
        toast.success(result.message);
        setCreditAmount("");
        onRefresh?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error offering credit:", error);
      toast.error("Failed to offer credit");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEscalateToAdmin() {
    if (!escalateReason.trim()) {
      toast.error("Please enter a reason for escalation");
      return;
    }

    if (!dispute) {
      toast.error("No dispute selected");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await escalateToAdmin(dispute.id, escalateReason);
      if (result.success) {
        toast.success(result.message);
        setEscalateReason("");
        onOpenChange(false);
        onRefresh?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error escalating dispute:", error);
      toast.error("Failed to escalate dispute");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md p-4 space-y-4 w-full overflow-y-auto">
        <SheetHeader className="p-0">
          <SheetTitle>Dispute Response</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* Dispute Info */}
          <div className="space-y-3 rounded-lg border-border bg-muted/30 p-4 border">
            <div className="gap-4 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                <p className="font-semibold text-foreground">{dispute.orderId}</p>
              </div>
              <Badge variant={getStatusVariant(dispute.status)} className="capitalize">
                {dispute.status}
              </Badge>
            </div>

            <div className="gap-3 sm:grid-cols-2 grid">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer</p>
                <p className="font-medium text-foreground">{dispute.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Claim ID</p>
                <p className="font-medium text-foreground">{dispute.claimId}</p>
              </div>
            </div>
          </div>

          {/* Claim Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Claim Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{dispute.description}</p>
          </div>

          {/* Evidence Photos */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Evidence Photos</h3>
            {dispute.photos && dispute.photos.length > 0 ? (
              <div className="gap-2 flex flex-wrap">
                {dispute.photos.map((photo, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-input">
                    <Image
                      src={photo}
                      alt={`Evidence ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No evidence photos provided</p>
            )}
          </div>

          {/* Your Response */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Your Response</h3>
            <Textarea
              placeholder="Type your response to the customer..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="min-h-24 resize-none"
            />
            <Button
              onClick={handleSubmitResponse}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Response"
              )}
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-semibold text-foreground text-sm">Quick Actions</h3>

            {/* Offer Refund */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Offer Refund</label>
              <div className="gap-2 flex">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="text-sm"
                />
                <Button
                  onClick={handleOfferRefund}
                  disabled={isSubmitting || !refundAmount}
                  variant="outline"
                  className="text-xs"
                >
                  Refund
                </Button>
              </div>
            </div>

            {/* Offer Credit */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Offer Credit</label>
              <div className="gap-2 flex">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  className="text-sm"
                />
                <Button
                  onClick={handleOfferCredit}
                  disabled={isSubmitting || !creditAmount}
                  variant="outline"
                  className="text-xs"
                >
                  Credit
                </Button>
              </div>
            </div>

            {/* Escalate to Admin */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Escalate to Admin</label>
              <Textarea
                placeholder="Reason for escalation..."
                value={escalateReason}
                onChange={(e) => setEscalateReason(e.target.value)}
                className="min-h-20 resize-none text-sm"
              />
              <Button
                onClick={handleEscalateToAdmin}
                disabled={isSubmitting || !escalateReason.trim()}
                variant="destructive"
                className="w-full text-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Escalating...
                  </>
                ) : (
                  "Escalate to Admin"
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
