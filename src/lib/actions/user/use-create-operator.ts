import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateOperatorRequest, CreateUserAccountResponse } from "@/types/user";

import { api } from "@/lib/api";

async function createOperator(data: CreateOperatorRequest): Promise<CreateUserAccountResponse> {
  const formData = new FormData();
  formData.append(
    "data",
    JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password
    })
  );

  if (data.imageFile) {
    formData.append("image", data.imageFile);
  }

  const response = await api.post<CreateUserAccountResponse>("/user/create-operator", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
}

export function useCreateOperator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOperator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operators"] });
    }
  });
}
