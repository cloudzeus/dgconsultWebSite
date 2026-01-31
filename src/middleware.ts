import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")
    const isLoginPage = req.nextUrl.pathname === "/admin/login"

    // 1. If looking at login page and logged in -> Redirect to dashboard
    if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/admin/dashboard", req.nextUrl))
    }

    // 2. If looking at other admin pages (not login) and NOT logged in -> Redirect to login
    if (isOnAdmin && !isLoginPage && !isLoggedIn) {
        return Response.redirect(new URL("/admin/login", req.nextUrl))
    }
})

export const config = {
    matcher: ["/admin/:path*"],
}
