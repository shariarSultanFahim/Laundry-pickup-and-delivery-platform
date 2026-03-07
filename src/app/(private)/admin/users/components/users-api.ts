import type { FetchUsersParams, FetchUsersResponse } from "@/types/user-management";

import { usersData } from "../data/users";

function includesSearch(haystack: string, search: string) {
  return haystack.toLowerCase().includes(search.toLowerCase());
}

export async function fetchUsers({
  page,
  pageSize,
  search,
  filters
}: FetchUsersParams): Promise<FetchUsersResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const normalizedSearch = search.trim();

  let results = usersData;

  // Apply search filter
  if (normalizedSearch) {
    results = results.filter((user) =>
      [user.id, user.name, user.email, user.phone, user.role, user.status].some((value) =>
        includesSearch(value, normalizedSearch)
      )
    );
  }

  // Apply role filter
  if (filters?.role) {
    results = results.filter((user) => user.role === filters.role);
  }

  // Apply status filter
  if (filters?.status) {
    results = results.filter((user) => user.status === filters.status);
  }

  // Apply min order spent filter
  if (filters?.minOrderSpent && filters.minOrderSpent > 0) {
    results = results.filter((user) => user.totalSpent >= filters.minOrderSpent!);
  }

  // Apply date range filter
  if (filters?.dateRange) {
    results = results.filter((user) => {
      const userDate = new Date(user.joinedAt);
      const fromDate = new Date(filters.dateRange!.from);
      fromDate.setHours(0, 0, 0, 0);

      let toDate = new Date(filters.dateRange!.to || filters.dateRange!.from);
      toDate.setHours(23, 59, 59, 999);

      return userDate >= fromDate && userDate <= toDate;
    });
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
