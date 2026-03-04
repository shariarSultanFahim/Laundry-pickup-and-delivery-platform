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
    date: "2024-01-15",
    pickupAddress: "123 Main St, New York, NY 10001",
    deliveryAddress: "456 Oak Ave, Brooklyn, NY 11201"
  },
  {
    id: "ORD-2024-002",
    customerName: "Mike Chen",
    customerEmail: "mike@email.com",
    amount: 149.5,
    orderStatus: "in-progress",
    paymentStatus: "pending",
    transactionId: "TXN-789456124",
    date: "2024-01-14",
    pickupAddress: "789 Elm St, Queens, NY 11354",
    deliveryAddress: "321 Pine Rd, Manhattan, NY 10005"
  },
  {
    id: "ORD-2024-003",
    customerName: "Emma Wilson",
    customerEmail: "emma@email.com",
    amount: 89.99,
    orderStatus: "pending",
    paymentStatus: "failed",
    transactionId: "TXN-789456125",
    date: "2024-01-13",
    pickupAddress: "555 Maple Dr, Bronx, NY 10451",
    deliveryAddress: "222 Cedar Ln, Staten Island, NY 10301"
  },
  {
    id: "ORD-2024-004",
    customerName: "Noah Miller",
    customerEmail: "noah@email.com",
    amount: 175,
    orderStatus: "completed",
    paymentStatus: "paid",
    transactionId: "TXN-789456126",
    date: "2024-01-12",
    pickupAddress: "777 Birch Ave, New York, NY 10002",
    deliveryAddress: "999 Spruce St, Brooklyn, NY 11202"
  },
  {
    id: "ORD-2024-005",
    customerName: "Olivia Davis",
    customerEmail: "olivia@email.com",
    amount: 210.75,
    orderStatus: "completed",
    paymentStatus: "paid",
    transactionId: "TXN-789456127",
    date: "2024-01-11",
    pickupAddress: "111 Willow Way, New York, NY 10003",
    deliveryAddress: "333 Oak St, Manhattan, NY 10006"
  },
  {
    id: "ORD-2024-006",
    customerName: "James Martinez",
    customerEmail: "james@email.com",
    amount: 64,
    orderStatus: "cancelled",
    paymentStatus: "refunded",
    transactionId: "TXN-789456128",
    date: "2024-01-10",
    pickupAddress: "444 Ash Blvd, Queens, NY 11355",
    deliveryAddress: "666 Chestnut Ave, Brooklyn, NY 11203"
  },
  {
    id: "ORD-2024-007",
    customerName: "Ava Anderson",
    customerEmail: "ava@email.com",
    amount: 330.2,
    orderStatus: "in-progress",
    paymentStatus: "pending",
    transactionId: "TXN-789456129",
    date: "2024-01-09",
    pickupAddress: "888 Poplar Ln, New York, NY 10004",
    deliveryAddress: "777 Fir St, Manhattan, NY 10007"
  },
  {
    id: "ORD-2024-008",
    customerName: "William Thomas",
    customerEmail: "william@email.com",
    amount: 58.4,
    orderStatus: "pending",
    paymentStatus: "pending",
    transactionId: "TXN-789456130",
    date: "2024-01-08",
    pickupAddress: "555 Sycamore Dr, Bronx, NY 10452",
    deliveryAddress: "444 Walnut Rd, Staten Island, NY 10302"
  },
  {
    id: "ORD-2024-009",
    customerName: "Sophia Taylor",
    customerEmail: "sophia@email.com",
    amount: 410,
    orderStatus: "completed",
    paymentStatus: "paid",
    transactionId: "TXN-789456131",
    date: "2024-01-07",
    pickupAddress: "222 Locust Way, New York, NY 10005",
    deliveryAddress: "111 Magnolia Ave, Brooklyn, NY 11204"
  },
  {
    id: "ORD-2024-010",
    customerName: "Benjamin White",
    customerEmail: "benjamin@email.com",
    amount: 120,
    orderStatus: "in-progress",
    paymentStatus: "pending",
    transactionId: "TXN-789456132",
    date: "2024-01-06",
    pickupAddress: "333 Hazel St, Queens, NY 11356",
    deliveryAddress: "555 Juniper Ln, Manhattan, NY 10008"
  },
  {
    id: "ORD-2024-011",
    customerName: "Charlotte Harris",
    customerEmail: "charlotte@email.com",
    amount: 98.3,
    orderStatus: "completed",
    paymentStatus: "paid",
    transactionId: "TXN-789456133",
    date: "2024-01-05",
    pickupAddress: "666 Laurel Blvd, New York, NY 10006",
    deliveryAddress: "888 Mulberry Dr, Brooklyn, NY 11205"
  },
  {
    id: "ORD-2024-012",
    customerName: "Elijah Clark",
    customerEmail: "elijah@email.com",
    amount: 215.45,
    orderStatus: "cancelled",
    paymentStatus: "failed",
    transactionId: "TXN-789456134",
    date: "2024-01-04",
    pickupAddress: "999 Olive Ave, Bronx, NY 10453",
    deliveryAddress: "333 Palm Rd, Staten Island, NY 10303"
  },
  {
    id: "ORD-2024-013",
    customerName: "Amelia Lewis",
    customerEmail: "amelia@email.com",
    amount: 89,
    orderStatus: "pending",
    paymentStatus: "pending",
    transactionId: "TXN-789456135",
    date: "2024-01-03",
    pickupAddress: "444 Pecan Way, New York, NY 10007",
    deliveryAddress: "222 Plum St, Manhattan, NY 10009"
  },
  {
    id: "ORD-2024-014",
    customerName: "Henry Lee",
    customerEmail: "henry@email.com",
    amount: 137.89,
    orderStatus: "completed",
    paymentStatus: "paid",
    transactionId: "TXN-789456136",
    date: "2024-01-02",
    pickupAddress: "111 Quince Ln, Queens, NY 11357",
    deliveryAddress: "666 Rosewood Ave, Brooklyn, NY 11206"
  },
  {
    id: "ORD-2024-015",
    customerName: "Mia Walker",
    customerEmail: "mia@email.com",
    amount: 240,
    orderStatus: "in-progress",
    paymentStatus: "pending",
    transactionId: "TXN-789456137",
    date: "2024-01-01",
    pickupAddress: "777 Sequoia Dr, New York, NY 10008",
    deliveryAddress: "999 Tamarind Ln, Manhattan, NY 10010"
  },
  {
    id: "ORD-2024-016",
    customerName: "Lucas Hall",
    customerEmail: "lucas@email.com",
    amount: 75,
    orderStatus: "completed",
    paymentStatus: "paid",
    transactionId: "TXN-789456138",
    date: "2023-12-31",
    pickupAddress: "555 Ulex Way, Bronx, NY 10454",
    deliveryAddress: "888 Verbena St, Staten Island, NY 10304"
  },
  {
    id: "ORD-2024-017",
    customerName: "Harper Allen",
    customerEmail: "harper@email.com",
    amount: 188.99,
    orderStatus: "pending",
    paymentStatus: "failed",
    transactionId: "TXN-789456139",
    date: "2023-12-30",
    pickupAddress: "222 Viburnum Ave, New York, NY 10009",
    deliveryAddress: "444 Wisteria Blvd, Brooklyn, NY 11207"
  },
  {
    id: "ORD-2024-018",
    customerName: "Evelyn Young",
    customerEmail: "evelyn@email.com",
    amount: 305,
    orderStatus: "completed",
    paymentStatus: "paid",
    transactionId: "TXN-789456140",
    date: "2023-12-29",
    pickupAddress: "111 Yarrow Ln, Queens, NY 11358",
    deliveryAddress: "777 Zinnia Dr, Manhattan, NY 10011"
  },
  {
    id: "ORD-2024-019",
    customerName: "Daniel Parker",
    customerEmail: "daniel@email.com",
    amount: 54.5,
    orderStatus: "cancelled",
    paymentStatus: "refunded",
    transactionId: "TXN-789456141",
    date: "2023-12-28",
    pickupAddress: "333 Alder Way, New York, NY 10010",
    deliveryAddress: "666 Boxwood St, Brooklyn, NY 11208"
  },
  {
    id: "ORD-2024-020",
    customerName: "Grace Scott",
    customerEmail: "grace@email.com",
    amount: 162.25,
    orderStatus: "in-progress",
    paymentStatus: "pending",
    transactionId: "TXN-789456142",
    date: "2023-12-27",
    pickupAddress: "999 Cottonwood Ave, Bronx, NY 10455",
    deliveryAddress: "555 Dogwood Ln, Staten Island, NY 10305"
  }
];
