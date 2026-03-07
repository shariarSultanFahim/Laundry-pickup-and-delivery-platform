import { Crown, UserRound } from "lucide-react";

import type { MembershipBreakdownData } from "@/types/membership-breakdown";

import { Card, CardContent } from "@/ui/card";

interface MembershipStatsCardsProps {
  data: MembershipBreakdownData;
}

function ChangeText({ value }: { value: number }) {
  const prefix = value > 0 ? "+" : "";
  return (
    <p className="mt-1 text-xs text-emerald-600">
      {prefix}
      {value}% vs last month
    </p>
  );
}

export default function MembershipStatsCards({ data }: MembershipStatsCardsProps) {
  return (
    <div className="gap-4 md:grid-cols-2 grid grid-cols-1">
      <Card className="p-0">
        <CardContent className="p-6">
          <div className="gap-4 flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Membership Orders</p>
              <p className="mt-1 text-4xl font-semibold text-blue-500">{data.membershipOrders}</p>
              <ChangeText value={data.membershipGrowthPercent} />
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Crown className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-0">
        <CardContent className="p-6">
          <div className="gap-4 flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Non-Membership Orders</p>
              <p className="mt-1 text-4xl font-semibold text-lime-600">
                {data.nonMembershipOrders}
              </p>
              <ChangeText value={data.nonMembershipGrowthPercent} />
            </div>
            <div className="h-10 w-10 rounded-lg bg-lime-100 flex items-center justify-center">
              <UserRound className="h-5 w-5 text-lime-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
