import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const session = await auth()
    const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
    const isLoginPage = request.nextUrl.pathname === "/admin/login"

    // Redirect to login if accessing admin routes without authentication
    if (isAdminRoute && !isLoginPage && !session) {
        return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Redirect to dashboard if already logged in and trying to access login page
    if (isLoginPage && session) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*"],
}
