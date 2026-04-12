"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import type {
  SupportTicketStatus,
  UpdateTicketStatusPayload,
  UpdateTicketStatusResponse
} from "@/types/ticket-management";

import { patch } from "@/lib/api";

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { ticketId: string; status: SupportTicketStatus }) =>
      patch<UpdateTicketStatusResponse, UpdateTicketStatusPayload>(
        `/supportticket/${params.ticketId}`,
        { status: params.status }
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
    onError: (error) => {
      const msg = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? error.message)
        : "An unexpected error occurred";
      throw new Error(msg);
    }
  });
};
