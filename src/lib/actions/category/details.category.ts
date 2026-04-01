"use client";

import { useQuery } from "@tanstack/react-query";
import type { CategoryResponse } from "@/types/category";
import { api as instance } from "@/lib/api";

export const useGetCategoryDetails = (id?: string | null, enabled = true) => {
  return useQuery({
    queryKey: ["category", id],
    enabled: enabled && !!id,
    queryFn: async () => {
      const response = await instance.get<CategoryResponse>(`/category/${id}`);
      return response.data;
    }
  });
};
