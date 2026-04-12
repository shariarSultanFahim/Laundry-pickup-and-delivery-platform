"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Dot, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface OrdersChartProps {
  data: { day: string; orders: number }[];
  period: string;
  onPeriodChange: (period: string) => void;
}

const chartConfig = {
  orders: {
    label: "Orders",
    color: "hsl(206, 100%, 80%)"
  }
} satisfies ChartConfig;

export default function OrdersChart({ data, period, onPeriodChange }: OrdersChartProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Order Volume</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 px-3 text-xs capitalize">
                {period}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onPeriodChange("weekly")}>Weekly</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPeriodChange("monthly")}>Monthly</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPeriodChange("yearly")}>Yearly</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis dataKey="orders" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <defs>
              <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-orders)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-orders)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="orders"
              type="natural"
              fill="url(#fillOrders)"
              fillOpacity={0.4}
              stroke="var(--color-orders)"
              strokeWidth={2}
              dot={({ cx, cy, index }: any) => (
                <Dot
                  key={`dot-${index}`}
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill="var(--color-orders)"
                  stroke="white"
                  strokeWidth={2}
                />
              )}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
