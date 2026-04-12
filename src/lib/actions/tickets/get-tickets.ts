"use client";

import { useQuery } from "@tanstack/react-query";

import type { GetTicketsListResponse, GetTicketsQueryParams } from "@/types/ticket-management";

import { api } from "@/lib/api";

const buildParams = (params?: GetTicketsQueryParams) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ) as GetTicketsQueryParams;

export const useGetTickets = (params?: GetTicketsQueryParams, enabled = true) => {
  return useQuery({
    queryKey: ["tickets", params],
    enabled,
    queryFn: async () => {
      const response = await api.get<GetTicketsListResponse>("/supportticket", {
        params: buildParams(params)
      });
      return response.data;
    }
  });
};
