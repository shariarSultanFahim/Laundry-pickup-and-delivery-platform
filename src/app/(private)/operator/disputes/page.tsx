import Header from "../components/header";
import DisputesContent from "./components/disputes-content";

export default function OperatorDisputesPage() {
  return (
    <div className="space-y-6">
      <Header title="Disputes" subtitle="Manage and resolve customer disputes" />
      <DisputesContent />
    </div>
  );
}
