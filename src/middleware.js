import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export default function middleware(req) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value;

  const isPublicPath = path === "/login" || path === "/signup";

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const role = decoded.role;

      if (isPublicPath) {
        if (role === "admin") {
          return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
        } else {
          return NextResponse.redirect(new URL("/", req.nextUrl));
        }
      }

      if (path.startsWith("/dashboard") && role !== "admin") {
        return NextResponse.redirect(new URL("/", req.nextUrl));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
