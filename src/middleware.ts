// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchUser } from "./utils/fetchUser";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const pathname = request.nextUrl.pathname;
  // Get the token from cookies

  const token = request.cookies.get("access_token")?.value;

  // Redirect logged-in users away from the login page
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect non-authenticated users trying to access protected routes
  if (!token && pathname.startsWith("/protected")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // if (
  //   url.pathname.split("/").length === 4 &&
  //   (url.pathname.startsWith("/course/") ||
  //     url.pathname.startsWith("/course/subscribe/"))
  // ) {
  //   const courseId = url.pathname.split("/")[3];

  //   try {
  //     const res = await fetch(`http://172.25.48.1:5000/courses/${courseId}`);
  //     if (res.status === 404) {
  //       url.pathname = "/course/not-found";
  //       return NextResponse.redirect(url);
  //     }
  //   } catch (err) {
  //     console.error("Middleware fetch error:", err);
  //   }
  // }
  // Allow the request to proceed
  return NextResponse.next();
}

// Configuring middleware to run on specific routes
export const config = {
  matcher: [
    "/login",
    "/protected/:path*",
    "/course/:path*",
    "/course/subscribe/:path*",
    "/learn/:slug*", // Run middleware for all course learn pages
  ],
};
