"use client";

import { useQuery } from "@tanstack/react-query";

import type { GetTicketDetailsResponse } from "@/types/ticket-management";

import { api } from "@/lib/api";

export const useGetTicketDetails = (ticketId: string, enabled = true) => {
  return useQuery({
    queryKey: ["tickets", ticketId],
    enabled: enabled && !!ticketId,
    queryFn: async () => {
      const response = await api.get<GetTicketDetailsResponse>(`/supportticket/${ticketId}`);
      return response.data;
    }
  });
};
