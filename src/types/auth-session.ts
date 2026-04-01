import type { AuthRole } from "@/types/auth-role";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  role: AuthRole;
}
