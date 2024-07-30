import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname.toLowerCase();

  // Define public paths in lowercase to ensure case-insensitive comparison
  const isPublicPath = ["/", "/authentication", "/authentication/login", "/authentication/signup"].includes(path);

  // Access token from cookies
  const token = request.cookies.get("token");

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/Disclaimer', request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// Config to specify where middleware applies, with capitalized paths as per your project structure
export const config = {
  matcher: ["/", "/Disclaimer", "/Dashboard", "/ChatPage", "/Signup", "/Authentication/:path*"],
};