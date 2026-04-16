"use client";

import {
  useGetUserGrowthChart,
  useGetUserRolesChart,
  useGetUserStats
} from "@/lib/actions/admin/use-user-analytics";

import UsersGrowthChart from "./users-growth-chart";
import UsersRoleChart from "./users-role-chart";
import UsersStatsCards from "./users-stats-cards";
import UsersTable from "./users-table";

export default function UsersContent() {
  const { data: statsData, isLoading: isStatsLoading } = useGetUserStats();
  const { data: rolesData, isLoading: isRolesLoading } = useGetUserRolesChart();
  const { data: growthData, isLoading: isGrowthLoading } = useGetUserGrowthChart();

  return (
    <div className="space-y-6">
      <UsersStatsCards data={statsData?.data} isLoading={isStatsLoading} />

      <div className="gap-4 xl:grid-cols-2 grid">
        <UsersRoleChart data={rolesData?.data ?? []} isLoading={isRolesLoading} />
        <UsersGrowthChart data={growthData?.data ?? []} isLoading={isGrowthLoading} />
      </div>

      <UsersTable />
    </div>
  );
}
