import { TrendingDown, TrendingUp } from "lucide-react";

export interface OrderStats {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down";
    period: string;
  };
  subtitle?: string;
  icon: typeof TrendingUp;
  iconBgColor: string;
  iconColor: string;
}

export const operatorOrdersStats: OrderStats[] = [
  {
    title: "Cancellation Rate",
    value: "2.3%",
    change: {
      value: "0.5%",
      trend: "down",
      period: "vs last week"
    },
    icon: TrendingDown,
    iconBgColor: "bg-red-100",
    iconColor: "text-red-600"
  },
  {
    title: "Repeat Customer Rate",
    value: "68%",
    change: {
      value: "3%",
      trend: "up",
      period: "vs last week"
    },
    icon: TrendingUp,
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    title: "On-time Completion",
    value: "94%",
    change: {
      value: "2%",
      trend: "up",
      period: "vs last week"
    },
    icon: TrendingUp,
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
    icon: TrendingUp,
    iconBgColor: "bg-purple-100",
    iconColor: "text-purple-600"
  }
];

export interface Order {
  id: string;
  customerName: string;
  customerAvatar: string;
  items: number;
  fulfillmentTime: string;
  amount: number;
  status: "Processing" | "Delivered" | "Shipped" | "Pending" | "Cancelled";
}

export const operatorOrders: Order[] = [
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
  },
  {
    id: "#ORD-2024-004",
    customerName: "Emma Wilson",
    customerAvatar: "https://i.pravatar.cc/150?img=47",
    items: 2,
    fulfillmentTime: "0 days",
    amount: 129.99,
    status: "Pending"
  },
  {
    id: "#ORD-2024-005",
    customerName: "Alex Brown",
    customerAvatar: "https://i.pravatar.cc/150?img=8",
    items: 1,
    fulfillmentTime: "0 days",
    amount: 199.99,
    status: "Cancelled"
  },
  {
    id: "#ORD-2024-006",
    customerName: "Jessica Lee",
    customerAvatar: "https://i.pravatar.cc/150?img=9",
    items: 4,
    fulfillmentTime: "1 day",
    amount: 329.99,
    status: "Processing"
  },
  {
    id: "#ORD-2024-007",
    customerName: "David Chen",
    customerAvatar: "https://i.pravatar.cc/150?img=10",
    items: 2,
    fulfillmentTime: "2 days",
    amount: 189.99,
    status: "Delivered"
  },
  {
    id: "#ORD-2024-008",
    customerName: "Lisa Anderson",
    customerAvatar: "https://i.pravatar.cc/150?img=11",
    items: 6,
    fulfillmentTime: "0 days",
    amount: 559.99,
    status: "Shipped"
  },
  {
    id: "#ORD-2024-009",
    customerName: "Robert Martinez",
    customerAvatar: "https://i.pravatar.cc/150?img=12",
    items: 3,
    fulfillmentTime: "1 day",
    amount: 279.99,
    status: "Processing"
  },
  {
    id: "#ORD-2024-010",
    customerName: "Jennifer White",
    customerAvatar: "https://i.pravatar.cc/150?img=13",
    items: 2,
    fulfillmentTime: "4 days",
    amount: 159.99,
    status: "Delivered"
  }
];

export interface OrderFilters {
  status?: Order["status"];
  fromDate?: string;
  toDate?: string;
}

export interface FetchOrdersParams {
  page: number;
  pageSize: number;
  search: string;
  filters?: OrderFilters;
}

export interface FetchOrdersResponse {
  items: Order[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
