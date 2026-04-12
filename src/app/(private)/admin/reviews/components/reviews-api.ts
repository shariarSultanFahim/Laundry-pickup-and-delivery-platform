import type {
  FetchReviewsParams,
  FetchReviewsResponse,
  GetReviewsResponse,
  OperatorRanking,
  RatingTrend,
  ReviewByRating,
  ReviewStats
} from "@/types/review-management";

import { api } from "@/lib/api";

export async function fetchReviews(params: FetchReviewsParams): Promise<FetchReviewsResponse> {
  const searchParams = new URLSearchParams();
  searchParams.append("page", params.page.toString());
  searchParams.append("limit", params.pageSize.toString());

  if (params.search) {
    searchParams.append("searchTerm", params.search);
  }

  const { data } = await api.get<GetReviewsResponse>(`/review?${searchParams.toString()}`);

  return {
    items: data.data,
    page: data.meta.page,
    pageSize: data.meta.limit,
    total: data.meta.total,
    totalPages: data.meta.totalPage
  };
}

export async function fetchReviewStats(): Promise<ReviewStats[]> {
  return [
    {
      title: "Overall Rating",
      value: "4.6",
      subtitle: "out of 5.0",
      icon: "star"
    },
    {
      title: "Total Reviews",
      value: "2,847",
      subtitle: "75.7%",
      icon: "reviews"
    },
    {
      title: "Positive Reviews",
      value: "2,156",
      subtitle: "4+ stars",
      icon: "thumbs-up"
    },
    {
      title: "Negative Reviews",
      value: "284",
      subtitle: "1-2 stars",
      icon: "thumbs-down"
    }
  ];
}

export async function fetchReviewsByRating(): Promise<ReviewByRating[]> {
  return [
    { stars: 5, count: 1500 },
    { stars: 4, count: 656 },
    { stars: 3, count: 400 },
    { stars: 2, count: 191 },
    { stars: 1, count: 100 }
  ];
}

export async function fetchRatingTrend(): Promise<RatingTrend[]> {
  return [
    { date: "Dec 1", rating: 4.2 },
    { date: "Dec 3", rating: 4.3 },
    { date: "Dec 5", rating: 4.4 },
    { date: "Dec 7", rating: 5.0 },
    { date: "Dec 9", rating: 4.6 },
    { date: "Dec 11", rating: 4.5 },
    { date: "Dec 13", rating: 4.6 },
    { date: "Dec 15", rating: 4.6 }
  ];
}

export async function fetchOperatorRankings(): Promise<OperatorRanking[]> {
  return [
    {
      rank: 1,
      operatorName: "Mike's Laundry",
      operatorId: "OP001",
      averageRating: 4.9,
      totalReviews: 542,
      positiveReviews: 520,
      negativeReviews: 22
    },
    {
      rank: 2,
      operatorName: "Fresh Clean Co",
      operatorId: "OP002",
      averageRating: 4.8,
      totalReviews: 489,
      positiveReviews: 465,
      negativeReviews: 24
    },
    {
      rank: 3,
      operatorName: "QuickWash Pro",
      operatorId: "OP003",
      averageRating: 4.7,
      totalReviews: 412,
      positiveReviews: 385,
      negativeReviews: 27
    },
    {
      rank: 4,
      operatorName: "Express Laundry",
      operatorId: "OP004",
      averageRating: 4.6,
      totalReviews: 378,
      positiveReviews: 350,
      negativeReviews: 28
    },
    {
      rank: 5,
      operatorName: "Premium Wash",
      operatorId: "OP005",
      averageRating: 4.5,
      totalReviews: 345,
      positiveReviews: 315,
      negativeReviews: 30
    },
    {
      rank: 6,
      operatorName: "Sparkle Clean",
      operatorId: "OP006",
      averageRating: 4.4,
      totalReviews: 298,
      positiveReviews: 270,
      negativeReviews: 28
    },
    {
      rank: 7,
      operatorName: "Elite Laundry Service",
      operatorId: "OP007",
      averageRating: 4.3,
      totalReviews: 267,
      positiveReviews: 240,
      negativeReviews: 27
    },
    {
      rank: 8,
      operatorName: "Clean & Fresh",
      operatorId: "OP008",
      averageRating: 4.2,
      totalReviews: 231,
      positiveReviews: 205,
      negativeReviews: 26
    },
    {
      rank: 9,
      operatorName: "Super Wash",
      operatorId: "OP009",
      averageRating: 4.1,
      totalReviews: 198,
      positiveReviews: 175,
      negativeReviews: 23
    },
    {
      rank: 10,
      operatorName: "City Laundry",
      operatorId: "OP010",
      averageRating: 4.0,
      totalReviews: 187,
      positiveReviews: 165,
      negativeReviews: 22
    }
  ];
}
