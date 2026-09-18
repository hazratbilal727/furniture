import { NextResponse } from "next/server";
import { authCookieName } from "../../../../lib/auth/config";
import { getAuthenticatedAdmin } from "../../../../lib/auth/request";

export async function POST() {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const response = NextResponse.json({ success: true });
  response.cookies.set({ name: authCookieName, value: "", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}