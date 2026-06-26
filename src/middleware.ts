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
    pathname === "/logga-in" ||
    pathname === "/skapa-konto" ||
    pathname === "/glomt-losenord" ||
    pathname === "/";

  // Define public routes - no auth needed
  const publicRoutes = ["/inbjudningar/rsvp", "/onskelistor/delad"];

  const isPublicPage = publicRoutes.some((route) => pathname.startsWith(route));

  // If user is authenticated and trying to access auth pages, redirect away
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/gravid/vecka", req.url));
  }

  // If user is not authenticated and on protected route, redirect to login
  if (!token && !isAuthPage && !isPublicPage) {
    const loginUrl = new URL("/logga-in", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/gravid/:path*",
    "/checklistor/:path*",
    "/min-profil/:path*",
    "/veckans-fraga/:path*",
    "/change-password/:path*",
    "/inbjudningar/:path*",
    "/onskelistor/:path*",
    "/sparkraknare/:path*",
    "/varkraknare/:path*",
    "/logga-in",
    "/skapa-konto",
    "/glomt-losenord",
  ],
};
