"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { post } from "@/lib/api";

export interface CreateCategoryPayload {
  name: string;
  description: string;
  isActive: boolean;
}

interface CreateCategoryResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      post<CreateCategoryResponse, CreateCategoryPayload>("/category", payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      const msg = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? error.message)
        : "An unexpected error occurred";
      throw new Error(msg);
    }
  });
};
