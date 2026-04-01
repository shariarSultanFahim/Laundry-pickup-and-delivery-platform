import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { AdminSettings, AdminSettingsResponse } from "@/types/settings";

async function getSettings(): Promise<AdminSettings> {
  const response = await api.get<AdminSettingsResponse>("/admin/settings");
  return response.data.data;
}

export function useGetSettings() {
  return useQuery({
    queryKey: ["admin-settings"],
    queryFn: getSettings
  });
}
