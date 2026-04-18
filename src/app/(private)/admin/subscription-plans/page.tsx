import Header from "../components/header";
import SubscriptionPlansContent from "./components/subscription-plans-content";

export default function SubscriptionPlansPage() {
  return (
    <div className="space-y-6">
      <Header
        title="Subscription Plans"
        subtitle="Create and manage ad subscription plans for operators"
      />
      <SubscriptionPlansContent />
    </div>
  );
}
