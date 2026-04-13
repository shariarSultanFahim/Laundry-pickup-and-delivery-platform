"use client";

import { useQuery } from "@tanstack/react-query";

import { ServiceListResponse, ServiceQueryParams } from "@/types/service";

import { api as instance } from "@/lib/api";

const buildParams = (params?: ServiceQueryParams) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ) as ServiceQueryParams;

export const useGetMyServices = (params?: ServiceQueryParams, enabled = true) => {
  return useQuery({
    queryKey: ["my-services", params],
    enabled,
    queryFn: async () => {
      const response = await instance.get<ServiceListResponse>("/service/my-service", {
        params: buildParams(params)
      });
      return response.data;
    }
  });
};
