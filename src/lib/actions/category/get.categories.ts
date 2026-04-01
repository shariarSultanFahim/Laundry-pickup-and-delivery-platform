"use client";

import { useQuery } from "@tanstack/react-query";
import type { CategoryQueryParams, CategoryListResponse } from "@/types/category";
import { api as instance } from "@/lib/api";

const buildParams = (params?: CategoryQueryParams) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ) as CategoryQueryParams;

export const useGetCategories = (params?: CategoryQueryParams, enabled = true) => {
  return useQuery({
    queryKey: ["categories", params],
    enabled,
    queryFn: async () => {
      const response = await instance.get<CategoryListResponse>("/category", {
        params: buildParams(params)
      });
      return response.data;
    }
  });
};
