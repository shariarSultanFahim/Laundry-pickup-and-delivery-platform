"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { UserRoleChartItem } from "@/types/user-management";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/ui/chart";

const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(217, 91%, 60%)"
  }
} satisfies ChartConfig;

interface UsersRoleChartProps {
  data: UserRoleChartItem[];
  isLoading: boolean;
}

export default function UsersRoleChart({ data, isLoading }: UsersRoleChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users by Role</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="">
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-users)" radius={8} />
          </BarChart>
        </ChartContainer>
        {isLoading ? (
          <p className="mt-2 text-xs text-muted-foreground">Loading chart data...</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
