"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentSuccessData {
  name: string;
  value: number;
  fill: string;
}

interface PaymentSuccessRateChartProps {
  data: PaymentSuccessData[];
}

export function PaymentSuccessRateChart({ data }: PaymentSuccessRateChartProps) {
  const successRate = data.find((item) => item.name === "Successful")?.value || 0;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle>Payment Success Rate</CardTitle>
          <span className="text-2xl font-bold text-green-600">{successRate}%</span>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
