"use client";

import { Package, Shirt, Trophy, Wrench } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { TopSellingService } from "../data/dashboard";

interface TopSellingServicesProps {
  data: TopSellingService[];
}

const iconMap = {
  "wash-fold": Package,
  "dry-cleaning": Shirt,
  ironing: Wrench
};

export default function TopSellingServices({ data }: TopSellingServicesProps) {
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
            const Icon = iconMap[service.iconName];
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="gap-2 flex items-center">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${service.color}20` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: service.color }} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-muted-foreground text-xs">{service.orders} orders</p>
                    </div>
                  </div>
                  <span className="font-semibold text-sm">{service.percentage}%</span>
                </div>
                <div className="h-2 bg-muted overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${service.percentage}%`,
                      backgroundColor: service.color
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
