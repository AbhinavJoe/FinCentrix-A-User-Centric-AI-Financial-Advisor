// import { NextResponse, type NextRequest } from "next/server";

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;

//   const isPublicPath = path === "/" || path === "/login" || path === "/forgotPassword";

//   const token = request.cookies.get("token")?.value || "";

//   if (isPublicPath && token) {
//     return NextResponse.redirect(new URL('/Dashboard', request.url))
//   }

//   if (!isPublicPath && !token) {
//     return NextResponse.redirect(new URL("/login", request.nextUrl));
//   }
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: ["/", "/home", "/login", "/Signup", "/summary"],
// };


//  ...................................Pradhuman Code Above and Below with Updated routes below
// import { NextResponse, type NextRequest } from "next/server";

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;

//   const isPublicPath = path === "/" || path === "/Login" || path === "/Signup";

//   const token = request.cookies.get("token")?.value || "";

//   if (isPublicPath && token) {
//     return NextResponse.redirect(new URL('/Disclaimer', request.url))
//   }

//   if (!isPublicPath && !token) {
//     return NextResponse.redirect(new URL("/Login", request.nextUrl));
//   }
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: ["/", "/Disclaimer", "/Dashboard", "/ChatPage", "/Signup"],
// };

import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths
  const isPublicPath = ["/", "/Login", "/Signup"].includes(path.toLowerCase());

  // Access token from cookies
  const token = request.cookies.get("token");

  // Redirect authenticated users away from public paths
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/Disclaimer', request.url));
  }

  // Redirect unauthenticated users to login from non-public paths
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.url));
    // return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Config to specify where middleware applies
export const config = {
  matcher: ["/", "/Disclaimer", "/Dashboard", "/Chatpage", "/Signup"],
};
