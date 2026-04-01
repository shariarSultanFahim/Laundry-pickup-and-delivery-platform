"use client";

import { UserStatus } from "@/types/user";
import { useGetUserById } from "@/lib/actions/user/use-get-user-by-id";
import { useBanUser, useUnbanUser } from "@/lib/actions/user/use-update-user-status";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";
import { DataValue } from "@/ui/data-value";

interface UserDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  onStatusChangeRequest: (userId: string, currentStatus: UserStatus) => void;
}

function getStatusVariant(status: UserStatus) {
  if (status === UserStatus.ACTIVE) return "default";
  if (status === UserStatus.INACTIVE) return "secondary";
  return "destructive";
}

function getRoleColor(role: string) {
  if (role === "USER") return "bg-blue-100 text-blue-800";
  if (role === "ADMIN") return "bg-purple-100 text-purple-800";
  return "bg-green-100 text-green-800";
}

export default function UserDetailsSheet({ open, onOpenChange, userId, onStatusChangeRequest }: UserDetailsSheetProps) {
  const { data: user, isLoading } = useGetUserById(userId || "");
  const { mutate: banUser, isPending: isBanning } = useBanUser();
  const { mutate: unbanUser, isPending: isUnbanning } = useUnbanUser();

  if (!open) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-md p-4 w-full overflow-y-auto">
        <SheetHeader className="p-0">
          <SheetTitle>User Details</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">Loading user details...</p>
          </div>
        ) : !user ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">User not found or ID is missing.</p>
          </div>
        ) : (
          <div className="space-y-6 py-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                <p className="font-mono text-sm font-semibold"><DataValue value={user.userID} /></p>
              </div>

              <div className="space-y-2 text-right">
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-base font-semibold"><DataValue value={user.name} /></p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm break-all"><DataValue value={user.email} /></p>
              </div>

              <div className="space-y-2 text-right">
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-sm"><DataValue value={user.phone} /></p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <div>
                  {user.role ? (
                    <Badge className={`${getRoleColor(user.role)} capitalize`}>{user.role}</Badge>
                  ) : <DataValue value={null} />}
                </div>
              </div>

              <div className="space-y-2 text-right">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(user.status)} className="capitalize">
                    {user.status}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => onStatusChangeRequest(user.id, user.status)}>
                    Edit
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <p className="text-sm font-medium text-muted-foreground">Activity Summary</p>
              <div className="gap-4 grid grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                  <p className="mt-1 text-xl font-bold"><DataValue value={user.totalOrders} /></p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                  <p className="mt-1 text-xl font-bold">
                    <DataValue value={user.totalPaymentAmount ? `$${user.totalPaymentAmount.toLocaleString()}` : null} />
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-muted-foreground">Average Order Value</p>
                <p className="mt-1 text-lg font-bold">
                  <DataValue value={user.averageOrderValue ? `$${user.averageOrderValue.toFixed(2)}` : null} />
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Joined At</p>
                <p className="text-sm">
                  <DataValue value={new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })} />
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Updated At</p>
                <p className="text-sm">
                  <DataValue value={new Date(user.updatedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })} />
                </p>
              </div>
            </div>



            <div className="pt-6 border-t">
              {user.status === UserStatus.BANNED ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => unbanUser(user.id)}
                  disabled={isUnbanning}
                >
                  {isUnbanning ? "Unbanning..." : "Unban User"}
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => banUser(user.id)}
                  disabled={isBanning}
                >
                  {isBanning ? "Banning..." : "Ban User"}
                </Button>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
