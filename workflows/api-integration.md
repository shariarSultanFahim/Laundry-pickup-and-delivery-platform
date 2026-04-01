---
description: Integrate real API endpoints from a Postman collection, replacing placeholder JSON data and mock types. Includes Axios setup, access token, refresh token, HOC, and authentication logic.
---

# API Integration Workflow

This workflow covers the **complete** integration of real API endpoints into this project, from parsing a Postman collection to replacing mock data, including all authentication infrastructure.

**Stack:** Next.js 16 · TanStack Query v5 · Axios · TypeScript · `js-cookie` · JWT

> **Provide the Postman JSON file** before starting. The AI will parse all endpoints, request bodies, query params, and example responses to drive every step below.

---

## Architecture Overview

```
Browser Cookie (ri_session)
    └── JSON string: { accessToken, refreshToken, role }
            │
            ▼
src/lib/api.ts  ← Axios instance
    ├── request interceptor injects Bearer token from cookie
    └── response interceptor normalises errors
            │
            ▼
src/lib/actions/<feature>/*.ts  ← useQuery / useMutation hooks
            │
            ▼
src/app/(private|public)/**    ← Page / Layout components
    └── src/lib/hoc/with-route-guard.tsx  ← HOC guards layouts
```

---

## Part A – Axios Setup

### File: `src/lib/api.ts`

This is the **single Axios instance** used throughout the app. Never create a second one.

```typescript
import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { AUTH_SESSION_COOKIE } from "@/constants/auth";
import { env } from "@/env";
import { parseAuthSession } from "@/lib/auth/session";

// ─── Axios instance ────────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,  // from .env: NEXT_PUBLIC_API_URL=https://api.example.com
  timeout: 10_000,
  headers: { Accept: "application/json" }
});

// ─── Request interceptor: attach access token ─────────────────────────────────
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  const headers = config.headers as Record<string, string | undefined> | undefined;
  const hasAuthHeader = Boolean(headers?.Authorization || headers?.authorization);

  if (token && !hasAuthHeader) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ─── Response interceptor: normalise errors ────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err)) return Promise.reject(err);
    return Promise.reject(new AxiosError("Unknown error"));
  }
);

// ─── Convenience wrappers (return .data directly) ─────────────────────────────
type Cfg = AxiosRequestConfig & { signal?: AbortSignal };

export const get   = async <T>(url: string, config?: Cfg) =>
  (await api.get<T>(url, config)).data;

export const post  = async <T, B = unknown>(url: string, body?: B, config?: Cfg) =>
  (await api.post<T>(url, body, config)).data;

export const put   = async <T, B = unknown>(url: string, body?: B, config?: Cfg) =>
  (await api.put<T>(url, body, config)).data;

export const patch = async <T, B = unknown>(url: string, body?: B, config?: Cfg) =>
  (await api.patch<T>(url, body, config)).data;

export const del   = async <T>(url: string, config?: Cfg) =>
  (await api.delete<T>(url, config)).data;

// ─── Internal: reads access token from cookie ──────────────────────────────────
const getCookieValue = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const found = document.cookie
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(prefix));
  return found ? found.slice(prefix.length) : null;
};

async function getToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const rawSession = getCookieValue(AUTH_SESSION_COOKIE);
  if (!rawSession) return null;
  const session = parseAuthSession(rawSession);
  return session?.accessToken ?? null;
}
```

**Key points:**
- `baseURL` is set once from the env variable — never hardcode URLs in action files.
- The request interceptor reads the cookie on every request; no manual token passing needed.
- Use the `get/post/put/patch/del` helpers in most hooks. Use `api` (raw instance) only when you need access to response headers or multipart uploads.

---

## Part B – Authentication

### Types

**`src/types/auth-role.ts`**
```typescript
export type AuthRole = "admin" | "operator";
```

**`src/types/auth-session.ts`**
```typescript
import type { AuthRole } from "@/types/auth-role";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  role: AuthRole;
}
```

### Constants: `src/constants/auth.ts`

