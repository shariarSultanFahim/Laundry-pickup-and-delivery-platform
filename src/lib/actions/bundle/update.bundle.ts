import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { BundleResponse } from "@/types/bundle-management";

interface UpdateBundlePayload {
  name?: string;
  description?: string;
  bundlePrice?: string;
  serviceIds?: string[];
  isActive?: boolean;
  image?: File | null;
}

export const updateBundleAction = async ({
  id,
  payload
}: {
  id: string;
  payload: UpdateBundlePayload;
}): Promise<BundleResponse> => {
  const formData = new FormData();

  // Construct data partial
  const data = {
    name: payload.name,
    description: payload.description,
    bundlePrice: payload.bundlePrice,
    serviceIds: payload.serviceIds,
    isActive: payload.isActive
  };

  formData.append("data", JSON.stringify(data));
  if (payload.image) {
    formData.append("image", payload.image);
  }

  const response = await api.patch<BundleResponse>(`/service-bundle/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const useUpdateBundle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBundleAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
    }
  });
};
