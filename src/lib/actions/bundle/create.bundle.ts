import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { BundleResponse } from "@/types/bundle-management";


interface CreateBundlePayload {
  name: string;
  description: string;
  bundlePrice: string;
  serviceIds: string[];
  image?: File | null;
}

export const createBundleAction = async (payload: CreateBundlePayload): Promise<BundleResponse> => {
  const formData = new FormData();

  // Construct the data object exactly as requested by backend
  const data = {
    name: payload.name,
    description: payload.description,
    bundlePrice: payload.bundlePrice,
    serviceIds: payload.serviceIds,
    isActive: true
  };

  formData.append("data", JSON.stringify(data));
  if (payload.image) {
    formData.append("image", payload.image);
  }

  const response = await api.post<BundleResponse>("/service-bundle", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const useCreateBundle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBundleAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
    }
  });
};
