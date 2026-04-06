import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CreateStorePayload, StoreResponse } from "@/types/store";

export const createStoreAction = async ({
  payload,
  logo,
  banner
}: {
  payload: CreateStorePayload;
  logo?: File | null;
  banner?: File | null;
}): Promise<StoreResponse> => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  if (logo) {
    formData.append("image", logo);
  }
  if (banner) {
    formData.append("banner", banner);
  }

  const response = await api.post<StoreResponse>("/store", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStoreAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    }
  });
};
