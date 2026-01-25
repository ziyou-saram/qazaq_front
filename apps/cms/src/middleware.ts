import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')
    const isCMSPage = request.nextUrl.pathname.startsWith('/cms')

    // If trying to access CMS pages without token
    if (isCMSPage && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If trying to access auth pages WITH token
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/cms/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/cms/:path*', '/login', '/signup'],
}
