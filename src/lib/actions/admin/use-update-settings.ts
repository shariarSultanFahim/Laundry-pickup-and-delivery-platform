import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { UpdateAdminSettingsRequest, UpdateAdminSettingsResponse } from "@/types/settings";

async function updateSettings(data: UpdateAdminSettingsRequest): Promise<UpdateAdminSettingsResponse> {
  const response = await api.patch<UpdateAdminSettingsResponse>("/adminsetting/1", data);
  return response.data;
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    }
  });
}
