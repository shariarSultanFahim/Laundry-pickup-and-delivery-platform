"use client";

import { useEffect, useState } from "react";
import { Filter, Pen, Search, UserRoundPen } from "lucide-react";

import { UserStatus, AdminUserListItem } from "@/types/user";
import { useGetUsers, UsersQueryParams } from "@/lib/actions/user/use-get-users";
import { useUpdateUserStatus } from "@/lib/actions/user/use-update-user-status";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { DataValue } from "@/ui/data-value";

import UserDetailsSheet from "./user-details-sheet";
import UsersFilterSheet, { UsersFilterParams } from "./users-filter-sheet";

const PAGE_SIZE = 10;

function getStatusVariant(status: UserStatus) {
  if (status === UserStatus.ACTIVE) return "default";
  if (status === UserStatus.INACTIVE) return "secondary";
  return "destructive";
}

export default function UsersTable() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<UsersFilterParams>({});
  const [page, setPage] = useState(1);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserStatus, setEditingUserStatus] = useState<UserStatus>(UserStatus.ACTIVE);

  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timeout);
  }, [search]);

  const queryParams: UsersQueryParams = {
    page,
    limit: PAGE_SIZE,
    searchTerm: debouncedSearch,
    ...filters
  };

  const { data, isLoading } = useGetUsers(queryParams);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateUserStatus();

  const users = data?.data || [];
  const meta = data?.meta || { total: 0, totalPage: 1 };

  const rangeStart = meta.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, meta.total);

  const paginationNumbers = Array.from({ length: meta.totalPage }, (_, index) => index + 1);

  function handleEditClick(user: AdminUserListItem) {
    setEditingUserId(user.id);
    setEditingUserStatus(user.status);
    setEditSheetOpen(true);
  }

  function handleEditSheetClose() {
    setEditSheetOpen(false);
    setEditingUserId(null);
    setEditingUserStatus(UserStatus.ACTIVE);
  }

  function handleEditSheetSave() {
    if (editingUserId) {
      updateStatus({ id: editingUserId, status: editingUserStatus }, {
        onSuccess: () => {
          handleEditSheetClose();
        }
      });
    }
  }

  function handleRowClick(user: AdminUserListItem) {
    setSelectedUserId(user.id);
    setDetailsSheetOpen(true);
  }

  return (
    <Card>
      <CardHeader>
        <div className="gap-4 md:flex-row md:items-center md:justify-between flex flex-col">
          <CardTitle>Users Table</CardTitle>

          <div className="gap-2 flex items-center">
            <div className="md:w-72 relative w-full">
              <Search className="left-3 h-4 w-4 text-muted-foreground absolute top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Filter users"
              onClick={() => setFilterSheetOpen(true)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Total Orders</TableHead>
              <TableHead className="text-center">Total Spent</TableHead>
              <TableHead className="text-center">AOV</TableHead>
              <TableHead>Joined At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-muted-foreground text-center">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-muted-foreground text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleRowClick(user)}
                >
                  <TableCell><DataValue value={user.userID} /></TableCell>
                  <TableCell><DataValue value={user.name} /></TableCell>
                  <TableCell><DataValue value={user.email} /></TableCell>
                  <TableCell><DataValue value={user.phone} /></TableCell>
                  <TableCell className="capitalize"><DataValue value={user.role} /></TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusVariant(user.status)} className="capitalize">
                      {user.status || "UNKNOWN"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center"><DataValue value={user.totalOrders} /></TableCell>
                  <TableCell className="text-center"><DataValue value={user.totalPaymentAmount ? `$${user.totalPaymentAmount.toLocaleString()}` : null} /></TableCell>
                  <TableCell className="text-center"><DataValue value={user.averageOrderValue ? `$${user.averageOrderValue.toFixed(2)}` : null} /></TableCell>
                  <TableCell><DataValue value={new Date(user.createdAt).toLocaleDateString()} /></TableCell>
                  <TableCell onClick={() => handleEditClick(user)} className="text-center flex items-center justify-center">
                    <UserRoundPen className="h-4 w-4" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="gap-3 pt-4 text-sm md:flex-row md:items-center md:justify-between flex flex-col border-t">
          <p className="text-muted-foreground">
            Showing {rangeStart}-{rangeEnd} of {meta.total} users
          </p>

          <div className="gap-2 flex items-center">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>

            {paginationNumbers.map((pageNumber) => (
              <Button
                key={pageNumber}
                variant={pageNumber === page ? "default" : "outline"}
                size="sm"
                disabled={isLoading}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPage || isLoading}
              onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPage))}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>

      <UsersFilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        initialFilters={filters}
        onApplyFilters={(appliedFilters) => {
          setFilters(appliedFilters);
          setPage(1);
        }}
        onClearFilters={() => {
          setFilters({});
          setPage(1);
        }}
      />

      <UserDetailsSheet
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
        userId={selectedUserId}
        onStatusChangeRequest={(userId, currentStatus) => {
          setEditingUserId(userId);
          setEditingUserStatus(currentStatus);
          setEditSheetOpen(true);
        }}
      />

      {/* Edit Status Modal (Called from Details Sidebar or Table optionally) */}
      <Sheet open={editSheetOpen} onOpenChange={handleEditSheetClose}>
        <SheetContent className="p-4">
          <SheetHeader className="p-0">
            <SheetTitle>Edit User Status</SheetTitle>
          </SheetHeader>
          <div className="gap-4 py-4 flex flex-col">
            <div className="gap-2 flex flex-col">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={editingUserStatus}
                onValueChange={(value) =>
                  setEditingUserStatus(value as UserStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleEditSheetSave} disabled={isUpdating} className="mt-4 w-full">
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  );
}
