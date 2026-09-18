export const authCookieName = "muntazir_admin_session";
export const sessionDurationSeconds = 60 * 60 * 8;

export function getAdminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL ?? "admin@login.com").trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD ?? "admin123",
  };
}

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET must be configured in production.");
  }
  return "local-development-auth-secret-change-me";
}