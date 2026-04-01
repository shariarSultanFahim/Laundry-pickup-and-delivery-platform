import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { AuthRole } from "@/types/auth-role";
import { AUTH_SESSION_COOKIE, LOGIN_PATH, ROLE_HOME_PATHS, UNAUTHORIZED_PATH } from "@/constants/auth";
import { parseAuthSession } from "@/lib/auth/session";

export const getSessionFromRequest = async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_SESSION_COOKIE)?.value;
  if (!raw) return null;
  return parseAuthSession(raw);
};

/** Called inside private layouts to enforce authentication. */
export const requirePrivateRole = async (allowedRoles: AuthRole[]) => {
  const session = await getSessionFromRequest();

  if (!session) {
    redirect(LOGIN_PATH);
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
