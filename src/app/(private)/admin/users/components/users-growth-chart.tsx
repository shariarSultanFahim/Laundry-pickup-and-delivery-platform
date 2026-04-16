"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { UserGrowthChartItem } from "@/types/user-management";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/ui/chart";

const chartConfig = {
  users: {
    label: "Total Users",
    color: "hsl(217, 91%, 60%)"
  }
} satisfies ChartConfig;

interface UsersGrowthChartProps {
  data: UserGrowthChartItem[];
  isLoading: boolean;
}

export default function UsersGrowthChart({ data, isLoading }: UsersGrowthChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="">
          <AreaChart data={data} margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-users)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-users)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="count"
              type="monotone"
              fill="url(#fillUsers)"
              fillOpacity={0.4}
              stroke="var(--color-users)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
        {isLoading ? (
          <p className="mt-2 text-xs text-muted-foreground">Loading chart data...</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
