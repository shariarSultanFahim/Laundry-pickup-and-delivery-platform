import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { TopOperatorData } from "../../admin/(dashboard)/data/dashboard";

interface TopOperatorsProps {
  data: TopOperatorData[];
}

export default function TopOperators({ data }: TopOperatorsProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Operators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((operator, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="gap-3 flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={operator.avatar} alt={operator.name} />
                  <AvatarFallback>{getInitials(operator.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{operator.name}</p>
                  <p className="text-xs text-muted-foreground">{operator.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{operator.successRate}</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
