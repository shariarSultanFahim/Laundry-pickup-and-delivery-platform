"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { Filter, Search } from "lucide-react";

import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";

import type { Order, OrderFilters } from "../data/orders";
import OrderDetailsSheet from "./order-details-sheet";
import { fetchNewOrders, updateNewOrderStatus } from "./orders-api";
import OrdersFilterSheet from "./orders-filter-sheet";

const PAGE_SIZE = 10;

const NEW_ORDER_STATUS_OPTIONS: Array<Order["status"]> = ["Pending", "Accepted", "Rejected"];

const NEW_ORDER_STATUS_LABELS: Partial<Record<Order["status"], string>> = {
  Pending: "Pending",
  Accepted: "Accept",
  Rejected: "Reject"
};

export default function NewOrdersTable() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<OrderFilters>({});
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
      const response = await fetchNewOrders({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        filters
      });

      if (!isMounted) {
        return;
      }

      const newOrderRows = response.items;

      setRows(newOrderRows);
      setTotal(newOrderRows.length);
      setTotalPages(newOrderRows.length === 0 ? 1 : Math.ceil(newOrderRows.length / PAGE_SIZE));
      setIsLoading(false);
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

  async function handleDecisionChange(orderId: string, decision: Order["status"]) {
    if (decision !== "Pending" && decision !== "Accepted" && decision !== "Rejected") {
      return;
    }

    await updateNewOrderStatus({ orderId, status: decision });

    const response = await fetchNewOrders({
      page,
      pageSize: PAGE_SIZE,
      search: debouncedSearch,
      filters
    });

    setRows(response.items);
    setTotal(response.total);
    setTotalPages(response.totalPages);

    if (selectedOrder?.id === orderId && decision === "Accepted") {
      setDetailsSheetOpen(false);
      setSelectedOrder(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="gap-4 md:flex-row md:items-center md:justify-between flex flex-col">
          <CardTitle>Newly Placed Orders</CardTitle>

          <div className="gap-2 flex flex-wrap items-center">
            <div className="md:w-72 relative w-full">
              <Search className="left-3 h-4 w-4 text-muted-foreground absolute top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search new orders..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>

            <Button variant="outline" size="icon" onClick={() => setFilterSheetOpen(true)}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Order fulfillment time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-muted-foreground text-center">
                    No new orders found
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((order) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-muted cursor-pointer"
                    onClick={() => {
                      setSelectedOrder(order);
                      setDetailsSheetOpen(true);
                    }}
                  >
                    <TableCell className="font-medium text-blue-600">{order.id}</TableCell>
                    <TableCell>
                      <div className="gap-2 flex items-center">
                        <Image
                          src={order.customerAvatar}
                          alt={order.customerName}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <span>{order.customerName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.items} {order.items === 1 ? "item" : "items"}
                    </TableCell>
                    <TableCell>{order.fulfillmentTime}</TableCell>
                    <TableCell className="font-medium">${order.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div onClick={(event) => event.stopPropagation()}>
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleDecisionChange(order.id, value as Order["status"])
                          }
                        >
                          <SelectTrigger className="w-30">
                            <SelectValue placeholder="Pending" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Accepted">Accept</SelectItem>
                            <SelectItem value="Rejected">Reject</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="text-blue-600 p-0 h-auto"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedOrder(order);
                          setDetailsSheetOpen(true);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="gap-2 mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {rangeStart} to {rangeEnd} of {total} results
          </p>

          <div className="gap-2 flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>

            {paginationNumbers.map((num) => (
              <Button
                key={num}
                variant={page === num ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(num)}
              >
                {num}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>

      <OrdersFilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        title="Filter New Orders"
        statusOptions={NEW_ORDER_STATUS_OPTIONS}
        onApplyFilters={(newFilters) => {
          setFilters(newFilters);
        }}
        onClearFilters={() => {
          setFilters({});
        }}
      />

      <OrderDetailsSheet
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
        order={selectedOrder}
        statusOptions={NEW_ORDER_STATUS_OPTIONS}
        statusLabelMap={NEW_ORDER_STATUS_LABELS}
        onStatusChange={(orderId, status) => {
          void handleDecisionChange(orderId, status);
        }}
      />
    </Card>
  );
}
