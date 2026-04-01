"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { del } from "@/lib/api";

interface DeleteBannerResponse {
  success: boolean;
  message: string;
}

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => del<DeleteBannerResponse>(`/banner/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (error) => {
      const msg = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? error.message)
        : "An unexpected error occurred";
      throw new Error(msg);
    }
  });
};
