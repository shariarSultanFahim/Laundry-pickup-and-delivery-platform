import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface AddBundleToStorePayload {
  storeId: string;
  bundleIds: string[];
}

export const addBundleToStoreAction = async (payload: AddBundleToStorePayload) => {
  const response = await api.post("/storebundle", payload);
  return response.data;
};

export const deleteBundleFromStoreAction = async (storeBundleId: string) => {
  const response = await api.delete(`/storebundle/${storeBundleId}`);
  return response.data;
};

export const useAddBundleToStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBundleToStoreAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
    },
  });
};

export const useDeleteBundleFromStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBundleFromStoreAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
    },
  });
};
