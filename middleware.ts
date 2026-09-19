import { NextRequest, NextResponse } from "next/server";
import { authCookieName } from "./lib/auth/config";
import { readEdgeSessionToken } from "./lib/auth/edge-session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await readEdgeSessionToken(
    request.cookies.get(authCookieName)?.value,
  );
  const isLoginPage = pathname === "/admin/login";

  if (pathname.startsWith("/admin") && isLoginPage && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (pathname.startsWith("/admin") && !isLoginPage && !session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (
    pathname.startsWith("/api/auth/") &&
    pathname !== "/api/auth/login" &&
    !session
  ) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/auth/:path*"],
};
