"use client";

import { DollarSign } from "lucide-react";

import { Card, CardContent } from "@/ui/card";

import { EarningsStats } from "../data/earnings";

interface EarningsOverviewProps {
  stats: EarningsStats[];
  netPayout: string;
}

export default function EarningsOverview({ stats, netPayout }: EarningsOverviewProps) {
  return (
    <div className="gap-4 md:grid-cols-4 grid grid-cols-1">
      {/* Stats Cards */}
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md p-0 transition-shadow">
          <CardContent className="p-6">
            <div className="gap-4 flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="mt-2 text-2xl font-bold">{stat.value}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{stat.subtitle}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Net Payout Card */}
      <Card className="bg-slate-900 p-0 text-white border-slate-800 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="gap-4 flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-300">Net Payout</p>
              <h3 className="mt-2 text-2xl font-bold">{netPayout}</h3>
              <p className="mt-1 text-xs text-slate-400">Total available amount</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-slate-200" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
