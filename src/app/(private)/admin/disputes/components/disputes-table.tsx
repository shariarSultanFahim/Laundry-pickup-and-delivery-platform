"use client";

import { useEffect, useMemo, useState } from "react";

import { Filter, Search } from "lucide-react";

import type { DisputeFilters, DisputeManagementDispute } from "@/types/dispute-management";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";

import DisputeDetailsSheet from "./dispute-details-sheet";
import { fetchDisputes } from "./disputes-api";
import DisputesFilterSheet from "./disputes-filter-sheet";

const PAGE_SIZE = 10;

function getStatusVariant(status: DisputeManagementDispute["status"]) {
  if (status === "resolved") {
    return "default";
  }

  if (status === "open") {
    return "secondary";
  }

  return "destructive";
}

export default function DisputesTable() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<DisputeFilters>({});
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<DisputeManagementDispute[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<DisputeManagementDispute | null>(null);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let isMounted = true;

    async function loadDisputes() {
      setIsLoading(true);
      const response = await fetchDisputes({
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

    void loadDisputes();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, page, filters]);

  const paginationNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <Card>
      <CardHeader>
        <div className="gap-4 md:flex-row md:items-center md:justify-between flex flex-col">
          <CardTitle>Disputes</CardTitle>

          <div className="gap-2 flex items-center">
            <div className="md:w-72 relative w-full">
              <Search className="left-3 h-4 w-4 text-muted-foreground absolute top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search disputes..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              aria-label="Filter disputes"
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
              <TableHead>Claim ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-muted-foreground text-center">
                  Loading disputes...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-muted-foreground text-center">
                  No disputes found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((dispute) => (
                <TableRow
                  key={dispute.id}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    setSelectedDispute(dispute);
                    setDetailsSheetOpen(true);
                  }}
                >
                  <TableCell>
                    <span className="font-medium text-blue-600">{dispute.claimId}</span>
                  </TableCell>
                  <TableCell>{dispute.orderId}</TableCell>
                  <TableCell>{dispute.customerName}</TableCell>
                  <TableCell>{dispute.operatorName}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(dispute.status)} className="capitalize">
                      {dispute.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="gap-3 pt-4 text-sm md:flex-row md:items-center md:justify-between flex flex-col border-t">
          <p className="text-muted-foreground">
            Showing {rangeStart}-{rangeEnd} of {total} disputes
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

      <DisputesFilterSheet
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

      <DisputeDetailsSheet
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
        dispute={selectedDispute}
      />
    </Card>
  );
}
