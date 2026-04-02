"use client";

import { useQuery } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";
import { ServiceResponse } from "@/types/service";

export function useGetServiceDetails(id: string, enabled = true) {
  return useQuery({
    queryKey: ["service", id],
    enabled: enabled && !!id,
    queryFn: async () => {
      const response = await instance.get<ServiceResponse>(`/service/${id}`);
      return response.data;
    }
  });
}
