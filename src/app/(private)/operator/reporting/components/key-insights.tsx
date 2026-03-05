"use client";

import { AlertCircle, CheckCircle2, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";

import { KeyInsight } from "../data/reporting";

interface KeyInsightsProps {
  insights: KeyInsight[];
}

const iconMap: Record<string, LucideIcon> = {
  CheckCircle2,
  AlertCircle
};

export default function KeyInsights({ insights }: KeyInsightsProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Key Insights</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Performance highlights and recommendations
      </p>
      <div className="gap-4 lg:grid-cols-2 grid grid-cols-1">
        {insights.map((insight, index) => (
          <InsightCard key={index} insight={insight} />
        ))}
      </div>
    </div>
  );
}

interface InsightCardProps {
  insight: KeyInsight;
}

function InsightCard({ insight }: InsightCardProps) {
  const Icon = iconMap[insight.iconName];
  const isSuccess = insight.type === "success";

  return (
    <Card
      className={cn(
        "hover:shadow-md overflow-hidden border-l-4 transition-shadow",
        isSuccess ? "border-l-green-500 bg-green-50" : "border-l-yellow-500 bg-yellow-50"
      )}
    >
      <CardContent>
        <div className="gap-4 py-4 flex">
          <div
            className={cn(
              "h-10 w-10 rounded-lg flex shrink-0 items-center justify-center",
              isSuccess ? "bg-green-100" : "bg-yellow-100"
            )}
          >
            <Icon className={cn("h-5 w-5", isSuccess ? "text-green-600" : "text-yellow-600")} />
          </div>
          <div>
            <p className={cn("font-semibold", isSuccess ? "text-green-900" : "text-yellow-900")}>
              {insight.title}
            </p>
            <p className={cn("text-sm mt-1", isSuccess ? "text-green-800" : "text-yellow-800")}>
              {insight.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
