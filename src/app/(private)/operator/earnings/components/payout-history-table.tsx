"use client";

import { useState } from "react";

import { Filter, Search } from "lucide-react";

import type { OperatorPayoutStatus } from "@/types/operator-analytics";

import { useGetOperatorPayoutHistory } from "@/lib/actions/operator/use-operator-dashboard";
import { formatDate } from "@/lib/date";

import { CustomPagination } from "@/components/ui/custom-pagination";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";

import PayoutsFilterSheet, { type PayoutFilters } from "./payouts-filter-sheet";

const PAGE_SIZE = 10;

interface PayoutHistoryTableProps {
  storeId?: string;
}

function getStatusVariant(status: OperatorPayoutStatus) {
  if (status === "PAID") {
    return "default";
  }

  if (status === "FAILED") {
    return "destructive";
  }

  return "secondary";
}

export default function PayoutHistoryTable({ storeId }: PayoutHistoryTableProps) {
  const [filters, setFilters] = useState<PayoutFilters>({});
  const [page, setPage] = useState(1);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const { data: payoutHistoryResponse, isLoading } = useGetOperatorPayoutHistory({
    page,
    limit: PAGE_SIZE,
    storeId,
    status: filters.status,
    month: filters.month,
    year: filters.year
  });

  const rows = payoutHistoryResponse?.data ?? [];
  const total = payoutHistoryResponse?.meta.total ?? 0;
  const totalPages = payoutHistoryResponse?.meta.totalPages ?? 1;

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <Card>
      <CardHeader>
        <div className="gap-4 md:flex-row md:items-center md:justify-between flex flex-col">
          <CardTitle>Payout History</CardTitle>

          <div className="gap-2 flex items-center">
            <div className="md:w-72 relative w-full">
              <Search className="left-3 h-4 w-4 text-muted-foreground absolute top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search coming soon..."
                value=""
                onChange={() => null}
                disabled
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Filter payouts"
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
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-muted-foreground text-center">
                  Loading payouts...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-muted-foreground text-center">
                  No payouts found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((payout) => (
                <TableRow key={payout.transactionId}>
                  <TableCell className="text-muted-foreground">
                    {formatDate(payout.createdAt)}
                  </TableCell>
                  <TableCell className="font-semibold">${payout.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(payout.payoutStatus)}>
                      {payout.payoutStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{payout.note ?? payout.orderNumber ?? payout.transactionId}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="gap-3 pt-4 text-sm md:flex-row md:items-center md:justify-between flex flex-col border-t">
          <p className="text-muted-foreground">
            Showing {rangeStart}-{rangeEnd} of {total} payouts
          </p>

          <CustomPagination
            page={page}
            totalPage={totalPages}
            isLoading={isLoading}
            setPage={setPage}
          />
        </div>
      </CardContent>

      <PayoutsFilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        onApplyFilters={(appliedFilters: PayoutFilters) => {
          setFilters(appliedFilters);
          setPage(1);
        }}
        onClearFilters={() => {
          setFilters({});
          setPage(1);
        }}
      />
    </Card>
  );
}
