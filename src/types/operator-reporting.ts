export type TrendDirection = "up" | "down";

export interface OperatorReportingSummaryMetric {
  value: number;
  trend: number;
  direction: TrendDirection;
}

export interface OperatorReportingStatsData {
  totalOrders: OperatorReportingSummaryMetric;
  completedOrders: OperatorReportingSummaryMetric;
  pendingOrders: OperatorReportingSummaryMetric;
  delayedOrders: OperatorReportingSummaryMetric;
}

export interface OperatorReportingStatsResponse {
  success: boolean;
  data: OperatorReportingStatsData;
}

export interface OperatorReportingWeeklyChartItem {
  day: string;
  count: number;
}

export interface OperatorReportingWeeklyChartResponse {
  success: boolean;
  data: OperatorReportingWeeklyChartItem[];
}

export interface OperatorReportingStatusDistributionItem {
  label: string;
  value: number;
  percentage: number;
}

export interface OperatorReportingStatusDistributionResponse {
  success: boolean;
  data: OperatorReportingStatusDistributionItem[];
}

export interface OperatorReportingPerformanceMetric {
  value: number;
  label: string;
  subtext: string;
}

export interface OperatorReportingRevenueImpactMetric extends OperatorReportingPerformanceMetric {
  trend: number;
  direction: TrendDirection;
}

export interface OperatorReportingPerformanceSummaryData {
  efficiencyRate: OperatorReportingPerformanceMetric;
  customerSatisfaction: OperatorReportingPerformanceMetric;
  revenueImpact: OperatorReportingRevenueImpactMetric;
}

export interface OperatorReportingPerformanceSummaryResponse {
  success: boolean;
  data: OperatorReportingPerformanceSummaryData;
}
