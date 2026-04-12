import { useQuery } from "@tanstack/react-query";

import type { GetOperatorByIdResponse } from "@/types/operator-management";

import { api } from "@/lib/api";

export function useGetOperatorById(operatorId: string, enabled = true) {
  return useQuery({
    queryKey: ["operator", operatorId],
    enabled: enabled && !!operatorId,
    queryFn: async () => {
      const { data } = await api.get<GetOperatorByIdResponse>(`/operator/${operatorId}`);
      return data.data;
    }
  });
}
