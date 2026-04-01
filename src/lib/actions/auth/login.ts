"use client";

import { useMutation } from "@tanstack/react-query";

import type { LoginRequest, LoginResponse } from "@/types/auth";
import { post } from "@/lib/api";
import { buildAuthSessionFromLoginResponse } from "@/lib/auth/session";

// Re-export so login page can call it directly after mutation success
export { buildAuthSessionFromLoginResponse as buildSessionFromLoginResponse };

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginRequest) =>
      post<LoginResponse, LoginRequest>("/auth/login", payload)
  });
}
