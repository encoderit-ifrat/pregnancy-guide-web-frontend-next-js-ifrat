import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: isProduction
      ? "__Secure-authjs.session-token"
      : "authjs.session-token",
  });

  const { pathname } = req.nextUrl;

  // Check if current route is login or signup
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/sign-up" ||
    pathname === "/forgot-password" ||
    pathname === "/";

  // If user is authenticated and trying to access auth pages, redirect away
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/pregnancy-overview", req.url));
  }

  // If user is not authenticated and on protected route, redirect to login
  if (!token && !isAuthPage) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/pregnancy-overview/:path*",
    "/checklists/:path*",
    "/profile/:path*",
    "/articles/:path*",
    "/weekly-question/:path*",
    "/change-password/:path*",
    "/login",
    "/sign-up",
    "/forgot-password",
    "/",
  ],
};
