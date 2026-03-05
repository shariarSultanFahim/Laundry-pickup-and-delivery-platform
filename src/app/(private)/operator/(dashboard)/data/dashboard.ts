import { DollarSign, Settings, ShoppingCart, Truck } from "lucide-react";

export interface StatsCardData {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down";
    period: string;
  };
  subtitle?: string;
  icon: typeof ShoppingCart;
  iconBgColor: string;
  iconColor: string;
}

export const operatorDashboardStats: StatsCardData[] = [
  {
    title: "Total Orders",
    value: "247",
    icon: ShoppingCart,
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    title: "Total Revenue",
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
    title: "In Processing",
    value: "156",
    subtitle: "On track",
    icon: Settings,
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    title: "Out for Delivery",
    value: "89",
    subtitle: "In transit",
    icon: Truck,
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600"
  }
];

export interface MonthlyRevenueData {
  month: string;
  revenue: number;
}

export const operatorMonthlyRevenueData: MonthlyRevenueData[] = [
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

export interface TopSellingService {
  name: string;
  iconName: "wash-fold" | "dry-cleaning" | "ironing";
  orders: number;
  percentage: number;
  color: string;
}

export const topSellingServices: TopSellingService[] = [
  {
    name: "Wash & Fold",
    iconName: "wash-fold",
    orders: 156,
    percentage: 42,
    color: "#3b82f6"
  },
  {
    name: "Dry Cleaning",
    iconName: "dry-cleaning",
    orders: 98,
    percentage: 26,
    color: "#a855f7"
  },
  {
    name: "Ironing",
    iconName: "ironing",
    orders: 72,
    percentage: 19,
    color: "#22c55e"
  }
];

export interface RecentOrder {
  id: string;
  customerName: string;
  customerAvatar: string;
  items: number;
  fulfillmentTime: string;
  amount: number;
  status: "Processing" | "Delivered" | "Shipped";
}

export const recentOrders: RecentOrder[] = [
  {
    id: "#ORD-2024-001",
    customerName: "John Smith",
    customerAvatar: "https://i.pravatar.cc/150?img=1",
    items: 3,
    fulfillmentTime: "0 days",
    amount: 249.99,
    status: "Processing"
  },
  {
    id: "#ORD-2024-002",
    customerName: "Sarah Johnson",
    customerAvatar: "https://i.pravatar.cc/150?img=5",
    items: 1,
    fulfillmentTime: "3 days",
    amount: 89.5,
    status: "Delivered"
  },
  {
    id: "#ORD-2024-003",
    customerName: "Mike Davis",
    customerAvatar: "https://i.pravatar.cc/150?img=3",
    items: 5,
    fulfillmentTime: "0 days",
    amount: 459.99,
    status: "Shipped"
  }
];
