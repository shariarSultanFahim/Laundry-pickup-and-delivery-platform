"use client";

import { Cell, Legend, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";

import { OrderStatusData } from "../reporting/data/reporting";

interface OrderStatusChartProps {
  data: OrderStatusData[];
}

export default function OrderStatusChart({ data }: OrderStatusChartProps) {
  const chartConfig = data.reduce((acc, item) => {
    acc[item.status.toLowerCase().replace(" ", "-")] = {
      label: item.status,
      color: item.color
    };
    return acc;
  }, {} as ChartConfig);

  const chartData = data.map((item) => ({
    name: item.status,
    value: item.value,
    fill: item.color
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-70 mx-auto aspect-square">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={30}
              outerRadius={70}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend
              content={({ payload }) => {
                return (
                  <div className="mt-6 gap-3 flex flex-col">
                    {payload?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="gap-2 flex items-center">
                          <div
                            className="h-3 w-3 rounded-sm"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-muted-foreground">{item.value}</span>
                        </div>
                        <span className="text-sm font-medium">
                          {data.find((d) => d.status === item.value)?.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
