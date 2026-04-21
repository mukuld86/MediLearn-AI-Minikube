import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// IMPORTANT: use require for shared JS module
const { trackUser } = require('./lib/metrics');

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore unnecessary routes
  if (
    pathname.startsWith('/api/metrics') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Use IP as user identifier
  const userId =
    request.headers.get('x-forwarded-for') ||
    request.ip ||
    'unknown';

  if (userId) {
    trackUser(userId);
  }

  return NextResponse.next();
}
