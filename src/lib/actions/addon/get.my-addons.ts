"use client";

import { useQuery } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";
import { AddonListResponse, AddonQueryParams } from "@/types/addon";

const buildParams = (params?: AddonQueryParams) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ) as AddonQueryParams;

export const useGetMyAddons = (params?: AddonQueryParams, enabled = true) => {
  return useQuery({
    queryKey: ["addons", "me", params],
    enabled,
    queryFn: async () => {
      const response = await instance.get<AddonListResponse>("/addon/my-addons", {
        params: buildParams(params)
      });
      return response.data;
    }
  });
};
