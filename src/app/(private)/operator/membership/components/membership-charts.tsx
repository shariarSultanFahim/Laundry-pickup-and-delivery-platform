"use client";

import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from "recharts";

import type { MembershipBreakdownData } from "@/types/membership-breakdown";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/ui";

interface MembershipChartsProps {
  data: MembershipBreakdownData;
}

const distributionChartConfig = {
  orders: {
    label: "Orders"
  },
  membershipOrders: {
    label: "Membership Orders",
    color: "#3b82f6"
  },
  nonMembershipOrders: {
    label: "Non-Membership Orders",
    color: "#84cc16"
  }
};

const ordersOverTimeConfig = {
  membershipOrders: {
    label: "Membership Orders",
    color: "#3b82f6"
  },
  nonMembershipOrders: {
    label: "Non-Membership Orders",
    color: "#84cc16"
  }
};

export default function MembershipCharts({ data }: MembershipChartsProps) {
  const distributionData = [
    {
      name: "Membership Orders",
      value: data.membershipOrders,
      fill: "#3b82f6"
    },
    {
      name: "Non-Membership Orders",
      value: data.nonMembershipOrders,
      fill: "#84cc16"
    }
  ];

  return (
    <div className="gap-4 lg:grid-cols-2 grid grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>Order Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={distributionChartConfig}>
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={distributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={0}
              >
                {/* {distributionData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))} */}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orders Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={ordersOverTimeConfig}>
            <BarChart data={data.ordersOverTime} barGap={4}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="membershipOrders"
                fill="var(--color-membershipOrders)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="nonMembershipOrders"
                fill="var(--color-nonMembershipOrders)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
