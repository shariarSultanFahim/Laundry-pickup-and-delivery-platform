import type {
  GrowthTrendItem,
  RoleDistributionItem,
  UserManagementUser,
  UserStats
} from "@/types/user-management";

export const userStatsData: UserStats[] = [
  {
    title: "Total Users",
    value: "2,847",
    subtitle: "+12.4% from last month",
    trend: "up"
  },
  {
    title: "Active Users",
    value: "2,156",
    subtitle: "75.7% activation rate",
    trend: "up"
  },
  {
    title: "New This Month",
    value: "184",
    subtitle: "+8.1% from previous month",
    trend: "up"
  },
  {
    title: "Suspended Users",
    value: "37",
    subtitle: "-4.2% from last month",
    trend: "down"
  }
];

export const roleDistributionData: RoleDistributionItem[] = [
  { role: "Customers", users: 2230 },
  { role: "Operators", users: 590 },
  { role: "Admins", users: 27 }
];

export const growthTrendData: GrowthTrendItem[] = [
  { month: "Jan", users: 1980 },
  { month: "Feb", users: 2075 },
  { month: "Mar", users: 2150 },
  { month: "Apr", users: 2260 },
  { month: "May", users: 2345 },
  { month: "Jun", users: 2450 },
  { month: "Jul", users: 2570 },
  { month: "Aug", users: 2690 },
  { month: "Sep", users: 2760 },
  { month: "Oct", users: 2847 }
];

