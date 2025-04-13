import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTokenFromRequest, isAuthenticated } from "./lib/auth/utils";

export async function middleware(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const isAuth = token ? await isAuthenticated(request) : false;
  
  // Clone request headers to add auth state
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-auth-state', isAuth ? 'authenticated' : 'unauthenticated');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // Exclude API routes and static assets
    '/login',
    '/register'
  ]
};
