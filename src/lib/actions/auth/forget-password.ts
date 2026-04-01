"use client";

import { useMutation } from "@tanstack/react-query";

import type { ForgetPasswordRequest, ForgetPasswordResponse } from "@/types/auth";
import { post } from "@/lib/api";

export function useForgetPassword() {
  return useMutation({
    mutationFn: (payload: ForgetPasswordRequest) =>
      post<ForgetPasswordResponse, ForgetPasswordRequest>("/auth/forget-password", payload)
  });
}
