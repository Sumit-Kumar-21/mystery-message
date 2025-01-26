import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request });
    console.log("🚀 ~ middleware ~ token:", token)
    const url = request.nextUrl;

    const tryToAccess = (path: string) =>{
        return url.pathname.startsWith(path)
    }

    if (
        token && (
            tryToAccess('/sign-in') ||
            tryToAccess('/sign-up') ||
            tryToAccess('/verify') ||
            tryToAccess('/')
        )
    ) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if(!token && tryToAccess('/dashboard') ) return NextResponse.redirect(new URL('/sign-in', request.url));

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ],
}

export { default } from "next-auth/middleware"