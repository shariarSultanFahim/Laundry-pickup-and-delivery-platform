import type { FetchOperatorsParams, FetchOperatorsResponse } from "@/types/operator-management";

import { operatorsData } from "../data/operators";

function includesSearch(haystack: string, search: string) {
  return haystack.toLowerCase().includes(search.toLowerCase());
}

export async function fetchOperators({
  page,
  pageSize,
  search,
  filters
}: FetchOperatorsParams): Promise<FetchOperatorsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const normalizedSearch = search.trim();

  let results = operatorsData;

  // Apply search filter
  if (normalizedSearch) {
    results = results.filter((operator) =>
      [
        operator.id,
        operator.name,
        operator.status,
        operator.store,
        operator.area,
        operator.region
      ].some((value) => includesSearch(value, normalizedSearch))
    );
  }

  // Apply status filter
  if (filters?.status) {
    results = results.filter((operator) => operator.status === filters.status);
  }

  // Apply region filter
  if (filters?.region) {
    results = results.filter((operator) => operator.region === filters.region);
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
