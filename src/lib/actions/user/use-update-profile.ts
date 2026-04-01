import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { UpdateProfileRequest, UpdateProfileResponse } from "@/types/user";

async function updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
  const formData = new FormData();
  
  const jsonData: Record<string, string> = {};
  if (data.name) jsonData.name = data.name;
  if (data.phone) jsonData.phone = data.phone;
  
  if (Object.keys(jsonData).length > 0) {
    formData.append("data", JSON.stringify(jsonData));
  }
  
  if (data.avatarFile) formData.append("image", data.avatarFile);

  const response = await api.patch<UpdateProfileResponse>(`/user/${data.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      // Invalidate the cache to fetch new data
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    }
  });
}
