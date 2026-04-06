import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { BundlesListResponse } from "@/types/bundle-management";

interface GetBundlesParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

export const getBundlesAction = async (params: GetBundlesParams): Promise<BundlesListResponse> => {
  const response = await api.get<BundlesListResponse>("/bundle", {
    params: {
      page: params.page,
      limit: params.limit,
      searchTerm: params.searchTerm
    }
  });
  return response.data;
};

export const useGetBundles = (params: GetBundlesParams) => {
  return useQuery({
    queryKey: ["bundles", params],
    queryFn: () => getBundlesAction(params)
  });
};