// export const usersData: UserManagementUser[] = [
//   {
//     id: "USR0001",
//     name: "Sarah Johnson",
//     email: "sarah.johnson@email.com",
//     phone: "+1 202-555-0121",
//     role: "customer",
//     status: "active",
//     totalOrders: 48,
//     totalSpent: 1325,
//     joinedAt: "2024-01-12"
//   },
//   {
//     id: "USR0002",
//     name: "Mike Chen",
//     email: "mike.chen@email.com",
//     phone: "+1 202-555-0122",
//     role: "customer",
//     status: "active",
//     totalOrders: 35,
//     totalSpent: 860,
//     joinedAt: "2024-02-18"
//   },
//   {
//     id: "USR0003",
//     name: "Emma Wilson",
//     email: "emma.wilson@email.com",
//     phone: "+1 202-555-0123",
//     role: "customer",
//     status: "inactive",
//     statusNote: "Account inactive due to no activity for 6 months",
//     totalOrders: 12,
//     totalSpent: 260,
//     joinedAt: "2024-03-03"
//   },
//   {
//     id: "USR0004",
//     name: "David Brown",
//     email: "david.brown@email.com",
//     phone: "+1 202-555-0124",
//     role: "operator",
//     status: "active",
//     totalOrders: 0,
//     totalSpent: 0,
//     joinedAt: "2023-11-10"
//   },
//   {
//     id: "USR0005",
//     name: "Lisa Garcia",
//     email: "lisa.garcia@email.com",
//     phone: "+1 202-555-0125",
//     role: "customer",
//     status: "active",
//     totalOrders: 63,
//     totalSpent: 1890,
//     joinedAt: "2023-10-22"
//   },
//   {
//     id: "USR0006",
//     name: "Noah Miller",
//     email: "noah.miller@email.com",
//     phone: "+1 202-555-0126",
//     role: "operator",
//     status: "active",
//     totalOrders: 0,
//     totalSpent: 0,
//     joinedAt: "2024-01-04"
//   },
//   {
//     id: "USR0007",
//     name: "Olivia Davis",
//     email: "olivia.davis@email.com",
//     phone: "+1 202-555-0127",
//     role: "customer",
//     status: "suspended",
//     statusNote: "Account suspended due to multiple payment failures",
//     totalOrders: 18,
//     totalSpent: 440,
//     joinedAt: "2024-04-09"
//   },
//   {
//     id: "USR0008",
//     name: "James Martinez",
//     email: "james.martinez@email.com",
//     phone: "+1 202-555-0128",
//     role: "customer",
//     status: "active",
//     totalOrders: 28,
//     totalSpent: 710,
//     joinedAt: "2024-04-18"
//   },
//   {
//     id: "USR0009",
//     name: "Ava Anderson",
//     email: "ava.anderson@email.com",
//     phone: "+1 202-555-0129",
//     role: "customer",
//     status: "active",
//     totalOrders: 14,
//     totalSpent: 315,
//     joinedAt: "2024-05-01"
//   },
//   {
//     id: "USR0010",
//     name: "William Thomas",
//     email: "william.thomas@email.com",
//     phone: "+1 202-555-0130",
//     role: "operator",
//     status: "active",
//     totalOrders: 0,
//     totalSpent: 0,
//     joinedAt: "2024-05-11"
//   },
//   {
//     id: "USR0011",
//     name: "Sophia Taylor",
//     email: "sophia.taylor@email.com",
//     phone: "+1 202-555-0131",
//     role: "customer",
//     status: "active",
//     totalOrders: 44,
//     totalSpent: 1220,
//     joinedAt: "2024-02-01"
//   },
//   {
//     id: "USR0012",
//     name: "Benjamin White",
//     email: "benjamin.white@email.com",
//     phone: "+1 202-555-0132",
//     role: "customer",
//     status: "inactive",
//     statusNote: "Requested account deactivation",
//     totalOrders: 9,
//     totalSpent: 190,
//     joinedAt: "2024-06-04"
//   },
//   {
//     id: "USR0013",
//     name: "Charlotte Harris",
//     email: "charlotte.harris@email.com",
//     phone: "+1 202-555-0133",
//     role: "customer",
//     status: "active",
//     totalOrders: 24,
//     totalSpent: 625,
//     joinedAt: "2024-06-11"
//   },
//   {
//     id: "USR0014",
//     name: "Elijah Clark",
//     email: "elijah.clark@email.com",
//     phone: "+1 202-555-0134",
//     role: "operator",
//     status: "active",
//     totalOrders: 0,
//     totalSpent: 0,
//     joinedAt: "2024-03-24"
//   },
//   {
//     id: "USR0015",
//     name: "Amelia Lewis",
//     email: "amelia.lewis@email.com",
//     phone: "+1 202-555-0135",
//     role: "customer",
//     status: "active",
//     totalOrders: 37,
//     totalSpent: 1020,
//     joinedAt: "2024-01-30"
//   },
//   {
//     id: "USR0016",
//     name: "Henry Lee",
//     email: "henry.lee@email.com",
//     phone: "+1 202-555-0136",
//     role: "customer",
//     status: "suspended",
//     statusNote: "Violating terms of service",
//     totalOrders: 6,
//     totalSpent: 140,
//     joinedAt: "2024-07-09"
//   },
//   {
//     id: "USR0017",
//     name: "Mia Walker",
//     email: "mia.walker@email.com",
//     phone: "+1 202-555-0137",
//     role: "customer",
//     status: "active",
//     totalOrders: 19,
//     totalSpent: 510,
//     joinedAt: "2024-07-13"
//   },
//   {
//     id: "USR0018",
//     name: "Lucas Hall",
//     email: "lucas.hall@email.com",
//     phone: "+1 202-555-0138",
//     role: "operator",
//     status: "inactive",
//     statusNote: "On temporary leave until 2026-04-01",
//     totalOrders: 0,
//     totalSpent: 0,
//     joinedAt: "2024-04-27"
//   },
//   {
//     id: "USR0019",
//     name: "Harper Allen",
//     email: "harper.allen@email.com",
//     phone: "+1 202-555-0139",
//     role: "customer",
//     status: "active",
//     totalOrders: 31,
//     totalSpent: 835,
//     joinedAt: "2024-08-03"
//   },
//   {
//     id: "USR0020",
//     name: "Evelyn Young",
//     email: "evelyn.young@email.com",
//     phone: "+1 202-555-0140",
//     role: "admin",
//     status: "active",
//     totalOrders: 0,
//     totalSpent: 0,
//     joinedAt: "2023-09-15"
//   }
// ];
