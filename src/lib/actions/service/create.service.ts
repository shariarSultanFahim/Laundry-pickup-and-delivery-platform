"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";
import { CreateServicePayload, ServiceResponse } from "@/types/service";

interface CreateServiceInput {
  data: CreateServicePayload;
  image?: File;
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, image }: CreateServiceInput) => {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      if (image) {
        formData.append("image", image);
      }

      const response = await instance.post<ServiceResponse>("/service", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["services"] });
    }
  });
}