```typescript
import type { AuthRole } from "@/types/auth-role";

export const AUTH_SESSION_COOKIE = "ri_session";       // cookie name
export const LOGIN_PATH = "/login";
export const UNAUTHORIZED_PATH     = "/";

export const ROLE_HOME_PATHS: Record<AuthRole, string> = {
  admin:    "/admin",
  operator:     "/operator",
};
```

### Session Management: `src/lib/auth/session.ts`

Handles **reading**, **parsing**, and **building** the `AuthSession` stored in the cookie.

```typescript
import { LoginResponse } from "@/types/auth";
import type { AuthRole }    from "@/types/auth-role";
import type { AuthSession } from "@/types/auth-session";

// ── Helpers ────────────────────────────────────────────────────────────────────
const normalizeAuthRole = (role: string | null | undefined): AuthRole | null => {
  const n = role?.toLowerCase();
  return n === "admin" || n === "operator" ? n : null;
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded  = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  try {
    const decoded = Buffer.from(padded, "base64").toString("utf8");
    const parsed  = JSON.parse(decoded) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch { return null; }
};

const extractRoleFromToken = (token: string): AuthRole | null => {
  const payload = decodeJwtPayload(token);
  const role    = typeof payload?.role === "string" ? payload.role : null;
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
      const parsed    = JSON.parse(input) as Partial<AuthSession>;
      if (typeof parsed.accessToken !== "string" || typeof parsed.refreshToken !== "string") return null;
      const role = normalizeAuthRole(parsed.role) ?? extractRoleFromToken(parsed.accessToken);
      if (!role) return null;
      return { accessToken: parsed.accessToken, refreshToken: parsed.refreshToken, role };
    } catch { return null; }
  };

  return tryParse(raw) ?? tryParse(decodeURIComponent(raw));
};

/**
 * Build a session object from the login/verify API response.
 * Throws if the response is not valid.
 */
export const buildAuthSessionFromLoginResponse = (data: LoginResponse): AuthSession => {
  const accessToken  = data.data?.accessToken;
  const refreshToken = data.data?.refreshToken;

  if (!data.success || !accessToken || !refreshToken) {
    throw new Error(data.message || "Login failed.");
  }

  const role = normalizeAuthRole(data.data?.user?.role) ?? extractRoleFromToken(accessToken);
  if (!role) throw new Error("Unable to detect user role from login response.");

  return { accessToken, refreshToken, role };
};
```

### Cookie Client: `src/lib/cookie-client.ts`

Used exclusively for writing and removing the session cookie **from the client side**.

```typescript
"use client";

import Cookies from "js-cookie";

const isClient = () => typeof window !== "undefined";

export const cookie = {
  get: (key: string): string | null =>
    isClient() ? (Cookies.get(key) ?? null) : null,

  set: (key: string, value: string, days = 365): void => {
    if (!isClient()) return;
    Cookies.set(key, value, {
      expires: days,
      sameSite: "Lax",
      path: "/",
      secure: process.env.NODE_ENV === "production"
    });
  },

  remove: (key: string): void => {
    if (!isClient()) return;
    Cookies.remove(key);
  }
};
```

### Auth Action Hooks: `src/lib/actions/auth/`

#### Login (user): `login.ts`

```typescript
"use client";

import { useMutation } from "@tanstack/react-query";
import { LoginRequest, LoginResponse } from "@/types/auth";
import { post } from "@/lib/api";
import { buildAuthSessionFromLoginResponse } from "@/lib/auth/session";

// Re-export so login page components can call this directly after mutation success
export const buildSessionFromLoginResponse = buildAuthSessionFromLoginResponse;

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginRequest) =>
      post<LoginResponse, LoginRequest>("/auth/login", payload)
  });
}
```

**How to use on the login page:**

```tsx
const { mutateAsync: login } = useLogin();

const onSubmit = async (values: LoginFormValues) => {
  const response = await login(values);
  const session  = buildSessionFromLoginResponse(response); // throws on failure
  cookie.set(AUTH_SESSION_COOKIE, JSON.stringify(session));
  router.push(ROLE_HOME_PATHS[session.role]);
};
```

#### Login (workshop): `login.workshop.ts`

