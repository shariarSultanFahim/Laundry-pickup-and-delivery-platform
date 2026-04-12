"use client";

import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { GetOperatorsResponse, OperatorDetails } from "@/types/operator-management";
import { OperatorApprovalStatus, OperatorStatus } from "@/types/operator-management";

import { useGetOperatorById } from "@/lib/actions/operators/use-get-operator-by-id";
import { useUpdateOperatorApprovalStatus } from "@/lib/actions/operators/use-update-operator-approval-status";
import { useUpdateOperatorStatus } from "@/lib/actions/operators/use-update-operator-status";

import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { DataValue } from "@/ui/data-value";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

interface OperatorDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operatorId: string | null;
}

function getStatusVariant(status: OperatorStatus) {
  if (status === OperatorStatus.ACTIVE) return "default";
  if (status === OperatorStatus.INACTIVE) return "secondary";
  return "destructive";
}

function getApprovalStatusVariant(status: OperatorApprovalStatus) {
  if (status === OperatorApprovalStatus.APPROVED) return "default";
  if (status === OperatorApprovalStatus.PENDING) return "secondary";
  return "destructive";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function OperatorDetailsSheet({
  open,
  onOpenChange,
  operatorId
}: OperatorDetailsSheetProps) {
  const queryClient = useQueryClient();
  const { data: operator, isLoading } = useGetOperatorById(operatorId || "", open);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateOperatorStatus();
  const { mutate: updateApprovalStatus, isPending: isUpdatingApprovalStatus } =
    useUpdateOperatorApprovalStatus();

  const [statusOverride, setStatusOverride] = useState<OperatorStatus | "">("");
  const [approvalStatusOverride, setApprovalStatusOverride] = useState<OperatorApprovalStatus | "">(
    ""
  );
  const operatorUser = operator?.user;
  const operatorStores = operator?.stores ?? [];

  const status = statusOverride || operator?.status || "";
  const approvalStatus = approvalStatusOverride || operator?.approvalStatus || "";

  if (!open) {
    return null;
  }

  function handleUpdateStatus() {
    if (!operator || !status || !operator.user?.id) {
      return;
    }

    const nextStatus = status;

    updateStatus(
      { id: operator.user.id, status },
      {
        onSuccess: () => {
          queryClient.setQueryData<OperatorDetails>(["operator", operator.id], (current) => {
            if (!current) {
              return current;
            }

            return {
              ...current,
              status: nextStatus,
              user: {
                ...current.user,
                status: nextStatus
              }
            };
          });

          queryClient.setQueriesData<GetOperatorsResponse>(
            { queryKey: ["operators"] },
            (current) => {
              if (!current) {
                return current;
              }

              return {
                ...current,
                data: current.data.map((item) =>
                  item.id === operator.user.id
                    ? {
                        ...item,
                        status: nextStatus
                      }
                    : item
                )
              };
            }
          );

          toast.success("Operator status updated successfully.");
        }
      }
    );
  }

  function handleUpdateApprovalStatus() {
    if (!operator || !approvalStatus) {
      return;
    }

    const nextApprovalStatus = approvalStatus;

    updateApprovalStatus(
      { operatorId: operator.id, approvalStatus },
      {
        onSuccess: () => {
          queryClient.setQueryData<OperatorDetails>(["operator", operator.id], (current) => {
            if (!current) {
              return current;
            }

            return {
              ...current,
              approvalStatus: nextApprovalStatus
            };
          });

          queryClient.setQueriesData<GetOperatorsResponse>(
            { queryKey: ["operators"] },
            (current) => {
              if (!current) {
                return current;
              }

              return {
                ...current,
                data: current.data.map((item) =>
                  item.operatorProfile.id === operator.id
                    ? {
                        ...item,
                        operatorProfile: {
                          ...item.operatorProfile,
                          approvalStatus: nextApprovalStatus
                        }
                      }
                    : item
                )
              };
            }
          );

          toast.success("Operator approval status updated successfully.");
        }
      }
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl p-0 w-full overflow-y-auto">
        <SheetHeader className="border-border px-6 py-4 border-b">
          <SheetTitle>Operator Details</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="h-40 px-6 flex items-center justify-center">
            <p className="text-muted-foreground">Loading operator details...</p>
          </div>
        ) : !operator ? (
          <div className="h-40 px-6 flex items-center justify-center">
            <p className="text-muted-foreground">Operator not found or ID is missing.</p>
          </div>
        ) : (
          <div className="space-y-6 px-6 py-6">
            <div className="gap-4 rounded-lg p-4 flex items-start border">
              <Avatar className="h-14 w-14">
                <AvatarImage
                  src={operatorUser?.avatar ?? undefined}
                  alt={operatorUser?.name ?? operator.id}
                />
                <AvatarFallback>{getInitials(operatorUser?.name ?? operator.id)}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="gap-3 flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="text-lg font-semibold truncate">
                      {operatorUser?.name ?? "Unknown operator"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {operatorUser?.email ?? "No email"}
                    </p>
                  </div>

                  <Badge variant={getStatusVariant(operator.status)} className="capitalize">
                    {operator.status}
                  </Badge>
                </div>

                <div className="mt-4 gap-3 text-sm sm:grid-cols-2 grid">
                  <div>
                    <p className="text-muted-foreground">Operator ID</p>
                    <p className="font-medium">
                      <DataValue value={operator.id} />
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">User ID</p>
                    <p className="font-medium">
                      <DataValue value={operator.user?.userId ?? operator.userId} />
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">
                      <DataValue value={operatorUser?.phone ?? null} />
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Role</p>
                    <p className="font-medium">
                      <DataValue value={operatorUser?.role ?? null} />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg p-4 border">
              <div className="gap-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Account Status</p>
                  <p className="text-sm text-muted-foreground">Update the user account status.</p>
                </div>
                <Badge variant={getStatusVariant(operator.status)} className="capitalize">
                  {operator.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="operator-status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatusOverride(value as OperatorStatus)}
                >
                  <SelectTrigger id="operator-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="BANNED">Banned</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleUpdateStatus}
                disabled={isUpdatingStatus || !status}
                className="w-full"
              >
                {isUpdatingStatus ? "Updating..." : "Update Status"}
              </Button>
            </div>

            <div className="space-y-4 rounded-lg p-4 border">
              <div className="gap-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Approval Status</p>
                  <p className="text-sm text-muted-foreground">
                    Update operator onboarding approval.
                  </p>
                </div>
                <Badge
                  variant={getApprovalStatusVariant(operator.approvalStatus)}
                  className="capitalize"
                >
                  {operator.approvalStatus}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="operator-approval-status">Approval Status</Label>
                <Select
                  value={approvalStatus}
                  onValueChange={(value) =>
                    setApprovalStatusOverride(value as OperatorApprovalStatus)
                  }
                >
                  <SelectTrigger id="operator-approval-status">
                    <SelectValue placeholder="Select approval status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleUpdateApprovalStatus}
                disabled={isUpdatingApprovalStatus || !approvalStatus}
                className="w-full"
              >
                {isUpdatingApprovalStatus ? "Updating..." : "Update Approval Status"}
              </Button>
            </div>

            <div className="space-y-4 rounded-lg p-4 border">
              <div>
                <p className="text-sm font-medium">Operator Profile</p>
                <p className="text-sm text-muted-foreground">Account and onboarding details.</p>
              </div>

              <div className="gap-3 text-sm sm:grid-cols-2 grid">
                <div className="gap-3 text-sm sm:grid-cols-2 grid">
                  <div>
                    <p className="text-muted-foreground">Profile ID</p>
                    <p className="font-medium">
                      <DataValue value={operator.id} />
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stripe Account Status</p>
                    <p className="font-medium">
                      <DataValue value={operator.stripeAccountStatus} />
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Onboarding Status</p>
                    <p className="font-medium">
                      <DataValue value={operator.approvalStatus} />
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Profile Updated At</p>
                    <p className="font-medium">
                      <DataValue value={new Date(operator.updatedAt).toLocaleString()} />
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Stores</p>
                {operatorStores.length === 0 ? (
                  <div className="rounded-md bg-muted/40 p-3 text-sm text-muted-foreground">
                    No stores available.
                  </div>
                ) : (
                  operatorStores.map((store) => (
                    <div key={store.id} className="rounded-md bg-muted/40 p-3 text-sm">
                      <div className="gap-3 flex items-start justify-between">
                        <div>
                          <p className="font-medium">{store.name}</p>
                          <p className="text-muted-foreground">
                            {store.address}, {store.city}, {store.country}
                          </p>
                        </div>
                        <Badge variant={store.isActive ? "default" : "secondary"}>
                          {store.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="gap-3 text-sm sm:grid-cols-2 grid">
              <div>
                <p className="text-muted-foreground">Created At</p>
                <p className="font-medium">
                  <DataValue value={new Date(operator.createdAt).toLocaleString()} />
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Updated At</p>
                <p className="font-medium">
                  <DataValue value={new Date(operator.updatedAt).toLocaleString()} />
                </p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
