"use client";

import { useEffect, useMemo, useState } from "react";

import { Search } from "lucide-react";

import type { DisputeManagementDispute } from "@/types/dispute-management";

import { useGetDisputes } from "@/lib/actions/disputes/use-disputes";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";

import DisputeResponseSheet from "./dispute-response-sheet";

const PAGE_SIZE = 10;

function getStatusVariant(status: DisputeManagementDispute["status"]) {
  if (status === "RESOLVED" || status === "REFUNDED") {
    return "default";
  }

  if (status === "PENDING") {
    return "secondary";
  }

  return "destructive";
}

export default function DisputesTable() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedDispute, setSelectedDispute] = useState<DisputeManagementDispute | null>(null);
  const [responseSheetOpen, setResponseSheetOpen] = useState(false);

  const queryParams = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      search: debouncedSearch,
      filters: {}
    }),
    [page, debouncedSearch]
  );

  const { data: disputesResponse, isLoading } = useGetDisputes(queryParams, "operator");

  const rows = disputesResponse?.items ?? [];
  const total = disputesResponse?.total ?? 0;
  const totalPages = disputesResponse?.totalPages ?? 1;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleViewDispute = (dispute: DisputeManagementDispute) => {
    setSelectedDispute(dispute);
    setResponseSheetOpen(true);
  };

  const handleResponseSheetClose = () => {
    setResponseSheetOpen(false);
    setSelectedDispute(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Disputes & Claims</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="left-3 top-2.5 h-4 w-4 text-muted-foreground absolute" />
            <Input
              placeholder="Search by Order ID, customer name, or operator name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          {rows.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">
                {total === 0 ? "No disputes yet" : "No disputes match your search"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-medium">{dispute.orderId}</TableCell>
                      <TableCell>{dispute.customerName}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(dispute.status)}>{dispute.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(dispute.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDispute(dispute)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <div className="pt-4 flex items-center justify-between border-t">
            <div className="text-xs text-muted-foreground">
              {rows.length > 0 ? (
                <span>
                  Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, total)} of{" "}
                  {total} disputes
                </span>
              ) : (
                <span>No disputes to display</span>
              )}
            </div>

            <div className="gap-2 flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                Previous
              </Button>

              {/* Page indicators */}
              <div className="gap-1 flex items-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    disabled={isLoading}
                    className="min-w-8"
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DisputeResponseSheet
        open={responseSheetOpen}
        onOpenChange={handleResponseSheetClose}
        dispute={selectedDispute}
      />
    </>
  );
}
