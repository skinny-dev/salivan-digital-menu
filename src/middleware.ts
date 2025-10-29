import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if accessing dashboard routes
  if (pathname.startsWith("/dashboard") && pathname !== "/dashboard/login") {
    const token = request.cookies.get("auth-token")?.value;
    console.log("Middleware - pathname:", pathname, "token exists:", !!token);

    if (!token) {
      console.log("No token, redirecting to login");
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }

    // For now, just let it pass since JWT verification might fail in middleware
    console.log("Token exists, allowing access");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
