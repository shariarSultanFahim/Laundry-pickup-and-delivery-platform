import { AlertTriangle, TrendingDown, TrendingUp, UserPlus, Users } from "lucide-react";

import { Card, CardContent } from "@/ui/card";

import { userStatsData } from "../data/users";

const statsIconMap = {
  "Total Users": Users,
  "Active Users": TrendingUp,
  "New This Month": UserPlus,
  "Suspended Users": AlertTriangle
};

export default function UsersStatsCards() {
  return (
    <div className="gap-4 md:grid-cols-2 xl:grid-cols-4 grid">
      {userStatsData.map((stat) => {
        const Icon = statsIconMap[stat.title as keyof typeof statsIconMap] ?? Users;

        return (
          <Card key={stat.title}>
            <CardContent className="">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
                  <div className="mt-1 gap-1 text-xs text-muted-foreground flex items-center">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                    )}
                    <span>{stat.subtitle}</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
