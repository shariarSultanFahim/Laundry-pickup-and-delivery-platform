"use client";

import type {
  FetchOperatorReviewsParams,
  FetchOperatorReviewsResponse,
  OperatorReview,
  ReviewSummary
} from "../data/review";

export async function fetchOperatorReviews(
  params: FetchOperatorReviewsParams
): Promise<FetchOperatorReviewsResponse> {
  // Mock implementation - replace with actual API call
  // const response = await post("/reviews", params);
  // return response.data;

  const allReviews: OperatorReview[] = [
    {
      id: "r1",
      customerName: "Sarah Johnson",
      customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 5,
      comment:
        "Excellent service! My clothes came back perfectly clean and folded. The pickup and delivery was right on time. Will definitely use again!",
      orderId: "#LP-2024-0156",
      serviceType: "Wash & Fold",
      createdAt: "2 days ago"
    },
    {
      id: "r2",
      customerName: "Mike Chen",
      customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      rating: 2,
      comment:
        "Delivery was late and one of my shirts came back with a stain that wasn't there before. Customer service was responsive but this shouldn't happen.",
      orderId: "#LP-2024-0142",
      serviceType: "Dry Cleaning",
      createdAt: "1 week ago"
    },
    {
      id: "r3",
      customerName: "Emily Davis",
      customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      rating: 4,
      comment:
        "Great quality cleaning and the app is very easy to use. Only minor issue was the delivery window was a bit wider than expected.",
      orderId: "#LP-2024-0151",
      serviceType: "Express Service",
      createdAt: "3 days ago"
    },
    {
      id: "r4",
      customerName: "James Wilson",
      customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      rating: 5,
      comment:
        "Outstanding service! Everything was handled with care and professionalism. Will be a regular customer.",
      orderId: "#LP-2024-0140",
      serviceType: "Wash & Fold",
      createdAt: "5 days ago"
    },
    {
      id: "r5",
      customerName: "Lisa Anderson",
      customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
      rating: 3,
      comment:
        "Decent service but pricing is a bit high compared to competitors. Quality is good though.",
      orderId: "#LP-2024-0139",
      serviceType: "Dry Cleaning",
      createdAt: "1 week ago"
    },
    {
      id: "r6",
      customerName: "Robert Taylor",
      customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      rating: 5,
      comment: "Perfect! This is exactly what I needed. The convenience and quality are unmatched.",
      orderId: "#LP-2024-0138",
      serviceType: "Express Service",
      createdAt: "2 weeks ago"
    },
    {
      id: "r7",
      customerName: "Jennifer Brown",
      customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
      rating: 5,
      comment: "Amazing service from start to finish. Highly recommend to everyone!",
      orderId: "#LP-2024-0137",
      serviceType: "Wash & Fold",
      createdAt: "2 weeks ago"
    },
    {
      id: "r8",
      customerName: "David Martinez",
      customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      rating: 4,
      comment: "Good service overall. A few small things could be improved but overall satisfied.",
      orderId: "#LP-2024-0136",
      serviceType: "Ironing",
      createdAt: "2 weeks ago"
    },
    {
      id: "r9",
      customerName: "Michelle Lee",
      customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michelle",
      rating: 5,
      comment: "Fantastic! Will definitely come back for more. Great attention to detail.",
      orderId: "#LP-2024-0135",
      serviceType: "Dry Cleaning",
      createdAt: "3 weeks ago"
    },
    {
      id: "r10",
      customerName: "Thomas Anderson",
      customerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
      rating: 1,
      comment:
        "Very disappointed. Items were damaged during cleaning and handling was unprofessional.",
      orderId: "#LP-2024-0134",
      serviceType: "Wash & Fold",
      createdAt: "3 weeks ago"
    }
  ];

  // Apply filters
  let filteredReviews = [...allReviews];

  if (params.rating) {
    const minRating = parseInt(params.rating, 10);
    filteredReviews = filteredReviews.filter((r) => r.rating >= minRating);
  }

  if (params.serviceType) {
    filteredReviews = filteredReviews.filter((r) => r.serviceType === params.serviceType);
  }

  // Apply sorting
  switch (params.sortBy) {
    case "highest":
      filteredReviews.sort((a, b) => b.rating - a.rating);
      break;
    case "lowest":
      filteredReviews.sort((a, b) => a.rating - b.rating);
      break;
    case "oldest":
      filteredReviews.reverse();
      break;
    case "newest":
    default:
      // Already sorted by newest
      break;
  }

  // Calculate pagination
  const total = filteredReviews.length;
  const totalPages = Math.ceil(total / params.pageSize);
  const startIndex = (params.page - 1) * params.pageSize;
  const endIndex = startIndex + params.pageSize;
  const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

  // Calculate summary
  const summary = fetchReviewSummary(filteredReviews);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    items: paginatedReviews,
    page: params.page,
    pageSize: params.pageSize,
    total,
    totalPages,
    summary
  };
}

export function fetchReviewSummary(reviews: OperatorReview[]): ReviewSummary {
  const totalReviews = reviews.length;

  if (totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: [
        { stars: 5, count: 0 },
        { stars: 4, count: 0 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 }
      ]
    };
  }

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length
  }));

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = parseFloat((totalRating / totalReviews).toFixed(1));

  return {
    averageRating,
    totalReviews,
    ratingDistribution
  };
}
