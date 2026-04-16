"use client";

import { useState } from "react";

import { Star } from "lucide-react";

import { useGetAdminReviews } from "@/lib/actions/reviews/use-admin-reviews";
import { formatDate } from "@/lib/date";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { CustomPagination } from "@/ui/custom-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";

const PAGE_SIZE = 1;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="gap-0.5 flex items-center">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewsTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAdminReviews({
    page,
    limit: PAGE_SIZE
  });

  const rows = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPage ?? 1;

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reviews</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Review ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-muted-foreground text-center">
                  Loading reviews...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-muted-foreground text-center">
                  No reviews found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.reviewNumber ?? review.id}</TableCell>
                  <TableCell>{review.user.name}</TableCell>
                  <TableCell>
                    <StarRating rating={review.rating} />
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm line-clamp-2">{review.comment}</p>
                  </TableCell>
                  <TableCell>
                    {review.service?.service?.name ??
                      review.bundle?.bundle?.name ??
                      review.bundle?.name ??
                      "-"}
                  </TableCell>
                  <TableCell>
                    {review.service?.store?.name ?? review.bundle?.store?.name ?? "-"}
                  </TableCell>
                  <TableCell>{formatDate(review.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="gap-3 pt-4 text-sm md:flex-row md:items-center md:justify-between flex flex-col border-t">
          <p className="text-muted-foreground">
            Showing {rangeStart}-{rangeEnd} of {total} reviews
          </p>

          <CustomPagination
            page={page}
            totalPage={totalPages}
            isLoading={isLoading}
            setPage={setPage}
          />
        </div>
      </CardContent>
    </Card>
  );
}
