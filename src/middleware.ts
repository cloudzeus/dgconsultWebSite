import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    // Only run for /admin routes
    if (pathname.startsWith("/admin")) {
        const isLoginPage = pathname === "/admin/login"

        // If NOT logged in and trying to access admin pages (except login)
        if (!isLoggedIn && !isLoginPage) {
            return NextResponse.redirect(new URL("/admin/login", req.url))
        }

        // If LOGGED IN and trying to access login page
        if (isLoggedIn && isLoginPage) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/admin/:path*"],
}
