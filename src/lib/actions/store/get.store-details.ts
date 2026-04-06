import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { StoreDetailsResponse } from "@/types/store";

export const getStoreDetailsAction = async (id: string): Promise<StoreDetailsResponse> => {
  const response = await api.get<StoreDetailsResponse>(`/store/${id}`);
  return response.data;
};

export const useGetStoreDetails = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["store", id],
    enabled: !!id && enabled,
    queryFn: () => getStoreDetailsAction(id)
  });
};
