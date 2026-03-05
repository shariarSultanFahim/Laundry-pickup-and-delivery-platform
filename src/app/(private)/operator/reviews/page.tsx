import Header from "../components/header";
import ReviewsContent from "./components/reviews-content";

export default function OperatorReviewsPage() {
  return (
    <div className="space-y-6">
      <Header title="Reviews & Ratings" subtitle="Monitor customer feedback and service quality" />
      <ReviewsContent />
    </div>
  );
}
