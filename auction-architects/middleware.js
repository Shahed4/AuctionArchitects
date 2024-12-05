import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow `/api/auth/*` routes to bypass middleware
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Add middleware logic for protected routes here
  return NextResponse.next();
}

export const config = {
  matcher: ["/sell/:path*", "/checkout/:path*", "/profile"], // Protect these routes
};
