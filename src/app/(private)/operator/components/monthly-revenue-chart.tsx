"use client";

import { useState } from "react";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";

import { MonthlyRevenueData } from "../(dashboard)/data/dashboard";

interface MonthlyRevenueChartProps {
  data: MonthlyRevenueData[];
}

type TimePeriod = "3M" | "6M" | "12M";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(217, 91%, 60%)"
  }
} satisfies ChartConfig;

export default function MonthlyRevenueChart({ data }: MonthlyRevenueChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("12M");

  const getFilteredData = () => {
    const periods = {
      "3M": 3,
      "6M": 6,
      "12M": 12
    };
    return data.slice(-periods[selectedPeriod]);
  };

  const filteredData = getFilteredData();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Monthly Revenue</CardTitle>
          <div className="gap-2 flex">
            {(["12M", "6M", "3M"] as TimePeriod[]).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="h-8 px-3 text-xs"
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="lg:h-70 lg:w-full">
          <AreaChart
            data={filteredData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
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
