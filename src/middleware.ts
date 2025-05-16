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

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;
    const user = await getUser(request);
    
    if (!user) {
      if (path.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}
