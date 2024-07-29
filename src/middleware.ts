import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store');
  const path = request.nextUrl.pathname.toLowerCase();

  const isPublicPath = ["/", "/authentication", "/authentication/login", "/authentication/signup"].includes(path);

  const token = request.cookies.get("token");

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/Disclaimer', request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/", "/Disclaimer", "/Dashboard", "/ChatPage", "/Signup", "/Authentication/:path*"],
};