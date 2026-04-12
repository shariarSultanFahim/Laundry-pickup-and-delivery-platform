import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateAdminRequest, CreateUserAccountResponse } from "@/types/user";

import { api } from "@/lib/api";

async function createAdmin(data: CreateAdminRequest): Promise<CreateUserAccountResponse> {
  const formData = new FormData();
  formData.append(
    "data",
    JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone
    })
  );

  if (data.imageFile) {
    formData.append("image", data.imageFile);
  }

  const response = await api.post<CreateUserAccountResponse>("/user/create-admin", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });
}