Same pattern, different endpoint:
```typescript
mutationFn: (payload: LoginRequest) =>
  post<LoginResponse, LoginRequest>("/workshop/login", payload)
```

#### Verify (OTP): `verify-user.ts`

After OTP verification, build the session from the verify-user response (same shape as login):

```typescript
"use client";

import { useMutation } from "@tanstack/react-query";
import { ResendOTPRequest, VerifyUserRequest, VerifyUserResponse } from "@/types/auth";
import { post } from "@/lib/api";
import { buildAuthSessionFromLoginResponse } from "@/lib/auth/session";

export const buildSessionFromVerifyUserResponse = (data: VerifyUserResponse) =>
  buildAuthSessionFromLoginResponse(data as never);

export function useVerifyUser() {
  return useMutation({
    mutationFn: (payload: VerifyUserRequest) =>
      post<VerifyUserResponse, VerifyUserRequest>("/auth/verify-user", payload)
  });
}

export function useResendOTP() {
  return useMutation({
    mutationFn: (payload: ResendOTPRequest) => post("/auth/resend-otp", payload)
  });
}
```

#### Verify (workshop OTP): `verify-workshop.ts`

Workshop verify has a different response shape — normalize it before calling `buildAuthSessionFromLoginResponse`:

```typescript
export const buildSessionFromVerifyWorkshopResponse = (data: VerifyWorkshopResponse) => {
  const workshop = data.data?.workshop;

  const normalized: LoginResponse = {
    success: data.success,
    message: data.message,
    data: {
      accessToken:  data.data?.accessToken,
      refreshToken: data.data?.refreshToken,
      user: {
        id:         workshop?.id ?? "",
        name:       "",
        email:      workshop?.email ?? "",
        phone:      workshop?.phone ?? "",
        role:       workshop?.role ?? "",
        isVerified: workshop?.isVerified ?? false,
        status:     workshop?.approvalStatus ?? "active"
      }
    }
  };

  return buildAuthSessionFromLoginResponse(normalized);
};
```

### Logout: `src/hooks/use-logout.ts`

```typescript
import { AUTH_SESSION_COOKIE } from "@/constants/auth";
import { cookie } from "@/lib/cookie-client";

export function useLogout() {
  const logout = () => {
    cookie.remove(AUTH_SESSION_COOKIE);
    window.location.href = "/";  // hard redirect clears all React Query cache
  };

  return { logout };
}
```

---

## Part C – Route Guards (HOC)

### Server-side guard: `src/lib/auth/route-guard.ts`

Runs in **Server Components** (layouts). Reads the cookie via `next/headers` and redirects if the session is missing or the role is not allowed.

```typescript
import { cookies }  from "next/headers";
import { redirect } from "next/navigation";

import type { AuthRole } from "@/types/auth-role";
import {
  ADMIN_USER_LOGIN_PATH, AUTH_SESSION_COOKIE,
  ROLE_HOME_PATHS, UNAUTHORIZED_PATH, WORKSHOP_LOGIN_PATH
} from "@/constants/auth";
import { parseAuthSession } from "@/lib/auth/session";

export const getSessionFromRequest = async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_SESSION_COOKIE)?.value;
  if (!raw) return null;
  return parseAuthSession(raw);
};

export const getLoginPathForRole = (role: AuthRole) =>
  role === "workshop" ? WORKSHOP_LOGIN_PATH : ADMIN_USER_LOGIN_PATH;

/** Called inside private layouts to enforce authentication. */
export const requirePrivateRole = async (allowedRoles: AuthRole[]) => {
  const session = await getSessionFromRequest();

  if (!session) {
    const fallbackRole = allowedRoles[0] ?? "user";
    redirect(getLoginPathForRole(fallbackRole));
  }

  if (!allowedRoles.includes(session.role)) {
    redirect(UNAUTHORIZED_PATH);
  }

  return session;
};

/** Called inside public (auth) layouts to redirect already-logged-in users. */
export const redirectIfAuthenticated = async () => {
  const session = await getSessionFromRequest();
  if (!session) return null;
  redirect(ROLE_HOME_PATHS[session.role]);
};
```

