"use client";

import { useState } from "react";

import type { OrderStatus } from "@/types/order-management";

import { useGetMyOrders } from "@/lib/actions/order/use-get-my-orders";

import { CustomPagination } from "@/components/ui/custom-pagination";
import { Badge } from "@/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";

import OrderDetailsSheet from "./order-details-sheet";

const NEW_ORDERS_LIMIT = 5;

function getStatusVariant(status: string) {
  if (status === "DELIVERED") {
    return "default" as const;
  }

  if (status === "PENDING" || status === "PROCESSING") {
    return "secondary" as const;
  }

  if (status === "OUT_FOR_DELIVERY") {
    return "outline" as const;
  }

  return "destructive" as const;
}

function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export default function NewOrdersTable() {
  const [page, setPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);

  const { data, isLoading } = useGetMyOrders({
    page,
    limit: NEW_ORDERS_LIMIT,
    status: "PENDING" as OrderStatus
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;
  const totalPage = meta?.totalPage ?? 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Newly Placed Orders</CardTitle>
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
                    No newly placed orders
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
