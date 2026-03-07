import Header from "../components/header";
import OperationalControlsContent from "./components/operational-controls-content";

export default function OperatorOperationalControlsPage() {
  return (
    <div className="space-y-6">
      <Header title="Operational Controls" subtitle="Manage operational settings and controls" />
      <OperationalControlsContent />
    </div>
  );
}
