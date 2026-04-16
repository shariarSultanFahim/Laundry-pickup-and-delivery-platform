"use client";

import { MessageSquare, Star, ThumbsDown, ThumbsUp } from "lucide-react";

import type { ReviewStats } from "@/types/review-management";

import { useGetAdminReviewStats } from "@/lib/actions/reviews/use-admin-reviews";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

function getIcon(iconName: ReviewStats["icon"]) {
  switch (iconName) {
    case "star":
      return <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
    case "reviews":
      return <MessageSquare className="h-4 w-4 text-blue-600" />;
    case "thumbs-up":
      return <ThumbsUp className="h-4 w-4 text-green-600" />;
    case "thumbs-down":
      return <ThumbsDown className="h-4 w-4 text-red-600" />;
  }
}

export default function ReviewsStatsCards() {
  const { data, isLoading } = useGetAdminReviewStats();

  const stats: ReviewStats[] = [
    {
      title: "Overall Rating",
      value: data?.data.overallRating.toFixed(1) ?? "0.0",
      subtitle: "out of 5.0",
      icon: "star"
    },
    {
      title: "Total Reviews",
      value: data?.data.totalReviews.toLocaleString() ?? "0",
      subtitle: "all ratings",
      icon: "reviews"
    },
    {
      title: "Positive Reviews",
      value: data?.data.positiveReviews.toLocaleString() ?? "0",
      subtitle: "4+ stars",
      icon: "thumbs-up"
    },
    {
      title: "Negative Reviews",
      value: data?.data.negativeReviews.toLocaleString() ?? "0",
      subtitle: "1-2 stars",
      icon: "thumbs-down"
    }
  ];

  if (isLoading) {
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

  return (
    <div className="gap-4 md:grid-cols-2 lg:grid-cols-4 grid">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="space-y-0 flex flex-row items-center justify-between">
            <CardTitle className="font-medium text-sm">{stat.title}</CardTitle>
            {getIcon(stat.icon)}
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stat.value}</div>
            <p className="text-muted-foreground text-xs">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
