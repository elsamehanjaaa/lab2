// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get("access_token")?.value;

  // Redirect logged-in users away from the login page
  if (token && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect non-authenticated users trying to access protected routes
  if (!token && request.nextUrl.pathname.startsWith("/protected")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configuring middleware to run on specific routes
export const config = {
  matcher: ["/login", "/protected/:path*"],
};
