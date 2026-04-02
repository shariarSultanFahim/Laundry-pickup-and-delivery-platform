"use client";

import { useQuery } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";
import { ServiceListResponse, ServiceQueryParams } from "@/types/service";

const buildParams = (params?: ServiceQueryParams) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ) as ServiceQueryParams;

export const useGetServices = (params?: ServiceQueryParams, enabled = true) => {
  return useQuery({
    queryKey: ["services", params],
    enabled,
    queryFn: async () => {
      const response = await instance.get<ServiceListResponse>("/service", {
        params: buildParams(params)
      });
      return response.data;
    }
  });
};
