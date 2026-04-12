"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { OperatorRevenueChartItem } from "@/types/operator-analytics";

import type { RevenueFilter } from "@/lib/actions/operator/use-operator-dashboard";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";

interface MonthlyRevenueChartProps {
  data: OperatorRevenueChartItem[];
  selectedPeriod: RevenueFilter;
  onPeriodChange: (period: RevenueFilter) => void;
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(217, 91%, 60%)"
  }
} satisfies ChartConfig;

export default function MonthlyRevenueChart({
  data,
  selectedPeriod,
  onPeriodChange
}: MonthlyRevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Monthly Revenue</CardTitle>
          <div className="gap-2 flex">
            {[12, 6, 3].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => onPeriodChange(period as RevenueFilter)}
                className="h-8 px-3 text-xs"
              >
                {`${period}M`}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="lg:h-70 lg:w-full">
          <AreaChart
            data={data}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.split(" ")[0]}
            />
            <YAxis dataKey="revenue" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="revenue"
              type="monotone"
              fill="url(#fillRevenue)"
              fillOpacity={0.4}
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
