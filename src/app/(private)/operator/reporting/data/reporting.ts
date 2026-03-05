import { AlertCircle, CheckCircle2, Clock, ShoppingCart } from "lucide-react";

export interface StatsCardData {
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

export interface WeeklyOrdersData {
  day: string;
  orders: number;
}

export interface OrderStatusData {
  status: string;
  value: number;
  color: string;
}

export interface PerformanceMetric {
  title: string;
  value: string;
  subtitle: string;
  iconName: "ShoppingCart" | "CheckCircle2" | "DollarSign";
  iconBgColor: string;
  iconColor: string;
}

export interface KeyInsight {
  type: "success" | "warning";
  title: string;
  description: string;
  iconName: "CheckCircle2" | "AlertCircle";
}

export const reportingStats: StatsCardData[] = [
  {
    title: "Total Orders",
    value: "2,847",
    change: {
      value: "+12.5%",
      trend: "up",
      period: "from last week"
    },
    icon: ShoppingCart,
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    title: "Completed",
    value: "2,134",
    change: {
      value: "+3.2%",
      trend: "up",
      period: "from last week"
    },
    icon: CheckCircle2,
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    title: "Pending",
    value: "542",
    change: {
      value: "-2.1%",
      trend: "down",
      period: "from last week"
    },
    icon: Clock,
    iconBgColor: "bg-yellow-100",
    iconColor: "text-yellow-600"
  },
  {
    title: "Delayed",
    value: "171",
    change: {
      value: "-15.3%",
      trend: "down",
      period: "from last week"
    },
    icon: AlertCircle,
    iconBgColor: "bg-red-100",
    iconColor: "text-red-600"
  }
];

export const weeklyOrdersData: WeeklyOrdersData[] = [
  {
    day: "Mon",
    orders: 400
  },
  {
    day: "Tue",
    orders: 420
  },
  {
    day: "Wed",
    orders: 340
  },
  {
    day: "Thu",
    orders: 450
  },
  {
    day: "Fri",
    orders: 380
  },
  {
    day: "Sat",
    orders: 300
  },
  {
    day: "Sun",
    orders: 500
  }
];

export const orderStatusDistribution: OrderStatusData[] = [
  {
    status: "Completed",
    value: 75,
    color: "hsl(142, 71%, 45%)"
  },
  {
    status: "Pending",
    value: 19,
    color: "hsl(38, 92%, 50%)"
  },
  {
    status: "Delayed",
    value: 6,
    color: "hsl(0, 84%, 60%)"
  }
];

export const performanceMetrics: PerformanceMetric[] = [
  {
    title: "Efficiency Rate",
    value: "94.2%",
    subtitle: "Average processing time: 2.3 hours",
    iconName: "ShoppingCart",
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    title: "Customer Satisfaction",
    value: "4.8/5",
    subtitle: "Based on 1,247 reviews",
    iconName: "CheckCircle2",
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    title: "Revenue Impact",
    value: "$127K",
    subtitle: "+18.5% vs last period",
    iconName: "DollarSign",
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600"
  }
];

export const keyInsights: KeyInsight[] = [
  {
    type: "success",
    title: "Strong Performance",
    description:
      "Order completion rate increased by 8.2% this week, indicating improved operational efficiency",
    iconName: "CheckCircle2"
  },
  {
    type: "warning",
    title: "Area for Improvement",
    description:
      "Delivery processing for rush orders remains sluggished. Consider optimizing processing workflows to reduce bottlenecks.",
    iconName: "AlertCircle"
  }
];
