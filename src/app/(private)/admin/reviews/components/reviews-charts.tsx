"use client";

import { useEffect, useState } from "react";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { RatingTrend, ReviewByRating } from "@/types/review-management";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/ui/chart";

import { fetchRatingTrend, fetchReviewsByRating } from "./reviews-api";

const reviewsByRatingConfig = {
  count: {
    label: "Reviews",
    color: "hsl(217, 91%, 60%)"
  }
} satisfies ChartConfig;

const ratingTrendConfig = {
  rating: {
    label: "Rating",
    color: "hsl(217, 91%, 60%)"
  }
} satisfies ChartConfig;

export function ReviewsByRatingChart() {
  const [data, setData] = useState<ReviewByRating[]>([]);

  useEffect(() => {
    async function loadData() {
      const reviewData = await fetchReviewsByRating();
      setData(reviewData);
    }

    void loadData();
  }, []);

  const chartData = data.map((item) => ({
    stars: `${item.stars} Star${item.stars > 1 ? "s" : ""}`,
    count: item.count
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews by Rating</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={reviewsByRatingConfig}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="stars" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function RatingTrendChart() {
  const [data, setData] = useState<RatingTrend[]>([]);

  useEffect(() => {
    async function loadData() {
      const trendData = await fetchRatingTrend();
      setData(trendData);
    }

    void loadData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Trend Over Time</CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer config={ratingTrendConfig} className="">
          <AreaChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[3.5, 5]} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillRating" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="rating"
              type="monotone"
              fill="url(#fillRating)"
              fillOpacity={0.4}
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
