import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(request: NextRequest) {
  // Explicitly handle secure cookie logic for Vercel deployments
  // This helps when NEXTAUTH_URL might not be perfectly propagated to Edge Runtime
  const secureCookie = process.env.NODE_ENV === "production";

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie,
  });

  const isLoggedIn = !!token;
  const role = token?.role as "admin" | "student" | undefined;

  const { pathname } = request.nextUrl;

  // Allow login page to be accessed by all
  if (pathname.startsWith("/login")) {
    if (isLoggedIn) {
      // If already logged in, redirect based on role
      return NextResponse.redirect(
        new URL(role === "admin" ? "/admin" : "/dashboard", request.url)
      );
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect profile edit routes
  if (pathname.startsWith("/profile/edit") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};