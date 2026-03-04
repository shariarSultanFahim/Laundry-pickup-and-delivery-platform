import { lazy, Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

const ReviewsStatsCards = lazy(() => import("./reviews-stats-cards"));
const ReviewsByRatingChart = lazy(async () => {
  const loadedModule = await import("./reviews-charts");
  return { default: loadedModule.ReviewsByRatingChart };
});
const RatingTrendChart = lazy(async () => {
  const loadedModule = await import("./reviews-charts");
  return { default: loadedModule.RatingTrendChart };
});

const ReviewsTable = lazy(() => import("./reviews-table"));
const OperatorRankingsTable = lazy(() => import("./operator-rankings-table"));

function TableLoadingFallback({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-24 text-muted-foreground flex items-center justify-center">
          Loading table...
        </div>
      </CardContent>
    </Card>
  );
}

function ChartLoadingFallback({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-75 text-muted-foreground flex items-center justify-center">
          Loading chart...
        </div>
      </CardContent>
    </Card>
  );
}

function StatsLoadingFallback() {
  return (
    <div className="gap-4 md:grid-cols-2 lg:grid-cols-4 grid">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardContent>
            <div className="h-24 text-muted-foreground flex items-center justify-center">
              Loading stats...
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ReviewsContent() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<StatsLoadingFallback />}>
        <ReviewsStatsCards />
      </Suspense>

      <div className="gap-6 md:grid-cols-2 grid">
        <Suspense fallback={<ChartLoadingFallback title="Reviews by Rating" />}>
          <ReviewsByRatingChart />
        </Suspense>

        <Suspense fallback={<ChartLoadingFallback title="Rating Trend Over Time" />}>
          <RatingTrendChart />
        </Suspense>
      </div>

      <Suspense fallback={<TableLoadingFallback title="Recent Reviews" />}>
        <ReviewsTable />
      </Suspense>

      <Suspense fallback={<TableLoadingFallback title="Top 10 Operators by Rating" />}>
        <OperatorRankingsTable />
      </Suspense>
    </div>
  );
}
