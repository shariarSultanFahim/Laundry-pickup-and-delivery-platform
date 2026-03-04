import Header from "../components/header";
import DisputesContent from "./components/disputes-content";

export default function Disputes() {
  return (
    <div className="space-y-6">
      <Header
        title="Central Dispute Management"
        subtitle="Track and resolve customer disputes and complaints"
      />
      <DisputesContent />
    </div>
  );
}
