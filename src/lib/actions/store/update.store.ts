import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { StoreResponse, UpdateStorePayload } from "@/types/store";

export const updateStoreAction = async ({
  id,
  payload,
  logo,
  banner
}: {
  id: string;
  payload: UpdateStorePayload;
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

  const response = await api.patch<StoreResponse>(`/store/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStoreAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    }
  });
};
