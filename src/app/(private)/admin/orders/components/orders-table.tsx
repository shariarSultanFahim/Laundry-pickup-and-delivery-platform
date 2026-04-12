"use client";

import { useEffect, useMemo, useState } from "react";

import { Filter, Search } from "lucide-react";

import type { AdminOrder, OrderFilters } from "@/types/order-management";

import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";

import OrderDetailsSheet from "./order-details-sheet";
import { fetchOrders } from "./orders-api";
import OrdersFilterSheet from "./orders-filter-sheet";

const PAGE_SIZE = 10;

function getOrderStatusVariant(status: AdminOrder["status"]) {
  switch (status) {
    case "DELIVERED":
      return "default";
    case "PENDING":
      return "outline";
    case "PROCESSING":
    case "OUT_FOR_PICKUP":
    case "PICKED_UP":
    case "RECEIVED_BY_STORE":
    case "IN_PROGRESS":
    case "READY_FOR_DELIVERY":
    case "OUT_FOR_DELIVERY":
      return "secondary";
    case "CANCELLED":
    case "REFUNDED":
      return "destructive";
    default:
      return "outline";
  }
}

function getPaymentStatusVariant(status: AdminOrder["paymentStatus"]) {
  switch (status) {
    case "PAID":
    case "DISBURSED":
      return "default";
    case "UNPAID":
    case "ESCROW_HELD":
      return "secondary";
    case "REFUNDED":
      return "destructive";
    default:
      return "outline";
  }
}

export default function OrdersTable() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<OrderFilters>({});
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
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

    async function loadOrders() {
      setIsLoading(true);
      try {
        const response = await fetchOrders({
          page,
          limit: PAGE_SIZE,
          searchTerm: debouncedSearch,
          ...filters
        });

        if (!isMounted) return;

        setRows(response.data);
        setTotal(response.meta.total);
        setTotalPages(response.meta.totalPage);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadOrders();

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
          <CardTitle>Recent Orders</CardTitle>

          <div className="gap-2 flex items-center">
            <div className="md:w-72 relative w-full">
              <Search className="left-3 h-4 w-4 text-muted-foreground absolute top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search orders..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              aria-label="Filter orders"
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
              <TableHead>Order#</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-muted-foreground text-center">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-muted-foreground text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    setSelectedOrder(order);
                    setDetailsSheetOpen(true);
                  }}
                >
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.user.name}</p>
                      <p className="text-muted-foreground text-xs">{order.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>${Number(order.totalAmount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getOrderStatusVariant(order.status)} className="text-[10px] font-semibold">
                      {order.status.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPaymentStatusVariant(order.paymentStatus)} className="text-[10px] font-semibold">
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="gap-3 pt-4 text-sm md:flex-row md:items-center md:justify-between flex flex-col border-t">
          <p className="text-muted-foreground">
            Showing {rangeStart}-{rangeEnd} of {total} orders
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

            {paginationNumbers.length > 0 && paginationNumbers.map((pageNumber) => (
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

      <OrdersFilterSheet
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

      <OrderDetailsSheet
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
        orderId={selectedOrder?.id}
      />
    </Card>
  );
}
