"use client";

import { AUTH_SESSION_COOKIE } from "@/constants/auth";
import { cookie } from "@/lib/cookie-client";

export function useLogout() {
  const logout = () => {
    cookie.remove(AUTH_SESSION_COOKIE);
    window.location.href = "/login"; // hard redirect clears React Query cache
  };

  return { logout };
}
