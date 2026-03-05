"use client";

import { useEffect, useMemo, useState } from "react";

import { Filter, Search } from "lucide-react";

import type { Operator, OperatorFilters } from "@/types/operator-management";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";

import OperatorCommissionSheet from "./operator-commission-sheet";
import { fetchOperators } from "./operators-api";
import OperatorsFilterSheet from "./operators-filter-sheet";

const PAGE_SIZE = 10;

function getStatusVariant(status: Operator["status"]) {
  if (status === "active") {
    return "default";
  }

  if (status === "inactive") {
    return "secondary";
  }

  return "destructive";
}

export default function OperatorsTable() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<OperatorFilters>({});
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Operator[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [commissionSheetOpen, setCommissionSheetOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let isMounted = true;

    async function loadOperators() {
      setIsLoading(true);
      const response = await fetchOperators({
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

    void loadOperators();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, page, filters]);

  const paginationNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  function handleStatusChange(operatorId: string, newStatus: Operator["status"]) {
    setRows((prev) =>
      prev.map((operator) =>
        operator.id === operatorId ? { ...operator, status: newStatus } : operator
      )
    );
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
              <TableHead>Last Login</TableHead>
              <TableHead>Store/Area</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-muted-foreground text-center">
                  Loading operators...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-muted-foreground text-center">
                  No operators found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((operator) => (
                <TableRow
                  key={operator.id}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    setSelectedOperator(operator);
                    setCommissionSheetOpen(true);
                  }}
                >
                  <TableCell>{operator.id}</TableCell>
                  <TableCell>{operator.name}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(operator.status)} className="capitalize">
                      {operator.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{operator.lastLogin}</TableCell>
                  <TableCell>
                    {operator.store} - {operator.area}
                  </TableCell>
                  <TableCell>{operator.region}</TableCell>
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <Select
                      value={operator.status}
                      onValueChange={(value) =>
                        handleStatusChange(operator.id, value as Operator["status"])
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="gap-3 pt-4 text-sm md:flex-row md:items-center md:justify-between flex flex-col border-t">
          <p className="text-muted-foreground">
            Showing {rangeStart}-{rangeEnd} of {total} operators
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

      <OperatorsFilterSheet
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

      <OperatorCommissionSheet
        open={commissionSheetOpen}
        onOpenChange={setCommissionSheetOpen}
        operator={selectedOperator}
      />
    </Card>
  );
}
