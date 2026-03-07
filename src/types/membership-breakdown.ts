export interface MembershipDateFilter {
  fromDate: string;
  toDate: string;
}

export interface MembershipOrdersTrendItem {
  label: string;
  membershipOrders: number;
  nonMembershipOrders: number;
}

export interface MembershipDistributionItem {
  name: "Membership Orders" | "Non-Membership Orders";
  orders: number;
  fill: string;
}

export interface MembershipSummaryRow {
  orderType: "Membership Orders" | "Non-Membership Orders";
  totalOrders: number;
  percentage: number;
  revenue: number;
  averageOrderValue: number;
  colorClassName: string;
}

export interface MembershipSummaryTotals {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface MembershipBreakdownData {
  membershipOrders: number;
  nonMembershipOrders: number;
  membershipGrowthPercent: number;
  nonMembershipGrowthPercent: number;
  distribution: MembershipDistributionItem[];
  ordersOverTime: MembershipOrdersTrendItem[];
  summaryRows: MembershipSummaryRow[];
  summaryTotals: MembershipSummaryTotals;
}

export interface FetchMembershipBreakdownParams {
  filter: MembershipDateFilter;
}
