import { cookies } from "next/headers";
import { authCookieName } from "./config";
import { readSessionToken } from "./session";

export async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();
  return readSessionToken(cookieStore.get(authCookieName)?.value);
}
