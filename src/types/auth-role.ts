// Roles from the login response: role is "SUPER_ADMIN" or "ADMIN" or "OPERATOR" (uppercase from server)
// We normalise to lowercase for internal use.
export type AuthRole = "super_admin" | "admin" | "operator";
