import type { LoginResponse } from "@/types/auth";
import type { AuthRole } from "@/types/auth-role";
import type { AuthSession } from "@/types/auth-session";

// ── Helpers ────────────────────────────────────────────────────────────────────

const normalizeAuthRole = (role: string | null | undefined): AuthRole | null => {
  const n = role?.toLowerCase();
  if (n === "admin" || n === "operator") return n;
  return null;
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  try {
    const decoded = Buffer.from(padded, "base64").toString("utf8");
    const parsed = JSON.parse(decoded) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
};

const extractRoleFromToken = (token: string): AuthRole | null => {
  const payload = decodeJwtPayload(token);
  const role = typeof payload?.role === "string" ? payload.role : null;
  return normalizeAuthRole(role);
};

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Parse the raw cookie string back into a typed AuthSession.
 * Handles both plain and URI-encoded JSON.
 */
export const parseAuthSession = (raw: string): AuthSession | null => {
  const tryParse = (input: string): AuthSession | null => {
    try {
      const parsed = JSON.parse(input) as Partial<AuthSession>;
      if (typeof parsed.accessToken !== "string" || typeof parsed.refreshToken !== "string") {
        return null;
      }
      const role = normalizeAuthRole(parsed.role) ?? extractRoleFromToken(parsed.accessToken);
      if (!role) return null;
      return { accessToken: parsed.accessToken, refreshToken: parsed.refreshToken, role };
    } catch {
      return null;
    }
  };

  return tryParse(raw) ?? tryParse(decodeURIComponent(raw));
};

/**
 * Build a session object from the login API response.
 * Throws if the response is not valid or the role is unrecognised.
 */
export const buildAuthSessionFromLoginResponse = (data: LoginResponse): AuthSession => {
  const accessToken = data.data?.accessToken;
  const refreshToken = data.data?.refreshToken;

  if (!data.success || !accessToken || !refreshToken) {
    throw new Error(data.message || "Login failed.");
  }

  const role = normalizeAuthRole(data.data?.user?.role) ?? extractRoleFromToken(accessToken);
  if (!role) throw new Error("Unable to detect user role from login response.");

  return { accessToken, refreshToken, role };
};
