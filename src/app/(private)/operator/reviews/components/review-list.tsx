"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";

import type { OperatorReview } from "../data/review";
import type { OperatorReviewFilters } from "../schema/review-filters.schema";
import { fetchOperatorReviews } from "./review-api";

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

interface ReviewListProps {
  filters: OperatorReviewFilters;
}

export default function ReviewList({ filters }: ReviewListProps) {
  const [reviews, setReviews] = useState<OperatorReview[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const prevFiltersRef = useRef<OperatorReviewFilters | null>(null);

  useEffect(() => {
    const filtersChanged =
      prevFiltersRef.current?.rating !== filters.rating ||
      prevFiltersRef.current?.serviceType !== filters.serviceType ||
      prevFiltersRef.current?.sortBy !== filters.sortBy;

    if (filtersChanged && page !== 1) {
      setPage(1);
    }

    prevFiltersRef.current = filters;
  }, [filters, page]);

  useEffect(() => {
    let isMounted = true;

    async function loadReviews() {
      setIsLoading(true);
      const response = await fetchOperatorReviews({
        page,
        pageSize: PAGE_SIZE,
        rating: filters.rating,
        serviceType: filters.serviceType,
        sortBy: filters.sortBy
      });

      if (!isMounted) return;

      setReviews(response.items);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setIsLoading(false);
    }

    void loadReviews();

    return () => {
      isMounted = false;
    };
  }, [filters, page]);

  const paginationNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

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
                      <AvatarImage src={review.customerImage} alt={review.customerName} />
                      <AvatarFallback>
                        {review.customerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="gap-2 flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{review.customerName}</p>
                          <StarRating rating={review.rating} />
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {review.createdAt}
                        </p>
                      </div>

                      <p className="mt-3 text-sm text-foreground">{review.comment}</p>

                      <div className="gap-4 mt-3 text-xs text-muted-foreground flex items-center">
                        <span>Order {review.orderId}</span>
                        <span>•</span>
                        <span>{review.serviceType}</span>
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

            <div className="gap-2 flex items-center">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>

              {paginationNumbers.map((pageNumber) => (
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
        </>
      )}
    </div>
  );
}
