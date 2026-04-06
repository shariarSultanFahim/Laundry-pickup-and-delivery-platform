import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { StoreListResponse, StoreQueryParams } from "@/types/store";

const buildParams = (params?: StoreQueryParams) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ) as any;

export const getMyStoresAction = async (operatorId: string, params?: StoreQueryParams): Promise<StoreListResponse> => {
  const response = await api.get<StoreListResponse>(`/store/operator/${operatorId}`, {
    params: buildParams(params)
  });
  return response.data;
};

export const useGetMyStores = (operatorId: string, params?: StoreQueryParams, enabled = true) => {
  return useQuery({
    queryKey: ["stores", "me", operatorId, params],
    enabled: !!operatorId && enabled,
    queryFn: () => getMyStoresAction(operatorId, params)
  });
};
