import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;

  // Get the pathname of the request
  const path = req.nextUrl.pathname;

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard"];

  // Check if the path starts with any of the protected routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  // Redirect logic
  if (!isAuthenticated && isProtectedRoute) {
    // Redirect to login page if trying to access protected route without authentication
    const callbackUrl = encodeURIComponent(req.url);
    return NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  // Mentor-only routes
  if (path.startsWith("/dashboard/mentor") && token?.role !== "mentor") {
    // Redirect to mentee dashboard if not a mentor
    return NextResponse.redirect(new URL("/dashboard/mentee", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/mentor/:path*"],
};
