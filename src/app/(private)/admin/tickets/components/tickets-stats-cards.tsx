"use client";

import { useEffect, useState } from "react";

import type { TicketStats } from "@/types/ticket-management";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

import { fetchTicketStats } from "./tickets-api";

export default function TicketsStatsCards() {
  const [stats, setStats] = useState<TicketStats[]>([]);

  useEffect(() => {
    async function loadStats() {
      const data = await fetchTicketStats();
      setStats(data);
    }

    void loadStats();
  }, []);

  return (
    <div className="gap-4 md:grid-cols-3 grid">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="space-y-0 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="font-medium text-sm">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-4xl">{stat.value}</div>
            <p className="text-muted-foreground text-xs">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
