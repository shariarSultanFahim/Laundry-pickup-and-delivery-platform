import OperatorsStatsCards from "./operators-stats-cards";
import OperatorsTable from "./operators-table";

export default function OperatorsContent() {
  return (
    <div className="space-y-6">
      <OperatorsStatsCards />
      <OperatorsTable />
    </div>
  );
}
