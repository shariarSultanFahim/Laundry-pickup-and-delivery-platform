"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api as instance } from "@/lib/api";
import { CreateServicePayload, ServiceResponse } from "@/types/service";

interface UpdateServiceInput {
  id: string;
  data: Partial<CreateServicePayload>;
  image?: File;
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data, image }: UpdateServiceInput) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        if (image) {
          formData.append("image", image);
        }
  
        const response = await instance.patch<ServiceResponse>(`/service/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
  
        return response.data;
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["services"] });
      void queryClient.setQueryData(["service", data.data.id], data.data);
    }
  });
}
