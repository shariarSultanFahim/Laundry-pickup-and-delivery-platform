import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { GetUserByIdResponse } from "@/types/user";

export function useGetUserById(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const { data } = await api.get<GetUserByIdResponse>(`/user/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}
