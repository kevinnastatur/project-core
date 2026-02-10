import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "/id/warranty";

export function proxy(request: NextRequest) {
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

  const token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("role")?.value;

  if (!token || !role) {
    return NextResponse.redirect(
      new URL(`${BASE_PATH}/auth/login`, request.url)
    );
  }

  // CUSTOMER
  if (role === "customer") {
    if (!pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(
        new URL(`${BASE_PATH}/dashboard/overview`, request.url)
      );
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
