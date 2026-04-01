"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { patch } from "@/lib/api";
import type { BannerResponse } from "@/types/banner";

export interface UpdateBannerPayload {
  isActive?: boolean;
}

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateBannerPayload & { id: string }) => {
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      
      const response = await patch<BannerResponse, FormData>(`/banner/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
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
