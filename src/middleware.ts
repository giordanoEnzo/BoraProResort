
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Protect all routes under /admin except the login page itself
    if (path.startsWith('/admin') && path !== '/admin') {
        const session = request.cookies.get('admin_session')
        if (!session) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: '/admin/:path*',
}
