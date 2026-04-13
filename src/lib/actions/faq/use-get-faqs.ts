import { useQuery } from "@tanstack/react-query";

import { get } from "@/lib/api";

import type { FAQListResponse } from "@/types";

interface GetFAQsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useGetFAQs(params?: GetFAQsParams) {
  return useQuery({
    queryKey: ["admin-faq", "list", params],
    queryFn: () => get<FAQListResponse>("/faq", { params })
  });
}
