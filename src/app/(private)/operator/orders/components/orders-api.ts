import type { FetchOrdersParams, FetchOrdersResponse } from "../data/orders";
import { operatorOrders } from "../data/orders";

export async function fetchOrders({
  page,
  pageSize,
  search,
  filters
}: FetchOrdersParams): Promise<FetchOrdersResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = operatorOrders;

  // Filter by search term (order ID or customer name)
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        order.id.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower)
    );
  }

  // Filter by status
  if (filters?.status) {
    filtered = filtered.filter((order) => order.status === filters.status);
  }

  // Filter by date range (mock implementation)
  if (filters?.fromDate || filters?.toDate) {
    // In a real app, you would parse and compare dates
    // For now, we'll keep all results
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const items = filtered.slice(startIndex, startIndex + pageSize);

  return {
    items,
    page,
    pageSize,
    total,
    totalPages
  };
}
