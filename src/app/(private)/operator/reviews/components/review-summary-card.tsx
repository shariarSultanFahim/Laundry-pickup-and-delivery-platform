"use client";

import { useEffect, useState } from "react";

import { Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

import type { ReviewSummary } from "../data/review";
import type { OperatorReviewFilters } from "../schema/review-filters.schema";
import { fetchOperatorReviews } from "./review-api";

interface ReviewSummaryCardProps {
  filters: OperatorReviewFilters;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="gap-1 flex items-center justify-center">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-5 w-5 ${
            index < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-300 text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function RatingBar({ stars, count, maxCount }: { stars: number; count: number; maxCount: number }) {
  const percentage = maxCount === 0 ? 0 : (count / maxCount) * 100;

  const starColors: Record<number, string> = {
    5: "bg-green-500",
    4: "bg-yellow-400",
    3: "bg-yellow-300",
    2: "bg-orange-400",
    1: "bg-red-500"
  };

  return (
    <div className="gap-3 flex items-center">
      <span className="w-8 gap-1 text-sm font-medium flex items-center">
        {stars}
        <Star className="h-3.5 w-3.5 fill-current" />
      </span>
      <div className="h-2 bg-gray-200 flex-1 overflow-hidden rounded-full">
        <div
          className={`h-full ${starColors[stars]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-12 text-sm text-muted-foreground text-right">{count}</span>
    </div>
  );
}

export default function ReviewSummaryCard({ filters }: ReviewSummaryCardProps) {
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      setIsLoading(true);
      const response = await fetchOperatorReviews({
        page: 1,
        pageSize: 1,
        rating: filters.rating,
        serviceType: filters.serviceType,
        sortBy: filters.sortBy
      });

      if (!isMounted) return;

      setSummary(response.summary);
      setIsLoading(false);
    }

    void loadSummary();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  if (isLoading || !summary) {
    return null;
  }

  const maxCount = Math.max(...summary.ratingDistribution.map((r) => r.count));

  return (
    <div className="gap-6 md:grid-cols-2 grid grid-cols-1">
      {/* Average Rating Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Your Rating</CardTitle>
        </CardHeader>
        <CardContent className="gap-4 flex flex-col items-center justify-center">
          <p className="text-5xl font-bold">{summary.averageRating}</p>
          <StarRating rating={summary.averageRating} />
          <p className="text-sm text-muted-foreground text-center">
            Based on {summary.totalReviews.toLocaleString()} review
            {summary.totalReviews !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      {/* Rating Distribution Card */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...summary.ratingDistribution].reverse().map((distribution) => (
              <RatingBar
                key={distribution.stars}
                stars={distribution.stars}
                count={distribution.count}
                maxCount={maxCount}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
