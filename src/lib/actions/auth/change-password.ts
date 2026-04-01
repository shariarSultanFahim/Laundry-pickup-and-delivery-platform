import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { ChangePasswordRequest, ChangePasswordResponse } from "@/types/auth";

async function changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
  const response = await api.post<ChangePasswordResponse>("/auth/change-password", data);
  return response.data;
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword
  });
}
