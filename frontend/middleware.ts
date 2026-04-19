import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Get the token from cookies
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 2. Define your path categories
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isPublicPage = pathname === '/' || pathname.startsWith('/_next') || pathname.includes('/api');

  // Logic 1: If logged in and trying to access Login/Signup, redirect to Dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/note-books', request.url));
  }

  // Logic 2: If NOT logged in and trying to access protected routes
  // We exclude auth pages, the landing page, and internal Next.js files
  if (!token && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// 3. Configure which paths this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};