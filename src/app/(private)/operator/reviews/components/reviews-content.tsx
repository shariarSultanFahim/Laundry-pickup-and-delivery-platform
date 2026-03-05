"use client";

import { lazy, Suspense, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

import type { OperatorReviewFilters } from "../schema/review-filters.schema";
import ReviewFilters from "./review-filters";

const ReviewSummaryCard = lazy(() => import("./review-summary-card"));
const ReviewList = lazy(() => import("./review-list"));

function SummaryLoadingFallback() {
  return (
    <div className="gap-6 md:grid-cols-2 grid grid-cols-1">
      {Array.from({ length: 2 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="h-4 w-24 bg-muted rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-24 text-muted-foreground flex items-center justify-center">
              Loading summary...
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ReviewListLoadingFallback() {
  return (
    <Card>
      <CardContent className="h-32 text-muted-foreground flex items-center justify-center">
        Loading reviews...
      </CardContent>
    </Card>
  );
}

export default function ReviewsContent() {
  const [filters, setFilters] = useState<OperatorReviewFilters>({
    sortBy: "newest"
  });

  return (
    <div className="space-y-6">
      <ReviewFilters filters={filters} onFiltersChange={setFilters} />

      <Suspense fallback={<SummaryLoadingFallback />}>
        <ReviewSummaryCard filters={filters} />
      </Suspense>

      <Suspense fallback={<ReviewListLoadingFallback />}>
        <ReviewList filters={filters} />
      </Suspense>
    </div>
  );
}
