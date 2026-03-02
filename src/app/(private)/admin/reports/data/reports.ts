import { ChartArea, Check, ShoppingCart } from "lucide-react";

export interface StatsCardData {
  id: string;
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down";
    period: string;
  };
  icon: typeof ShoppingCart;
  iconBgColor: string;
  iconColor: string;
}

export const statsData: StatsCardData[] = [
  {
    id: "success-rate",
    title: "Success Rate",
    value: "98.7%",
    change: {
      value: "+8.2%",
      trend: "up",
      period: "from last month"
    },
    icon: Check,
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    id: "avg-order-value",
    title: "Avg. Order Value",
    value: "$65.94",
    change: {
      value: "+4.1%",
      trend: "up",
      period: "from last month"
    },
    icon: ChartArea,
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600"
  }
];

export const orderVolumeData = [
  {
    month: "Jan",
    orders: 900
  },
  {
    month: "Feb",
    orders: 750
  },
  {
    month: "Mar",
    orders: 1050
  },
  {
    month: "Apr",
    orders: 1200
  },
  {
    month: "May",
    orders: 1175
  },
  {
    month: "Jun",
    orders: 1400
  },
  {
    month: "Jul",
    orders: 1350
  },
  {
    month: "Aug",
    orders: 1500
  },
  {
    month: "Sep",
    orders: 1475
  },
  {
    month: "Oct",
    orders: 1600
  },
  {
    month: "Nov",
    orders: 1700
  },
  {
    month: "Dec",
    orders: 1650
  }
];

export const paymentSuccessData = [
  {
    name: "Successful",
    value: 87,
    fill: "#10b981"
  },
  {
    name: "Failed",
    value: 10,
    fill: "#ef4444"
  },
  {
    name: "Pending",
    value: 3,
    fill: "#f59e0b"
  }
];

export const operatorPerformanceData = [
  {
    id: "john-smith",
    name: "John Smith",
    role: "Senior Operator",
    revenue: "$142,500",
    growth: "+15.2%"
  },
  {
    id: "sarah-wilson",
    name: "Sarah Wilson",
    role: "Lead Operator",
    revenue: "$138,750",
    growth: "+12.8%"
  },
  {
    id: "mike-johnson",
    name: "Mike Johnson",
    role: "Operator",
    revenue: "$125,300",
    growth: "+9.8%"
  }
];
