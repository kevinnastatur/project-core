import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// BasePath for proxy deployment (must match next.config.ts)
const BASE_PATH = process.env.NODE_ENV === 'production' ? "/id/warranty" : "";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Skip authentication in development mode
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("role")?.value;

  if (!token || !role) {
    return NextResponse.redirect(new URL(`${BASE_PATH}/auth/login`, request.url));
  }

  // CUSTOMER
  if (role === "customer") {
    if (!pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL(`${BASE_PATH}/dashboard/overview`, request.url));
    }
  }

  // PRINCIPAL / ADMIN
  if (role === "principal") {
    if (!pathname.startsWith("/admin")) {
      return NextResponse.redirect(
        new URL(`${BASE_PATH}/admin/dashboard/overview`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};


// iki gawe middleware ngatur halaman per role dan authentication