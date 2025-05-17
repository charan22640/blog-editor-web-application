import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUser } from './lib/auth';

// Define which paths should be protected by the middleware
export const config = {
  matcher: [
    // Only match specific paths that need protection
    '/blog/:path*',
    '/api/blogs/:path*',
  ]
};

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(ip: string, limit = 100, window = 60000): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (now - record.timestamp > window) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (record.count >= limit) {
    return true;
  }

  record.count++;
  return false;
}

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;
    const ip = request.ip || 'unknown';

    // Rate limiting check
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const user = await getUser(request);
    
    if (!user) {
      if (path.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Authentication required' },
          { status: 401, headers: { 'WWW-Authenticate': 'Bearer' } }
        );
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }

    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
