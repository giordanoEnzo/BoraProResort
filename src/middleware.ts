
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { MAINTENANCE_MODE } from './lib/constants'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const session = request.cookies.get('admin_session')
    const isAdmin = session?.value === 'authenticated'

    // 1. Allow access to admin login page always
    if (path === '/admin') {
        return NextResponse.next()
    }

    // 2. Protect all routes under /admin
    if (path.startsWith('/admin/')) {
        if (!isAdmin) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
        return NextResponse.next()
    }

    // 3. Global Maintenance Mode Logic
    // Only applies to non-admin users on public pages
    if (MAINTENANCE_MODE && !isAdmin) {
        // Redirect any public page to home if it's not home already
        // This ensures the user sees the MaintenanceNotice on the home page
        if (path !== '/' && !path.startsWith('/api') && !path.startsWith('/_next') && !path.includes('.')) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    // Matcher simplified to run on most paths but exclude static assets
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
