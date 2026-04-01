// Roles from the login response: role is "ADMIN" or "OPERATOR" (uppercase from server)
// We normalise to lowercase for internal use.
export type AuthRole = "admin" | "operator";
