"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { del } from "@/lib/api";

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => del<unknown>(`/service/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["services"] });
    }
  });
}
