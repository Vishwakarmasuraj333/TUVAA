import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken, AUTH_COOKIE_NAME } from './lib/auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignore non-admin routes and static assets
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow unrestricted access to the login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const session = await verifyToken(token)

  if (!session) {
    // Invalid or expired token
    const response = NextResponse.redirect(new URL('/admin/login', request.url))
    response.cookies.delete(AUTH_COOKIE_NAME)
    return response
  }

  // Token is valid, proceed
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
