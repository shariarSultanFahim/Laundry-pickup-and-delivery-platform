import Header from "../components/header";
import OperatorsContent from "./components/operators-content";

export default function Operators() {
  return (
    <div className="space-y-6">
      <Header
        title="Operators Activity Overview"
        subtitle="Real time monitoring of operator status and performance metrics"
      />
      <OperatorsContent />
    </div>
  );
}
