"use client";

import { useQuery } from "@tanstack/react-query";

import type { OperationalControlsResponse } from "@/types/operational-controls";

import { get } from "@/lib/api";

export const storeOperationalSettingsQueryKey = (storeId?: string) =>
  ["store-operational-settings", storeId] as const;

export function useStoreOperationalSettings(storeId?: string, enabled = true) {
  return useQuery({
    queryKey: storeOperationalSettingsQueryKey(storeId),
    enabled: Boolean(storeId) && enabled,
    queryFn: () => get<OperationalControlsResponse>(`/store/${storeId}/operational-settings`)
  });
}
