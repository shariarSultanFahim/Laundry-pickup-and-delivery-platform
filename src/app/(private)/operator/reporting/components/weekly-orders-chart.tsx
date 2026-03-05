"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";

import { WeeklyOrdersData } from "../data/reporting";

interface WeeklyOrdersChartProps {
  data: WeeklyOrdersData[];
}

const chartConfig = {
  orders: {
    label: "Orders",
    color: "hsl(206, 100%, 80%)"
  }
} satisfies ChartConfig;

export default function WeeklyOrdersChart({ data }: WeeklyOrdersChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="lg:h-70 lg:w-full">
          <BarChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="orders"
              fill="var(--color-orders)"
              radius={[8, 8, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
