import { useQuery } from "@tanstack/react-query";

import { BundlesListResponse } from "@/types/bundle-management";

import { api } from "@/lib/api";

interface GetBundlesParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

export const getBundlesAction = async (params: GetBundlesParams): Promise<BundlesListResponse> => {
  const response = await api.get<BundlesListResponse>("/bundle/my-bundle", {
    params: {
      page: params.page,
      limit: params.limit,
      searchTerm: params.searchTerm
    }
  });
  return response.data;
};

export const useGetMyBundles = (params: GetBundlesParams, enabled = true) => {
  return useQuery({
    queryKey: ["bundles", params],
    enabled,
    queryFn: () => getBundlesAction(params)
  });
};
