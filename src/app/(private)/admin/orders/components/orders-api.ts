import type { FetchOrdersParams, FetchOrdersResponse } from "@/types/order-management";

import { ordersData } from "../data/orders";

function includesSearch(haystack: string, search: string) {
  return haystack.toLowerCase().includes(search.toLowerCase());
}

export async function fetchOrders({
  page,
  pageSize,
  search,
  filters
}: FetchOrdersParams): Promise<FetchOrdersResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const normalizedSearch = search.trim();

  let results = ordersData;

  if (normalizedSearch) {
    results = results.filter((order) =>
      [order.id, order.customerName, order.customerEmail, order.transactionId].some((value) =>
        includesSearch(value, normalizedSearch)
      )
    );
  }

  if (filters?.orderStatus) {
    results = results.filter((order) => order.orderStatus === filters.orderStatus);
  }

  if (filters?.paymentStatus) {
    results = results.filter((order) => order.paymentStatus === filters.paymentStatus);
  }

  if (filters?.fromDate) {
    results = results.filter((order) => order.date >= filters.fromDate!);
  }

  if (filters?.toDate) {
    results = results.filter((order) => order.date <= filters.toDate!);
  }

  const safePageSize = Math.max(pageSize, 1);
  const total = results.length;
  const totalPages = Math.max(Math.ceil(total / safePageSize), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const start = (safePage - 1) * safePageSize;
  const items = results.slice(start, start + safePageSize);

  return {
    items,
    page: safePage,
    pageSize: safePageSize,
    total,
    totalPages
  };
}
