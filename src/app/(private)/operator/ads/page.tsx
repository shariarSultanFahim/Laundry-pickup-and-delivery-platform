import Header from "../components/header";
import AdsContent from "./components/ads-content";

export default function OperatorAdsPage() {
  return (
    <div className="space-y-6">
      <Header
        title="Ad Campaigns"
        subtitle="Subscribe to plans, promote services, and manage active ads"
      />
      <AdsContent />
    </div>
  );
}
