"use client";

import { useEffect, useState } from "react";

import { Search } from "lucide-react";

import type { OrderStatus } from "@/types/order-management";

import { useGetMyOrders } from "@/lib/actions/order/use-get-my-orders";

import { useDebounce } from "@/hooks/use-debounce";

import { CustomPagination } from "@/components/ui/custom-pagination";
import { Badge } from "@/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";

import OrderDetailsSheet from "./order-details-sheet";

const ORDERS_LIMIT = 10;

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "OUT_FOR_PICKUP",
  "PICKED_UP",
  "RECEIVED_BY_STORE",
  "IN_PROGRESS",
  "READY_FOR_DELIVERY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED"
];

function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

function getStatusVariant(status: string) {
  if (status === "DELIVERED") {
    return "default" as const;
  }

  if (
    status === "PENDING" ||
    status === "PROCESSING" ||
    status === "OUT_FOR_PICKUP" ||
    status === "PICKED_UP" ||
    status === "RECEIVED_BY_STORE" ||
    status === "IN_PROGRESS" ||
    status === "READY_FOR_DELIVERY" ||
    status === "OUT_FOR_DELIVERY"
  ) {
    return "secondary" as const;
  }

  if (status === "REFUNDED") {
    return "outline" as const;
  }

  return "destructive" as const;
}

export default function OrdersTable() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const { data, isLoading } = useGetMyOrders({
    page,
    limit: ORDERS_LIMIT,
    searchTerm: debouncedSearch || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;
  const totalPage = meta?.totalPage ?? 1;

  return (
    <Card>
      <CardHeader>
        <div className="gap-4 md:flex-row md:items-center md:justify-between flex flex-col">
          <CardTitle>Orders</CardTitle>

          <div className="gap-2 flex flex-wrap items-center">
            <div className="md:w-72 relative w-full">
              <Search className="left-3 h-4 w-4 text-muted-foreground absolute top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search orders..."
                className="pl-9"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as OrderStatus | "ALL")}
            >
              <SelectTrigger className="md:w-52 w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {ORDER_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {formatStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-muted-foreground text-center">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-muted cursor-pointer"
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      setDetailsSheetOpen(true);
                    }}
                  >
                    <TableCell className="font-medium text-blue-600">{order.orderNumber}</TableCell>
                    <TableCell>{order.user?.name ?? "Unknown"}</TableCell>
                    <TableCell>
                      {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} items
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">
                      ${Number(order.totalAmount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>
                        {formatStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {meta && totalPage > 1 ? (
          <CustomPagination
            page={page}
            totalPage={totalPage}
            setPage={setPage}
            isLoading={isLoading}
          />
        ) : null}
      </CardContent>

      <OrderDetailsSheet
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
        orderId={selectedOrderId}
      />
    </Card>
  );
}
