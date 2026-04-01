"use client";

import { useMutation } from "@tanstack/react-query";

import type { ResetPasswordRequest, ResetPasswordResponse } from "@/types/auth";
import { api } from "@/lib/api";

interface ResetPasswordPayload {
  token: string;
  password: string;
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: ResetPasswordPayload) =>
      api
        .post<ResetPasswordResponse>(
          "/auth/reset-password",
          { password } satisfies ResetPasswordRequest,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((r) => r.data)
  });
}
