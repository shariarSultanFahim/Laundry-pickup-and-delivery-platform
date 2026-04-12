"use client";

import { useEffect, useMemo, useState } from "react";

import { Eye, Filter, Search } from "lucide-react";

import {
  OperatorApprovalStatus,
  OperatorStatus,
  type GetOperatorsQueryParams
} from "@/types/operator-management";

import { useGetOperators } from "@/lib/actions/operators/use-get-operators";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";

import OperatorDetailsSheet from "./operator-details-sheet";
import OperatorsFilterSheet from "./operators-filter-sheet";

const PAGE_SIZE = 10;

function getStatusVariant(status: OperatorStatus) {
  if (status === OperatorStatus.ACTIVE) return "default";
  if (status === OperatorStatus.INACTIVE) return "secondary";
  return "destructive";
}

function getApprovalVariant(status: OperatorApprovalStatus) {
  if (status === OperatorApprovalStatus.APPROVED) return "default";
  if (status === OperatorApprovalStatus.PENDING) return "secondary";
  return "destructive";
}

export default function OperatorsTable() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<GetOperatorsQueryParams>({});
  const [page, setPage] = useState(1);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const [selectedOperatorId, setSelectedOperatorId] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  const queryParams: GetOperatorsQueryParams = {
    page,
    limit: PAGE_SIZE,
    searchTerm: debouncedSearch,
    ...filters
  };

  const { data, isLoading } = useGetOperators(queryParams);
  const operators = data?.data ?? [];
  const meta = data?.meta ?? { total: 0, totalPage: 1, page: 1, limit: PAGE_SIZE };

  const paginationNumbers = useMemo(() => {
    return Array.from({ length: meta.totalPage }, (_, index) => index + 1);
  }, [meta.totalPage]);

  const rangeStart = meta.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, meta.total);

  function handleRowClick(operatorId: string) {
    setSelectedOperatorId(operatorId);
    setDetailsSheetOpen(true);
  }

  return (
    <Card>
      <CardHeader>
        <div className="gap-4 md:flex-row md:items-center md:justify-between flex flex-col">
          <CardTitle>Operators Table</CardTitle>

          <div className="gap-2 flex items-center">
            <div className="md:w-72 relative w-full">
              <Search className="left-3 h-4 w-4 text-muted-foreground absolute top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search operators..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Filter operators"
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
              <TableHead>Operator ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-muted-foreground text-center">
                  Loading operators...
                </TableCell>
              </TableRow>
            ) : operators.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-muted-foreground text-center">
                  No operators found.
                </TableCell>
              </TableRow>
            ) : (
              operators.map((operator) => (
                <TableRow
                  key={operator.id}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleRowClick(operator.operatorProfile.id)}
                >
                  <TableCell className="font-mono text-sm">{operator.userId}</TableCell>
                  <TableCell>{operator.name}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(operator.status)} className="capitalize">
                      {operator.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getApprovalVariant(operator.operatorProfile.approvalStatus)}
                      className="capitalize"
                    >
                      {operator.operatorProfile.approvalStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{operator.email}</TableCell>
                  <TableCell className="text-muted-foreground">{operator.phone}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(operator.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRowClick(operator.operatorProfile.id)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="gap-3 pt-4 text-sm md:flex-row md:items-center md:justify-between flex flex-col border-t">
          <p className="text-muted-foreground">
            Showing {rangeStart}-{rangeEnd} of {meta.total} operators
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

      <OperatorsFilterSheet
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

      <OperatorDetailsSheet
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
        operatorId={selectedOperatorId}
      />
    </Card>
  );
}
