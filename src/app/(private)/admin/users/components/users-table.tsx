"use client";

import { useEffect, useMemo, useState } from "react";

import { Filter, Pencil, Search } from "lucide-react";

import type { UserFilters, UserManagementUser } from "@/types/user-management";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { Textarea } from "@/ui/textarea";

import DateRangePicker from "./date-range-picker";
import UserDetailsSheet from "./user-details-sheet";
import { fetchUsers } from "./users-api";
import UsersFilterSheet from "./users-filter-sheet";

const PAGE_SIZE = 5;

function getStatusVariant(status: UserManagementUser["status"]) {
  if (status === "active") {
    return "default";
  }

  if (status === "inactive") {
    return "secondary";
  }

  return "destructive";
}

export default function UsersTable() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<UserFilters>({});
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<UserManagementUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserStatus, setEditingUserStatus] =
    useState<UserManagementUser["status"]>("active");
  const [editingUserNote, setEditingUserNote] = useState("");
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserManagementUser | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      setIsLoading(true);
      const response = await fetchUsers({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        filters
      });

      if (!isMounted) {
        return;
      }

      setRows(response.items);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setIsLoading(false);
    }

    void loadUsers();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, page, filters]);

  const paginationNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  function handleStatusChange(userId: string, newStatus: UserManagementUser["status"]) {
    setRows((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, status: newStatus } : user))
    );
  }

  function handleEditClick(user: UserManagementUser) {
    setEditingUserId(user.id);
    setEditingUserStatus(user.status);
    setEditingUserNote("");
    setEditSheetOpen(true);
  }

  function handleEditSheetClose() {
    setEditSheetOpen(false);
    setEditingUserId(null);
    setEditingUserStatus("active");
    setEditingUserNote("");
  }

  function handleEditSheetSave() {
    if (editingUserId) {
      handleStatusChange(editingUserId, editingUserStatus);
      handleEditSheetClose();
    }
  }

  function handleRowClick(user: UserManagementUser) {
    setSelectedUser(user);
    setDetailsSheetOpen(true);
  }

  function handleApplyDateRange(from: Date, to?: Date) {
    setFilters((prev) => ({
      ...prev,
      dateRange: { from, to }
    }));
    setPage(1);
  }

  function handleClearDateRange() {
    setFilters((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { dateRange, ...rest } = prev;
      return rest;
    });
    setPage(1);
  }

  return (
    <Card>
      <CardHeader>
        <div className="gap-4 md:flex-row md:items-center md:justify-between flex flex-col">
          <CardTitle>Users Table</CardTitle>

          <div className="gap-2 flex items-center">
            <div className="md:w-80">
              <DateRangePicker
                from={filters.dateRange?.from}
                to={filters.dateRange?.to}
                onApply={handleApplyDateRange}
                onClear={handleClearDateRange}
              />
            </div>
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
              <TableHead>Status</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>AOV</TableHead>
              <TableHead>Joined At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-muted-foreground text-center">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-muted-foreground text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleRowClick(user)}
                >
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(user.status)} className="capitalize">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.totalOrders}</TableCell>
                  <TableCell>${user.totalSpent.toLocaleString()}</TableCell>
                  <TableCell>
                    $
                    {user.totalOrders > 0
                      ? (user.totalSpent / user.totalOrders).toFixed(2)
                      : "0.00"}
                  </TableCell>
                  <TableCell>{user.joinedAt}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Edit user"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(user);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="gap-3 pt-4 text-sm md:flex-row md:items-center md:justify-between flex flex-col border-t">
          <p className="text-muted-foreground">
            Showing {rangeStart}-{rangeEnd} of {total} users
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
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>

      <UsersFilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        onApplyFilters={(appliedFilters) => {
          setFilters(appliedFilters);
          setPage(1);
        }}
        onClearFilters={() => {
          setFilters({});
          setPage(1);
        }}
      />

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
                  setEditingUserStatus(value as UserManagementUser["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="gap-2 flex flex-col">
              <label className="text-sm font-medium">Note</label>
              <Textarea
                placeholder="Add a note..."
                value={editingUserNote}
                className="border-border"
                onChange={(event) => setEditingUserNote(event.target.value)}
              />
            </div>
            <Button onClick={handleEditSheetSave} className="mt-4 w-full">
              Save Changes
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <UserDetailsSheet
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
        user={selectedUser}
      />
    </Card>
  );
}
