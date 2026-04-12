"use client";

import { Package, Shirt, Trophy, Wrench } from "lucide-react";

import type { OperatorTopService } from "@/types/operator-analytics";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopSellingServicesProps {
  data: OperatorTopService[];
}

const iconMap = [Package, Shirt, Wrench];
const colorPalette = ["#3b82f6", "#22c55e", "#f59e0b"];

export default function TopSellingServices({ data }: TopSellingServicesProps) {
  const maxOrders = Math.max(...data.map((service) => service.totalOrders), 1);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Top Selling Services</CardTitle>
          <Trophy className="h-5 w-5 text-yellow-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((service, index) => {
            const Icon = iconMap[index % iconMap.length] ?? Package;
            const color = colorPalette[index % colorPalette.length] ?? "#3b82f6";
            const percentage = Math.max(1, Math.round((service.totalOrders / maxOrders) * 100));

            return (
              <div key={service.serviceId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="gap-2 flex items-center">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Icon className="h-4 w-4" style={{ color }} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{service.serviceName}</p>
                      <p className="text-muted-foreground text-xs">{service.totalOrders} orders</p>
                    </div>
                  </div>
                  <span className="font-semibold text-sm">{percentage}%</span>
                </div>
                <div className="h-2 bg-muted overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