### HOC wrappers: `src/lib/hoc/with-route-guard.tsx`

Wraps Next.js layout components so route protection is declared at the export site.

```typescript
import { ReactNode } from "react";
import type { AuthRole } from "@/types/auth-role";
import { redirectIfAuthenticated, requirePrivateRole } from "@/lib/auth/route-guard";

type LayoutProps     = { children: ReactNode };
type LayoutComponent = (props: LayoutProps) => ReactNode | Promise<ReactNode>;

/** Wraps a private layout. Redirects to login if unauthenticated or wrong role. */
export const withPrivateRoute = (
  Layout: LayoutComponent,
  options: { allowedRoles: AuthRole[] }
) => {
  return async function GuardedLayout(props: LayoutProps) {
    await requirePrivateRole(options.allowedRoles);
    return <Layout {...props} />;
  };
};

/** Wraps a public/auth layout. Redirects to home if the user is already logged in. */
export const withPublicRoute = (Layout: LayoutComponent) => {
  return async function GuardedLayout(props: LayoutProps) {
    await redirectIfAuthenticated();
    return <Layout {...props} />;
  };
};
```

### How to apply HOCs

**Private layout** (e.g. admin dashboard):
```typescript
// src/app/(private)/admin/layout.tsx
function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{/* sidebar, header, etc. */}{children}</>;
}

export default withPrivateRoute(AdminLayout, { allowedRoles: ["admin"] });
```

**Public/auth layout** (e.g. login pages):
```typescript
// src/app/(public)/login/layout.tsx  (if needed)
function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withPublicRoute(LoginLayout);
```

**Role-based access:**

| Route group | `allowedRoles` |
|---|---|
| `/admin/**` | `["admin"]` |
| `/user/**` | `["user"]` |
| `/workshop/**` | `["workshop"]` |

---

## Part D – TanStack Query Setup

### Query client: `src/lib/query-client.ts`

```typescript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:          60_000,   // data is fresh for 1 min
      gcTime:             5 * 60_000,
      retry:              1,
      refetchOnWindowFocus: false
    }
  }
});
```

### Provider: `src/providers/QueryProvider.tsx`

```typescript
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools }  from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/query-client";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

Mount `QueryProvider` near the root — inside `src/providers/Providers.tsx` which is imported in `src/app/layout.tsx`.

---

## Part E – Postman → Action Hook Mapping

### Step 1 – Parse the Postman Collection

Extract per endpoint:

| Field | Postman JSON path |
|---|---|
| HTTP method | `item[].request.method` |
| URL path | `item[].request.url.raw` (strip base URL var) |
| Query params | `item[].request.url.query[]` |
| Request body | `item[].request.body.raw` (parse JSON) |
| Example response | `item[].response[].body` (parse JSON) |
| Auth required | Presence of `Authorization` header |

Group endpoints by resource (e.g. `booking`, `analytics`, `users`).

### Step 2 – Define TypeScript Types (`src/types/<feature>.ts`)

```typescript
// Standard API envelope ─────────────────────────────────────────────────────
export interface PaginationMeta {
  page: number; limit: number; total: number; totalPage: number;
}

export interface <Resource>ListResponse {
  success: boolean; message: string;
  data: { meta: PaginationMeta; data: <Resource>[]; };
}

export interface <Resource>Response {
  success: boolean; message: string;
  data: <Resource>;
}

// Query params (from Postman query[]) ────────────────────────────────────────
export interface <Resource>QueryParams {
  page?: number; limit?: number; searchTerm?: string;
  // add Postman-specific filters here
}
```

**Rules:**
- `string` for ISO dates, never `Date`
- `string | null` for nullable fields
- `string[]` for arrays of URLs/IDs
- No `any` — use `unknown` or narrow unions
- `Record<string, number>` for dynamic key–value breakdowns
- Mutation payloads live **inline** in the action file, not in `src/types/`

### Step 3 – Create Action Hooks (`src/lib/actions/<feature>/`)

**File naming:**

| Operation | Filename |
|---|---|
| GET list with filters | `get.<resource>s.ts` |
| GET single | `details.<resource>.ts` |
| GET user-scoped | `get-<resource>-by-user.ts` |
| POST create | `create.<resource>.ts` |
| PATCH update | `update.<resource>.ts` |
| PATCH status change | `update-<resource>-status.ts` |
| DELETE | `delete.<resource>.ts` |

**Query hook template:**
```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import type { <Resource>QueryParams, <Resource>ListResponse } from "@/types/<feature>";
import { api as instance } from "@/lib/api";

