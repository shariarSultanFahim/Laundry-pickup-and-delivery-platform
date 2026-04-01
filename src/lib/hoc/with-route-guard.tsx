import { ReactNode } from "react";

import type { AuthRole } from "@/types/auth-role";
import { redirectIfAuthenticated, requirePrivateRole } from "@/lib/auth/route-guard";

type LayoutProps = { children: ReactNode };
type LayoutComponent = (props: LayoutProps) => ReactNode | Promise<ReactNode>;

/**
 * Wraps a private layout.
 * Redirects to /login if unauthenticated, or to / if the role is not allowed.
 */
export const withPrivateRoute = (
  Layout: LayoutComponent,
  options: { allowedRoles: AuthRole[] }
) => {
  return async function GuardedLayout(props: LayoutProps) {
    await requirePrivateRole(options.allowedRoles);
    return <Layout {...props} />;
  };
};

/**
 * Wraps a public/auth layout (e.g. login, forgot-password).
 * Redirects to the role's home if the user is already logged in.
 */
export const withPublicRoute = (Layout: LayoutComponent) => {
  return async function GuardedLayout(props: LayoutProps) {
    await redirectIfAuthenticated();
    return <Layout {...props} />;
  };
};
