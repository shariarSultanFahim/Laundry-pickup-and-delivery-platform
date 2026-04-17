"use client";

import type { AdSubscription } from "@/types/operator-ad";

import { CustomPagination } from "@/components/ui/custom-pagination";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/ui";

interface AdSubscriptionsTableProps {
  subscriptions: AdSubscription[];
  isLoading?: boolean;
  cancelingId?: string;
  page: number;
  totalPage: number;
  setPage: (page: number) => void;
  onCancel: (subscriptionId: string) => void;
}

function statusClassName(status: AdSubscription["status"]) {
  if (status === "ACTIVE") {
    return "bg-emerald-50 text-emerald-600";
  }

  if (status === "EXPIRED") {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "CANCELLED") {
    return "bg-red-50 text-red-700";
  }

  return "bg-muted text-muted-foreground";
}

export default function AdSubscriptionsTable({
  subscriptions,
  isLoading = false,
  cancelingId,
  page,
  totalPage,
  setPage,
  onCancel
}: AdSubscriptionsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Ad Subscriptions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md overflow-x-auto border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-muted-foreground text-center">
                    No subscription records.
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">{subscription.planId}</TableCell>
                    <TableCell>
                      <Badge className={statusClassName(subscription.status)}>
                        {subscription.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(subscription.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(subscription.endDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      {subscription.status === "ACTIVE" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onCancel(subscription.id)}
                          disabled={cancelingId === subscription.id}
                        >
                          {cancelingId === subscription.id ? "Canceling..." : "Cancel Subscription"}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">No action</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPage > 1 ? (
          <CustomPagination
            page={page}
            totalPage={totalPage}
            setPage={setPage}
            isLoading={isLoading}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
