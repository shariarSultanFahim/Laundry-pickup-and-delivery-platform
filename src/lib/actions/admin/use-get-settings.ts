import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { AdminSettings, AdminSettingsResponse } from "@/types/settings";

async function getSettings(): Promise<AdminSettings> {
  const response = await api.get<AdminSettingsResponse>("/adminsetting");
  const data = response.data.data;
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Settings not found");
  }
  return data[0];
}

export function useGetSettings() {
  return useQuery({
    queryKey: ["admin-settings"],
    queryFn: getSettings
  });
}
