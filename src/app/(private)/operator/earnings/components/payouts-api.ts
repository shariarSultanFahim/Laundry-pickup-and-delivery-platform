import { FetchPayoutsParams, FetchPayoutsResponse, payoutHistoryData } from "../data/earnings";

export async function fetchPayouts({
  page,
  pageSize,
  search,
  filters
}: FetchPayoutsParams): Promise<FetchPayoutsResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filteredData = [...payoutHistoryData];

  // Filter by search (period)
  if (search) {
    filteredData = filteredData.filter((payout) =>
      payout.period.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter by status
  if (filters?.status) {
    filteredData = filteredData.filter((payout) => payout.status === filters.status);
  }

  // Filter by month and year
  if (filters?.month || filters?.year) {
    filteredData = filteredData.filter((payout) => {
      const payoutDate = new Date(payout.date);
      const month = payoutDate.toLocaleString("default", { month: "short" });
      const year = payoutDate.getFullYear().toString();

      if (filters.month && !month.toLowerCase().includes(filters.month.toLowerCase())) {
        return false;
      }

      if (filters.year && year !== filters.year) {
        return false;
      }

      return true;
    });
  }

  // Calculate pagination
  const total = filteredData.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const items = filteredData.slice(startIndex, startIndex + pageSize);

  return {
    items,
    page,
    pageSize,
    total,
    totalPages
  };
}
