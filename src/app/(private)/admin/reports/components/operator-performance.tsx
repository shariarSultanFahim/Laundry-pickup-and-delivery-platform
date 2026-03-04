"use client";

import { ArrowUpRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Operator {
  id: string;
  name: string;
  role: string;
  revenue: string;
  growth: string;
  avatar: string;
}

interface OperatorPerformanceProps {
  data: Operator[];
}

export function OperatorPerformance({ data }: OperatorPerformanceProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Operator Performance</CardTitle>
        <Button variant="ghost" size="sm" className="text-xs">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((operator) => (
            <div
              key={operator.id}
              className="rounded-lg p-3 bg-muted flex items-center justify-between transition-colors"
            >
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
                <p className="text-sm font-semibold">{operator.revenue}</p>
                <p className="gap-1 text-xs text-green-600 flex items-center justify-end">
                  <ArrowUpRight className="h-3 w-3" />
                  {operator.growth}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
