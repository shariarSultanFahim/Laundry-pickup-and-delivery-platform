"use client";

import { Trash2 } from "lucide-react";

import type { OperatorAd } from "@/types/operator-ad";

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

interface AdManagementTableProps {
  ads: OperatorAd[];
  isLoading?: boolean;
  page: number;
  totalPage: number;
  setPage: (page: number) => void;
  onToggleStatus: (ad: OperatorAd) => void;
  onDelete: (adId: string) => void;
}

function statusBadgeClassName(status: OperatorAd["status"]) {
  return status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground";
}

export default function AdManagementTable({
  ads,
  isLoading = false,
  page,
  totalPage,
  setPage,
  onDelete
}: AdManagementTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md overflow-x-auto border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promotion</TableHead>
                {/* <TableHead>Store</TableHead> */}
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
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
              ) : ads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-muted-foreground text-center">
                    No ads found.
                  </TableCell>
                </TableRow>
              ) : (
                ads.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">
                          {ad.serviceName || ad.bundleName || "Promoted item"}
                        </p>
                        <p className="text-xs text-muted-foreground">ID: {ad.id.slice(0, 8)}</p>
                      </div>
                    </TableCell>
                    {/* <TableCell>{ad.storeService?.service.name ?? "Unknown store"}</TableCell> */}
                    <TableCell>
                      {Number(ad.avgRating ?? 0).toFixed(1)} ({ad.totalReviewCount ?? 0})
                    </TableCell>
                    <TableCell>
                      <Badge className={statusBadgeClassName(ad.status)}>{ad.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="gap-2 flex items-center justify-end">
                        {/* <Switch
                          checked={ad.status === "ACTIVE"}
                          onCheckedChange={() => onToggleStatus(ad)}
                          aria-label="Toggle ad status"
                        /> */}
                        <Button variant="ghost" size="icon" onClick={() => onDelete(ad.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
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
