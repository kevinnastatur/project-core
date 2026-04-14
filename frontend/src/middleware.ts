import { NextRequest, NextResponse } from 'next/server';

const ACCESS_TOKEN_COOKIE = process.env.ACCESS_TOKEN_COOKIE_NAME || 'hr_access_token';

// Routes that require authentication
const protectedRoutes = ['/profile', '/users', '/roles', '/b2b'];
const adminRoutes = ['/users', '/roles'];
const b2bRoutes = ['/b2b'];
const authRoutes = ['/login', '/admin/login', '/b2b/login', '/register', '/forgot-password', '/verify-email'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  // If authenticated user tries to access auth pages, redirect to profile
  if (authRoutes.some((route) => pathname === route || pathname.startsWith(route + '/')) && accessToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // Check protected routes
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (isProtected && !accessToken) {
    // Determine which login page to redirect to
    const isAdmin = adminRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + '/')
    );
    const isB2B = b2bRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + '/')
    );

    let loginUrl = '/login';
    if (isAdmin) loginUrl = '/admin/login';
    if (isB2B) loginUrl = '/b2b/login';

    const url = new URL(loginUrl, request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|bff/).*)',
  ],
};
