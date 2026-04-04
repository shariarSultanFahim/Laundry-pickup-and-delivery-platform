import type { AuthRole } from "@/types/auth-role";

export const AUTH_SESSION_COOKIE = "ri_session";

export const LOGIN_PATH = "/login";
export const UNAUTHORIZED_PATH = "/";

export const ROLE_HOME_PATHS: Record<AuthRole, string> = {
  super_admin: "/admin",
  admin: "/admin",
  operator: "/operator"
};
