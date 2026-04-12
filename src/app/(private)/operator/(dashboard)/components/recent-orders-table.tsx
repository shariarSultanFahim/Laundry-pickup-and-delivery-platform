"use client";

import Link from "next/link";

import type { MyOrder } from "@/types/operator-analytics";

import { Badge } from "@/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";

interface RecentOrdersTableProps {
  data: MyOrder[];
}

function getStatusVariant(status: string) {
  if (status === "COMPLETED" || status === "DELIVERED") {
    return "default";
  }

  if (status === "PENDING" || status === "PROCESSING" || status === "CONFIRMED") {
    return "secondary";
  }

  if (status === "OUT_FOR_DELIVERY" || status === "SHIPPED") {
    return "outline";
  }

  return "destructive";
}

export default function RecentOrdersTable({ data }: RecentOrdersTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
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
            {data.map((order) => (
              <TableRow key={order.id}>
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
                  <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell>
                  <Link href={`/operator/orders/${order.id}`} className="text-blue-600 text-sm">
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
