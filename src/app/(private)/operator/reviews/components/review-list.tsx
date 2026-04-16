"use client";

import { useState } from "react";

import { Star } from "lucide-react";

import { useGetOperatorReviewFeed } from "@/lib/actions/operator/use-operator-reviews";
import { formatDate } from "@/lib/date";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { Card, CardContent } from "@/ui/card";

// import type { OperatorReviewFilters } from "../schema/review-filters.schema";

const PAGE_SIZE = 10;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="gap-0.5 flex items-center">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

// interface ReviewListProps {
//   filters: OperatorReviewFilters;
// }

export default function ReviewList() {
  const [page, setPage] = useState(1);
  // const prevFiltersRef = useRef<OperatorReviewFilters | null>(null);

  const { data, isLoading } = useGetOperatorReviewFeed({
    page,
    limit: PAGE_SIZE,
    // rating: filters.rating,
    // serviceType: filters.serviceType,
    sortBy: "newest"
  });

  const reviews = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // useEffect(() => {
  //   const filtersChanged =
  //     prevFiltersRef.current?.rating !== filters.rating ||
  //     prevFiltersRef.current?.serviceType !== filters.serviceType ||
  //     prevFiltersRef.current?.sortBy !== filters.sortBy;

  //   if (filtersChanged && page !== 1) {
  //     setPage(1);
  //   }

  //   prevFiltersRef.current = filters;
  // }, [filters, page]);

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="space-y-4">
      {isLoading ? (
        <Card>
          <CardContent className="h-32 text-muted-foreground flex items-center justify-center">
            Loading reviews...
          </CardContent>
        </Card>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="h-32 text-muted-foreground flex items-center justify-center">
            No reviews found.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="gap-4 flex">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage src={review.user.avatar ?? undefined} alt={review.user.name} />
                      <AvatarFallback>
                        {review.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="gap-2 flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{review.user.name}</p>
                          <StarRating rating={review.rating} />
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>

                      <p className="mt-3 text-sm text-foreground">{review.comment}</p>

                      <div className="gap-4 mt-3 text-xs text-muted-foreground flex items-center">
                        <span>{review.service?.service?.name ?? "Unknown service"}</span>
                        <span>•</span>
                        <span>{review.service?.store?.name ?? "Unknown store"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="gap-3 pt-4 text-sm md:flex-row md:items-center md:justify-between flex flex-col border-t">
            <p className="text-muted-foreground">
              Showing {rangeStart}-{rangeEnd} of {total} review{total !== 1 ? "s" : ""}
            </p>

            <CustomPagination
              page={page}
              totalPage={totalPages}
              isLoading={isLoading}
              setPage={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
