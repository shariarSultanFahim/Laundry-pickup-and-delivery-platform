"use client";

import { useQuery } from "@tanstack/react-query";
import type { BannerListResponse } from "@/types/banner";
import { api as instance } from "@/lib/api";

export const useGetBanners = () => {
  return useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const response = await instance.get<BannerListResponse>("/banner");
      return response.data;
    }
  });
};
