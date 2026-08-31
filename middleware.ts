/**
 * Next.js Middleware
 *
 * Centralized middleware that runs on every matched request:
 * 1. Admin Route Protection — validates admin_session cookie on /api/admin/*
 * 2. Rate Limiting — sliding window limiter on sensitive endpoints
 * 3. Security Headers — CSP, HSTS, X-Frame-Options, etc. on all responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { loginLimiter, formLimiter, apiLimiter } from '@/lib/rate-limit';

/* ================================================================
   Helper: Get client IP from request
   ================================================================ */
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

/* ================================================================
   Helper: Set security headers on a response
   ================================================================ */
function setSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  );

  // Prevent MIME-type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // HSTS — enforce HTTPS for 1 year + includeSubDomains
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload',
  );

  // Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Restrict browser features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), payment=()',
  );

  // Prevent XSS in older browsers
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

/* ================================================================
   Helper: Rate limit check
   ================================================================ */
function rateLimitResponse(resetMs: number): NextResponse {
  const response = NextResponse.json(
    { error: 'Too many requests. Please try again later.', success: false },
    { status: 429 },
  );
  response.headers.set('Retry-After', String(Math.ceil(resetMs / 1000)));
  return setSecurityHeaders(response);
}

/* ================================================================
   Main Middleware
   ================================================================ */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIp = getClientIp(request);

  // ----- 1. Admin Route Protection (except login) -----
  const isAdminRoute = pathname.startsWith('/api/admin');
  const isLoginRoute = pathname === '/api/admin/login';

  if (isAdminRoute && !isLoginRoute) {
    const session = request.cookies.get('admin_session');
    if (!session?.value) {
      const res = NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 },
      );
      return setSecurityHeaders(res);
    }
  }

  // ----- 2. Rate Limiting -----
  if (isLoginRoute && request.method === 'POST') {
    const result = loginLimiter.check(clientIp);
    if (!result.allowed) return rateLimitResponse(result.resetMs);
  }

  if (pathname === '/api/bookings' && request.method === 'POST') {
    const result = formLimiter.check(clientIp);
    if (!result.allowed) return rateLimitResponse(result.resetMs);
  }

  if (pathname === '/api/contact' && request.method === 'POST') {
    const result = formLimiter.check(clientIp);
    if (!result.allowed) return rateLimitResponse(result.resetMs);
  }

  // General API rate limiting
  if (pathname.startsWith('/api/')) {
    const result = apiLimiter.check(clientIp);
    if (!result.allowed) return rateLimitResponse(result.resetMs);
  }

  // ----- 3. Security Headers -----
  const response = NextResponse.next();
  return setSecurityHeaders(response);
}

/* ================================================================
   Matcher — run on API routes and pages, skip static assets
   ================================================================ */
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Public assets (images, fonts)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)).*)',
  ],
};
