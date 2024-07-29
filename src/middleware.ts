// import { NextResponse, type NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname.toLowerCase();

//   const isPublicPath = ["/", "/authentication", "/authentication/login", "/authentication/signup"].includes(path);

//   const token = request.cookies.get("token");

//   if (isPublicPath && token) {
//     return NextResponse.redirect(new URL('/Disclaimer', request.url));
//   }

//   if (!isPublicPath && !token) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }
// }

// export const config = {
//   matcher: ["/", "/Disclaimer", "/Dashboard", "/ChatPage", "/Signup", "/Authentication/:path*"],
// };

import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname.toLowerCase();
  const isPublicPath = ["/", "/authentication", "/authentication/login", "/authentication/signup"].includes(path);
  const token = request.cookies.get("token");

  // If user is logged in and trying to access public paths, redirect to Dashboard or a default logged-in page.
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/Dashboard', request.url));
  }

  // If user is not logged in and trying to access protected paths, redirect to login or home.
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/Disclaimer", "/Dashboard", "/ChatPage", "/Signup", "/Authentication/:path*"],
};
