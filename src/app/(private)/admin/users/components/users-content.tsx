import UsersGrowthChart from "./users-growth-chart";
import UsersRoleChart from "./users-role-chart";
import UsersStatsCards from "./users-stats-cards";
import UsersTable from "./users-table";

export default function UsersContent() {
  return (
    <div className="space-y-6">
      <UsersStatsCards />

      <div className="gap-4 xl:grid-cols-2 grid">
        <UsersRoleChart />
        <UsersGrowthChart />
      </div>

      <UsersTable />
    </div>
  );
}
