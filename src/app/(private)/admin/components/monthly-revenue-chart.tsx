"use client";



import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RevenueChartItem } from "@/types/admin-analytics";

interface MonthlyRevenueChartProps {
  data: RevenueChartItem[];
  filter: string;
  onFilterChange: (filter: string) => void;
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(217, 91%, 60%)"
  }
} satisfies ChartConfig;

export default function MonthlyRevenueChart({ data, filter, onFilterChange }: MonthlyRevenueChartProps) {
  const filters = ["monthly", "weekly", "3", "6", "12"];

  const getFilterLabel = (f: string) => {
    if (f === "3" || f === "6" || f === "12") return `${f} Months`;
    return f.charAt(0).toUpperCase() + f.slice(1);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle>Revenue Chart</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
            Revenue
          </div>
        </div>
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[140px] h-8 bg-muted/50 border-none">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent align="end">
            {filters.map((f) => (
              <SelectItem key={f} value={f}>
                {getFilterLabel(f)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tickFormatter={(value) => value.slice(0, 3)}
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
