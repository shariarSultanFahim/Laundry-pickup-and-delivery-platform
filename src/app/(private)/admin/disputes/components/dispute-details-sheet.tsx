"use client";

import { useState } from "react";
import Image from "next/image";

import { Flame, Shirt, Sparkles } from "lucide-react";

import type { DisputeManagementDispute } from "@/types/dispute-management";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

interface DisputeDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dispute: DisputeManagementDispute | null;
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

export default function DisputeDetailsSheet({
  open,
  onOpenChange,
  dispute
}: DisputeDetailsSheetProps) {
  const [refundAmount, setRefundAmount] = useState("");

  if (!dispute) {
    return null;
  }

  const handleAction = (actionType: string) => {
    console.log(`Action: ${actionType}`, refundAmount);
    // TODO: Call API to resolve dispute with action
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md p-4 space-y-4 w-full overflow-y-auto">
        <SheetHeader className="p-0">
          <SheetTitle>Dispute Details</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
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
                <p className="text-sm font-medium text-muted-foreground">Operator</p>
                <p className="font-medium text-foreground">{dispute.operatorName}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">View Claim</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{dispute.description}</p>
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
                    <Shirt className="h-4 w-4 text-blue-700" />
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
                    <Sparkles className="h-4 w-4 text-purple-700" />
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
                    <Flame className="h-4 w-4 text-cyan-700" />
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

          {dispute.photos.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">View Photos</h3>
              <div className="gap-2 grid grid-cols-3">
                {dispute.photos.map((photo, index) => (
                  <div key={index} className="rounded-lg relative aspect-square overflow-hidden">
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
            <h3 className="font-semibold text-foreground">Actions</h3>

            <Button className="bg-sky-400 hover:bg-sky-500 w-full">Override Decision</Button>

            <div className="gap-2 flex">
              <Input
                placeholder="Amount"
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="flex-1"
              />
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleAction("refund")}
              >
                Refund
              </Button>
            </div>

            <Button className="bg-purple-500 hover:bg-purple-600 w-full">Issue Credit</Button>

            <Button className="bg-red-600 hover:bg-red-700 w-full">
              Deduct from Operator Payout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
