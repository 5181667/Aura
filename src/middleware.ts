import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const isAdmin = token?.role === "ADMIN"
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

        // Protect admin routes
        if (isAdminRoute && !isAdmin) {
            return NextResponse.redirect(new URL("/dashboard", req.url))
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const pathname = req.nextUrl.pathname

                // Public routes
                if (pathname === "/" || pathname.startsWith("/login") ||
                    pathname.startsWith("/register") || pathname.startsWith("/tests") ||
                    pathname.startsWith("/share") || pathname.startsWith("/results")) {
                    return true
                }

                // Protected routes require authentication
                return !!token
            },
        },
    }
)

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/api/user/:path*",
        "/api/friends/:path*",
        "/results/:path*",
    ]
}
