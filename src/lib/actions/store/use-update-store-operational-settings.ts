"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  OperationalControlsResponse,
  UpdateOperationalSettingsRequest
} from "@/types/operational-controls";

import { patch } from "@/lib/api";

import { storeOperationalSettingsQueryKey } from "./use-store-operational-settings";

interface UseUpdateStoreOperationalSettingsOptions {
  storeId?: string;
}

export function useUpdateStoreOperationalSettings({
  storeId
}: UseUpdateStoreOperationalSettingsOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateOperationalSettingsRequest) => {
      if (!storeId) {
        throw new Error("Please select a store first.");
      }

      return patch<OperationalControlsResponse, UpdateOperationalSettingsRequest>(
        `/store/${storeId}/operational-settings`,
        payload
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: storeOperationalSettingsQueryKey(storeId) });
    }
  });
}
