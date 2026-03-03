import { AlertTriangle, Bookmark, Eye, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/ui";

import { securityStats } from "../data/security";

const iconMap = {
  lock: Lock,
  bookmark: Bookmark,
  "alert-triangle": AlertTriangle,
  eye: Eye
};

export default function SecurityStatsCards() {
  return (
    <div className="gap-4 md:grid-cols-2 lg:grid-cols-4 grid grid-cols-1">
      {securityStats.map((stat) => {
        const IconComponent = iconMap[stat.icon as keyof typeof iconMap];

        return (
          <Card key={stat.id}>
            <CardContent className="">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`size-10 rounded-lg inline-flex items-center justify-center ${stat.iconBgColor}`}
                  >
                    <IconComponent className="size-5" />
                  </div>
                  <Badge variant="outline" className={`text-sm font-medium ${stat.statusColor}`}>
                    {stat.status}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground">{stat.title}</h3>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
