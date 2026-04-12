import { useQuery } from "@tanstack/react-query";

import type { GetOperatorsQueryParams, GetOperatorsResponse } from "@/types/operator-management";

import { api } from "@/lib/api";

export function useGetOperators(params: GetOperatorsQueryParams) {
  return useQuery({
    queryKey: ["operators", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
      if (params.status) searchParams.append("status", params.status);
      if (params.approvalStatus) searchParams.append("approvalStatus", params.approvalStatus);

      const { data } = await api.get<GetOperatorsResponse>(
        `/user/operators?${searchParams.toString()}`
      );
      return data;
    }
  });
}
