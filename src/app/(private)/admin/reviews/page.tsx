import Header from "../components/header";
import ReviewsContent from "./components/reviews-content";

export default function Reviews() {
  return (
    <div className="space-y-6">
      <Header
        title="Customer Reviews & Feedback"
        subtitle="Monitor and manage customer reviews and feedback"
      />
      <ReviewsContent />
    </div>
  );
}
