import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { BundleResponse } from "@/types/bundle-management";

export const deleteBundleAction = async (id: string): Promise<BundleResponse> => {
  const response = await api.delete<BundleResponse>(`/service-bundle/${id}`);
  return response.data;
};

export const useDeleteBundle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBundleAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
    }
  });
};
