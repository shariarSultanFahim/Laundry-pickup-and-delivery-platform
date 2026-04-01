"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { api as instance } from "@/lib/api";
import type { BannerResponse } from "@/types/banner";

export interface CreateBannerPayload {
  title: string;
  description: string;
  buttonText: string;
  bannerType: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  image: File;
}

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateBannerPayload) => {
      const formData = new FormData();
      const { image, ...rest } = payload;
      
      formData.append("data", JSON.stringify(rest));
      formData.append("image", image);

      const response = await instance.post<BannerResponse>("/banner", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    },
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
