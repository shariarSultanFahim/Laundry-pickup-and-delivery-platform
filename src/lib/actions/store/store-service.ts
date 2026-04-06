import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface AddServiceToStorePayload {
  storeId: string;
  serviceIds: string[];
}

export const addServiceToStoreAction = async (payload: AddServiceToStorePayload) => {
  const response = await api.post("/storeservice", payload);
  return response.data;
};

export const deleteServiceFromStoreAction = async (storeServiceId: string) => {
  const response = await api.delete(`/storeservice/${storeServiceId}`);
  return response.data;
};

export const useAddServiceToStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addServiceToStoreAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
    },
  });
};

export const useDeleteServiceFromStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteServiceFromStoreAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
    },
  });
};
