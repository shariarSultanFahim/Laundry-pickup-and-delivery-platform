"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";

import { RecentOrder } from "../data/dashboard";

interface RecentOrdersTableProps {
  data: RecentOrder[];
}

function getStatusVariant(status: RecentOrder["status"]) {
  if (status === "Delivered") {
    return "default";
  }

  if (status === "Processing") {
    return "secondary";
  }

  return "outline";
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
