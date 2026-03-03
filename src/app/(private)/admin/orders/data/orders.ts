import type { OrderManagementOrder, OrderPaymentStat } from "@/types/order-management";

export const orderPaymentStatsData: OrderPaymentStat[] = [
  {
    title: "Total Revenue",
    value: "$124,890",
    subtitle: "+12.5% from last month",
    trend: "up"
  },
  {
    title: "Average Ticket",
    value: "$24.50",
    subtitle: "+$1.20 vs last week",
    trend: "up"
  },
  {
    title: "Pending Payments",
    value: "$8,450",
    subtitle: "23 transactions",
    trend: "down"
  },
  {
    title: "Failed Payments",
    value: "$2,180",
    subtitle: "7 transactions",
    trend: "down"
  }
];

export const ordersData: OrderManagementOrder[] = [
  {
    id: "ORD-2024-001",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@email.com",
    amount: 299.99,
    orderStatus: "completed",
    paymentStatus: "paid",
    transactionId: "TXN-789456123",
    date: "2024-01-15"
  },
  {
    id: "ORD-2024-002",
    customerName: "Mike Chen",
    customerEmail: "mike@email.com",
    amount: 149.5,
    orderStatus: "in-progress",
    paymentStatus: "pending",
    transactionId: "TXN-789456124",
    date: "2024-01-14"
  },
  {
    id: "ORD-2024-003",
    customerName: "Emma Wilson",
    customerEmail: "emma@email.com",
    amount: 89.99,
    orderStatus: "pending",
    paymentStatus: "failed",
    transactionId: "TXN-789456125",
    date: "2024-01-13"
  },
  {
    id: "ORD-2024-004",
    customerName: "Noah Miller",
    customerEmail: "noah@email.com",
    amount: 175,
    orderStatus: "completed",
    paymentStatus: "paid",
    transactionId: "TXN-789456126",
    date: "2024-01-12"
  },
  {
    id: "ORD-2024-005",
    customerName: "Olivia Davis",
    customerEmail: "olivia@email.com",
    amount: 210.75,
    orderStatus: "completed",
    paymentStatus: "paid",
    transactionId: "TXN-789456127",
    date: "2024-01-11"
  },
  {
    id: "ORD-2024-006",
    customerName: "James Martinez",
    customerEmail: "james@email.com",
    amount: 64,
    orderStatus: "cancelled",
    paymentStatus: "refunded",
    transactionId: "TXN-789456128",
    date: "2024-01-10"
  },
  {
    id: "ORD-2024-007",
    customerName: "Ava Anderson",
    customerEmail: "ava@email.com",
    amount: 330.2,
    orderStatus: "in-progress",
    paymentStatus: "pending",
    transactionId: "TXN-789456129",
    date: "2024-01-09"
  },
  {
    id: "ORD-2024-008",
    customerName: "William Thomas",
    customerEmail: "william@email.com",
    amount: 58.4,
    orderStatus: "pending",
    paymentStatus: "pending",
    transactionId: "TXN-789456130",
    date: "2024-01-08"
  },
  {
    id: "ORD-2024-009",
    customerName: "Sophia Taylor",
    customerEmail: "sophia@email.com",
    amount: 410,
    orderStatus: "completed",
    paymentStatus: "paid",
    transactionId: "TXN-789456131",
    date: "2024-01-07"
  },
  {
    id: "ORD-2024-010",
    customerName: "Benjamin White",
    customerEmail: "benjamin@email.com",
    amount: 120,
    orderStatus: "in-progress",
    paymentStatus: "pending",
    transactionId: "TXN-789456132",
    date: "2024-01-06"
  },
  {
    id: "ORD-2024-011",
    customerName: "Charlotte Harris",
    customerEmail: "charlotte@email.com",
    amount: 98.3,
    orderStatus: "completed",
    paymentStatus: "paid",
    transactionId: "TXN-789456133",
    date: "2024-01-05"
  },
  {
    id: "ORD-2024-012",
    customerName: "Elijah Clark",
    customerEmail: "elijah@email.com",
    amount: 215.45,
    orderStatus: "cancelled",
    paymentStatus: "failed",
    transactionId: "TXN-789456134",
    date: "2024-01-04"
  },
  {
    id: "ORD-2024-013",
    customerName: "Amelia Lewis",
    customerEmail: "amelia@email.com",
    amount: 89,
    orderStatus: "pending",
    paymentStatus: "pending",
    transactionId: "TXN-789456135",
    date: "2024-01-03"
  },
  {
    id: "ORD-2024-014",
    customerName: "Henry Lee",
    customerEmail: "henry@email.com",
    amount: 137.89,
    orderStatus: "completed",
    paymentStatus: "paid",
    transactionId: "TXN-789456136",
    date: "2024-01-02"
  },
  {
    id: "ORD-2024-015",
    customerName: "Mia Walker",
    customerEmail: "mia@email.com",
    amount: 240,
    orderStatus: "in-progress",
    paymentStatus: "pending",
    transactionId: "TXN-789456137",
    date: "2024-01-01"
  },
  {
    id: "ORD-2024-016",
    customerName: "Lucas Hall",
    customerEmail: "lucas@email.com",
    amount: 75,
    orderStatus: "completed",
    paymentStatus: "paid",
    transactionId: "TXN-789456138",
    date: "2023-12-31"
  },
  {
    id: "ORD-2024-017",
    customerName: "Harper Allen",
    customerEmail: "harper@email.com",
    amount: 188.99,
    orderStatus: "pending",
    paymentStatus: "failed",
    transactionId: "TXN-789456139",
    date: "2023-12-30"
  },
  {
    id: "ORD-2024-018",
    customerName: "Evelyn Young",
    customerEmail: "evelyn@email.com",
    amount: 305,
    orderStatus: "completed",
    paymentStatus: "paid",
    transactionId: "TXN-789456140",
    date: "2023-12-29"
  },
  {
    id: "ORD-2024-019",
    customerName: "Daniel Parker",
    customerEmail: "daniel@email.com",
    amount: 54.5,
    orderStatus: "cancelled",
    paymentStatus: "refunded",
    transactionId: "TXN-789456141",
    date: "2023-12-28"
  },
  {
    id: "ORD-2024-020",
    customerName: "Grace Scott",
    customerEmail: "grace@email.com",
    amount: 162.25,
    orderStatus: "in-progress",
    paymentStatus: "pending",
    transactionId: "TXN-789456142",
    date: "2023-12-27"
  }
];
