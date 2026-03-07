import {
  Banknote,
  Clock,
  CreditCard,
  DollarSign,
  Percent,
  Receipt,
  RefreshCw,
  ShoppingCart,
  TrendingDown,
  UserCog,
  Users,
  X
} from "lucide-react";

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

export const dashboardStats: StatsCardData[] = [
  {
    title: "Total Orders",
    value: "12,847",
    change: {
      value: "+8.2%",
      trend: "up",
      period: "from last month"
    },
    icon: ShoppingCart,
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    title: "Net Platform Revenue",
    value: "$892,456",
    change: {
      value: "+12.5%",
      trend: "up",
      period: "from last month"
    },
    icon: DollarSign,
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    title: "Repeat Customer Rate",
    value: "68%",
    change: {
      value: "3%",
      trend: "up",
      period: "vs last week"
    },
    icon: RefreshCw,
    iconBgColor: "bg-cyan-100",
    iconColor: "text-cyan-600"
  },
  {
    title: "New Customers",
    value: "1,234",
    change: {
      value: "+15.3%",
      trend: "up",
      period: "from last month"
    },
    icon: Users,
    iconBgColor: "bg-orange-100",
    iconColor: "text-orange-600"
  },
  {
    title: "Cancellation Rate",
    value: "2.3%",
    change: {
      value: "0.5%",
      trend: "down",
      period: "vs last week"
    },
    icon: X,
    iconBgColor: "bg-red-100",
    iconColor: "text-red-600"
  },
  {
    title: "On-time Completion",
    value: "94%",
    change: {
      value: "2%",
      trend: "up",
      period: "vs last week"
    },
    icon: Clock,
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    title: "Average Ticket",
    value: "$24.50",
    change: {
      value: "$1.20",
      trend: "up",
      period: "vs last week"
    },
    icon: Receipt,
    iconBgColor: "bg-purple-100",
    iconColor: "text-purple-600"
  },
  {
    title: "Active operators",
    value: "20",
    icon: UserCog,
    iconBgColor: "bg-slate-100",
    iconColor: "text-slate-600"
  },
  {
    title: "Membership count",
    value: "15",
    icon: CreditCard,
    iconBgColor: "bg-slate-100",
    iconColor: "text-slate-600"
  },
  {
    title: "Membership churn",
    value: "05",
    icon: TrendingDown,
    iconBgColor: "bg-slate-100",
    iconColor: "text-slate-600"
  },
  {
    title: "Total GMV",
    value: "20%",
    icon: Percent,
    iconBgColor: "bg-slate-100",
    iconColor: "text-slate-600"
  },
  {
    title: "Gross Revenue",
    value: "$892,456",
    icon: Banknote,
    iconBgColor: "bg-slate-100",
    iconColor: "text-slate-600"
  }
];

// Monthly Revenue Data
export interface MonthlyRevenueData {
  month: string;
  revenue: number;
}

export const monthlyRevenueData: MonthlyRevenueData[] = [
  { month: "Jan", revenue: 65000 },
  { month: "Feb", revenue: 70000 },
  { month: "Mar", revenue: 68000 },
  { month: "Apr", revenue: 85000 },
  { month: "May", revenue: 95000 },
  { month: "Jun", revenue: 92000 },
  { month: "Jul", revenue: 98000 },
  { month: "Aug", revenue: 102000 },
  { month: "Sep", revenue: 98000 },
  { month: "Oct", revenue: 108000 },
  { month: "Nov", revenue: 115000 },
  { month: "Dec", revenue: 120000 }
];

// Order Status Data
export interface OrderStatusData {
  status: string;
  value: number;
  color: string;
}

export const orderStatusData: OrderStatusData[] = [
  { status: "Completed", value: 65, color: "#10b981" },
  { status: "Processing", value: 20, color: "#f59e0b" },
  { status: "Shipped", value: 12, color: "#3b82f6" },
  { status: "Cancelled", value: 3, color: "#ef4444" }
];

// Orders Data (Weekly)
export interface OrdersData {
  day: string;
  orders: number;
}

export const ordersData: OrdersData[] = [
  { day: "Mon", orders: 45 },
  { day: "Tue", orders: 52 },
  { day: "Wed", orders: 38 },
  { day: "Thu", orders: 65 },
  { day: "Fri", orders: 72 },
  { day: "Sat", orders: 88 },
  { day: "Sun", orders: 95 }
];

// Top Operators Data
export interface TopOperatorData {
  operatorId: string;
  name: string;
  successRate: string;
  avatar: string;
}

export const topOperatorsData: TopOperatorData[] = [
  {
    operatorId: "opr-001",
    name: "Mike's Laundry",
    successRate: "98.5%",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  {
    operatorId: "opr-002",
    name: "QuickWash Pro",
    successRate: "96.2%",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  {
    operatorId: "opr-003",
    name: "Fresh Clean Co",
    successRate: "94.8%",
    avatar: "https://i.pravatar.cc/150?img=9"
  },
  {
    operatorId: "opr-004",
    name: "Express Laundry",
    successRate: "92.1%",
    avatar: "https://i.pravatar.cc/150?img=13"
  },
  {
    operatorId: "opr-005",
    name: "Sparkle Spin",
    successRate: "90.4%",
    avatar: "https://i.pravatar.cc/150?img=15"
  }
];

// Store Performance Data
export interface StorePerformanceData {
  storeName: string;
  currentSales: number;
  previousSales: number;
  growth: number;
  status: "excellent" | "good" | "declining";
  region: string;
  month: string;
}

export const storePerformanceData: StorePerformanceData[] = [
  {
    storeName: "Downtown Store",
    currentSales: 145230,
    previousSales: 128450,
    growth: 13.1,
    status: "excellent",
    region: "North",
    month: "March"
  },
  {
    storeName: "Mall Location",
    currentSales: 98750,
    previousSales: 112340,
    growth: -12.1,
    status: "declining",
    region: "East",
    month: "March"
  },
  {
    storeName: "Suburban Branch",
    currentSales: 87920,
    previousSales: 84560,
    growth: 4.0,
    status: "good",
    region: "West",
    month: "March"
  },
  {
    storeName: "Airport Store",
    currentSales: 156480,
    previousSales: 134200,
    growth: 16.6,
    status: "excellent",
    region: "South",
    month: "March"
  },
  {
    storeName: "City Center",
    currentSales: 124350,
    previousSales: 119800,
    growth: 3.8,
    status: "good",
    region: "North",
    month: "March"
  }
];