const buildParams = (params?: <Resource>QueryParams) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ) as <Resource>QueryParams;

export const useGet<Resources> = (params?: <Resource>QueryParams, enabled = true) => {
  return useQuery({
    queryKey: ["<resource>s", params],
    enabled,
    queryFn: async () => {
      const response = await instance.get<<Resource>ListResponse>("/<api-path>", {
        params: buildParams(params)
      });
      return response.data;
    }
  });
};
```

**Mutation hook template:**
```typescript
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { post } from "@/lib/api";

interface Create<Resource>Payload { /* Postman body fields */ }
interface Create<Resource>Response { success: boolean; message: string; data?: unknown; }

export const useCreate<Resource> = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Create<Resource>Payload) =>
      post<Create<Resource>Response, Create<Resource>Payload>("/<api-path>", payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["<resource>s"] });
    },
    onError: (error) => {
      const msg = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? error.message)
        : "An unexpected error occurred";
      throw new Error(msg);
    }
  });
};
```

**Multipart / file upload:**
```typescript
mutationFn: async (payload: UpdateProfileInput) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload.data));
  if (payload.image) formData.append("image", payload.image);

  const response = await instance.patch<ApiResponse<Profile>>(
    `/auth/user/${payload.userId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}
```

### Query Key Conventions

| Scope | Key |
|---|---|
| All records | `["<resource>s"]` |
| Filtered list | `["<resource>s", params]` |
| Single record | `["<resource>", id]` |
| User-scoped | `["<resource>s", userId]` |
| Admin analytics | `["admin-analytics"]` |
| Current user | `["user-profile", "me"]` |

**Invalidation:** Always use the broadest prefix. `queryKey: ["bookings"]` invalidates all booking queries.

---

## Part F – Consuming Hooks in Components

```tsx
const { data, isLoading, isError } = useGet<Resources>(params);

// Error state
{isError && (
  <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
    Failed to load data. Please refresh and try again.
  </div>
)}

// Data access
const items = data?.data?.data ?? [];
const meta  = data?.data?.meta;
```

**Checklist per component:**
- [ ] Remove `import data from "@/data/..."` → delete the file if no other consumers
- [ ] Remove `const MOCK_DATA = [...]` blocks
- [ ] Add query/mutation hook at the top of the component
- [ ] Replace hardcoded values with `data?.data ?? fallback`
- [ ] Add `isLoading` skeleton state
- [ ] Add `isError` error block
- [ ] Remove types invented for mock data; use canonical types from `src/types/`

---

## Part G – Cleanup

After integration:

1. Delete orphaned files in `src/data/` that have no more consumers.
2. Remove stale type interfaces superseded by API-driven ones.
3. Fix all ESLint unused-import warnings.
4. Run `npm run knip` — delete every flagged dead export/file.

---

## Part H – Verification

```bash
npm run typecheck   # no TS errors
npm run lint        # no ESLint errors
npm run knip        # no dead exports
```

Browser checks:
- Data loads from the real API (inspect Network tab)
- Filters / search / pagination send correct query params
- Mutations refresh the UI via cache invalidation
- Auth header appears on every protected request
- Unauthenticated users are redirected to the login page
- Already-authenticated users are redirected away from login pages
- Logout removes the cookie and clears the session

---

## Reference: Standard API Response Envelope

```json
{ "success": true,  "message": "OK",    "data": { ... } }
{ "success": false, "message": "Error", "errorMessages": [{ "path": "field", "message": "..." }] }
```

Always type the generic on `get<T>` / `post<T, B>` with the **full envelope** (success + message + data), not just the inner `data` field.
