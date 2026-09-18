import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { authCookieName, getAdminCredentials, sessionDurationSeconds } from "../../../../lib/auth/config";
import { createSessionToken } from "../../../../lib/auth/session";

function hash(value: string) {
  return createHash("sha256").update(value).digest();
}

function matchesSecret(input: string, expected: string) {
  const inputHash = hash(input);
  const expectedHash = hash(expected);
  return timingSafeEqual(inputHash, expectedHash);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = typeof (body as { email?: unknown })?.email === "string" ? (body as { email: string }).email.trim().toLowerCase() : "";
  const password = typeof (body as { password?: unknown })?.password === "string" ? (body as { password: string }).password : "";
  if (!email || !password || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  try {
    const credentials = getAdminCredentials();
    if (email !== credentials.email || !matchesSecret(password, credentials.password)) {
      return NextResponse.json({ error: "The email or password is incorrect." }, { status: 401 });
    }

    const response = NextResponse.json({ admin: { email: credentials.email } });
    response.cookies.set({
      name: authCookieName,
      value: createSessionToken(credentials.email),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: sessionDurationSeconds,
    });
    return response;
  } catch (error) {
    console.error("Admin login is not configured correctly.", error);
    return NextResponse.json(
      { error: "Admin login is not configured on this deployment." },
      { status: 500 },
    );
  }
}