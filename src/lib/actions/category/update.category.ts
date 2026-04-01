"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { patch } from "@/lib/api";

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  isActive?: boolean;
}

interface UpdateCategoryResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateCategoryPayload & { id: string }) =>
      patch<UpdateCategoryResponse, UpdateCategoryPayload>(`/category/${id}`, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      void queryClient.invalidateQueries({ queryKey: ["category", variables.id] });
    },
    onError: (error) => {
      const msg = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? error.message)
        : "An unexpected error occurred";
      throw new Error(msg);
    }
  });
};
