"use client";

import type { UserManagementUser } from "@/types/user-management";

import { Badge } from "@/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";

interface UserDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserManagementUser | null;
}

function getStatusVariant(status: UserManagementUser["status"]) {
  if (status === "active") {
    return "default";
  }

  if (status === "inactive") {
    return "secondary";
  }

  return "destructive";
}

function getRoleColor(role: UserManagementUser["role"]) {
  if (role === "customer") {
    return "bg-blue-100 text-blue-800";
  }

  if (role === "operator") {
    return "bg-green-100 text-green-800";
  }

  return "bg-purple-100 text-purple-800";
}

export default function UserDetailsSheet({ open, onOpenChange, user }: UserDetailsSheetProps) {
  if (!user) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-md p-4 w-full overflow-y-auto">
        <SheetHeader className="p-0">
          <SheetTitle>User Details</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* User ID and Name */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">User ID</p>
              <p className="font-mono text-sm font-semibold">{user.id}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-base font-semibold">{user.name}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm break-all">{user.email}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-sm">{user.phone}</p>
            </div>
          </div>

          {/* Role and Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <div>
                <Badge className={`${getRoleColor(user.role)} capitalize`}>{user.role}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div>
                <Badge variant={getStatusVariant(user.status)} className="capitalize">
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Status Note */}
          {user.statusNote && (
            <div className="rounded-lg border-orange-200 bg-orange-50 p-3 border">
              <p className="text-xs font-medium text-orange-900">Status Note</p>
              <p className="mt-1 text-sm text-orange-800">{user.statusNote}</p>
            </div>
          )}

          {/* Activity Statistics */}
          <div className="space-y-3 pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground">Activity</p>

            <div className="gap-4 grid grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-muted-foreground">Total Orders</p>
                <p className="mt-1 text-xl font-bold">{user.totalOrders}</p>
              </div>

              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-muted-foreground">Total Spent</p>
                <p className="mt-1 text-xl font-bold">${user.totalSpent.toLocaleString()}</p>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-muted-foreground">Average Order Value</p>
              <p className="mt-1 text-lg font-bold">
                ${user.totalOrders > 0 ? (user.totalSpent / user.totalOrders).toFixed(2) : "0.00"}
              </p>
            </div>
          </div>

          {/* Join Date */}
          <div className="space-y-2 pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground">Joined At</p>
            <p className="text-sm">
              {new Date(user.joinedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
