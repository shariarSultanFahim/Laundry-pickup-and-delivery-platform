export interface EarningsStats {
  title: string;
  value: string;
  subtitle: string;
  icon?: string;
}

export const earningsStats: EarningsStats[] = [
  {
    title: "Gross Revenue",
    value: "$451.00",
    subtitle: "Total revenue from orders"
  },
  {
    title: "Commission",
    value: "-68",
    subtitle: "15% platform fee"
  },
  {
    title: "Processing",
    value: "-15.24",
    subtitle: "2.9% + $0.30/txn"
  }
];

export interface NextPayoutInfo {
  amount: string;
  nextPayoutDate: string;
  nextPayoutAmount: string;
}

export const nextPayoutInfo: NextPayoutInfo = {
  amount: "$364.90",
  nextPayoutDate: "Feb 24, 2026",
  nextPayoutAmount: "$664.90"
};

export interface PayoutHistory {
  id: string;
  period: string;
  gross: number;
  net: number;
  status: "Paid" | "Pending";
  date: string;
}

export interface PayoutFilters {
  status?: "Paid" | "Pending";
  month?: string;
  year?: string;
}

export interface FetchPayoutsParams {
  page: number;
  pageSize: number;
  search: string;
  filters?: PayoutFilters;
}

export interface FetchPayoutsResponse {
  items: PayoutHistory[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const payoutHistoryData: PayoutHistory[] = [
  {
    id: "1",
    period: "Feb 8-Feb14",
    gross: 1234.5,
    net: 987.6,
    status: "Paid",
    date: "Feb 18, 2026"
  },
  {
    id: "2",
    period: "Feb 1-Feb 7",
    gross: 892.25,
    net: 714.8,
    status: "Paid",
    date: "Feb 4, 2026"
  },
  {
    id: "3",
    period: "Feb 15-Feb21",
    gross: 756.75,
    net: 605.4,
    status: "Pending",
    date: "Feb 4, 2026"
  },
  {
    id: "4",
    period: "Feb 22-Feb 27",
    gross: 1045.3,
    net: 836.24,
    status: "Paid",
    date: "Feb 28, 2026"
  },
  {
    id: "5",
    period: "Mar 1-Mar 7",
    gross: 1123.45,
    net: 898.76,
    status: "Paid",
    date: "Mar 10, 2026"
  },
  {
    id: "6",
    period: "Mar 8-Mar 14",
    gross: 945.2,
    net: 756.16,
    status: "Pending",
    date: "Mar 12, 2026"
  }
];
