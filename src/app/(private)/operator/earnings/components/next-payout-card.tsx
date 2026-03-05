"use client";

import { Calendar, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

import { NextPayoutInfo } from "../data/earnings";

interface NextPayoutCardProps {
  data: NextPayoutInfo;
}

export default function NextPayoutCard({ data }: NextPayoutCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="gap-2 flex items-center">
          <Wallet className="h-5 w-5" />
          Next Payout
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="gap-8 md:flex-row flex flex-col items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Amount waiting for payout</p>
            <h2 className="mt-2 text-4xl font-bold">{data.nextPayoutAmount}</h2>
          </div>
          <div className="border-muted pl-8 h-20 md:border-l flex flex-col items-start justify-center border-l">
            <p className="text-sm text-muted-foreground">Expected</p>
            <div className="mt-1 gap-2 flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="font-semibold">{data.nextPayoutDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
