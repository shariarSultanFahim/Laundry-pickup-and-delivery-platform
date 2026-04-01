import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { AUTH_SESSION_COOKIE } from "@/constants/auth";
import { env } from "@/env";
import { parseAuthSession } from "@/lib/auth/session";

// ── Axios instance ─────────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: { Accept: "application/json" }
});

// ── Request interceptor: attach access token ───────────────────────────────────
api.interceptors.request.use((config) => {
  const token = getToken();
  const headers = config.headers as Record<string, string | undefined> | undefined;
  const hasAuthHeader = Boolean(headers?.Authorization || headers?.authorization);

  if (token && !hasAuthHeader) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ── Response interceptor: normalise errors ─────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err)) return Promise.reject(err);
    return Promise.reject(new AxiosError("Unknown error"));
  }
);

// ── Convenience wrappers (return .data directly) ───────────────────────────────
type Cfg = AxiosRequestConfig & { signal?: AbortSignal };

export const get = async <T>(url: string, config?: Cfg) =>
  (await api.get<T>(url, config)).data;

export const post = async <T, B = unknown>(url: string, body?: B, config?: Cfg) =>
  (await api.post<T>(url, body, config)).data;

export const put = async <T, B = unknown>(url: string, body?: B, config?: Cfg) =>
  (await api.put<T>(url, body, config)).data;

export const patch = async <T, B = unknown>(url: string, body?: B, config?: Cfg) =>
  (await api.patch<T>(url, body, config)).data;

export const del = async <T>(url: string, config?: Cfg) =>
  (await api.delete<T>(url, config)).data;

// ── Internal: reads access token from cookie ───────────────────────────────────
const getCookieValue = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const found = document.cookie
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(prefix));
  return found ? decodeURIComponent(found.slice(prefix.length)) : null;
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const rawSession = getCookieValue(AUTH_SESSION_COOKIE);
  if (!rawSession) return null;
  const session = parseAuthSession(rawSession);
  return session?.accessToken ?? null;
}
