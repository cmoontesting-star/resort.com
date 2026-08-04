import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
    const path = request.nextUrl.pathname;
    console.log("middleware path:", path);

    const isAdminPath = path.startsWith("/admin");

    if (isAdminPath) {
        // Retrieve admin token
        const adminToken = await getToken({
            req: request,
            secret: process.env.SECRET_KEY,
            cookieName: "admin-auth.session-token"
        }) || await getToken({
            req: request,
            secret: process.env.SECRET_KEY,
            cookieName: "__Secure-admin-auth.session-token"
        });

        console.log("Admin token:", adminToken);

        const isAdminLoginPath = path === "/admin";

        if (isAdminLoginPath) {
            // If admin is logged in, redirect them to dashboard
            if (adminToken && ["superadmin", "admin", "subadmin"].includes(adminToken.role)) {
                return NextResponse.redirect(new URL("/admin/dashboard", request.url));
            }
            return NextResponse.next();
        } else {
            // For any other admin path, if not logged in, redirect to /admin (login)
            if (!adminToken || !["superadmin", "admin", "subadmin"].includes(adminToken.role)) {
                return NextResponse.redirect(new URL("/admin", request.url));
            }
            return NextResponse.next();
        }
    } else {
        // Retrieve user token
        const userToken = await getToken({
            req: request,
            secret: process.env.SECRET_KEY,
            cookieName: "user-auth.session-token"
        }) || await getToken({
            req: request,
            secret: process.env.SECRET_KEY,
            cookieName: "__Secure-user-auth.session-token"
        });

        console.log("User token:", userToken);

        const isPublicUserPath = ["/login", "/register",].includes(path);

        if (isPublicUserPath) {
            // If user is logged in, redirect them to home page
            if (userToken) {
                return NextResponse.redirect(new URL("/", request.url));
            }
            return NextResponse.next();
        }

        // For other protected user paths
        const isProtectedUserPath = ["/bookings", "/checkout", "/booking"].some(prefix => path.startsWith(prefix));
        if (isProtectedUserPath && !userToken) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", request.url);
            return NextResponse.redirect(loginUrl);
        }

        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/bookings/:path*",
        "/checkout/:path*",
        "/booking/:path*",
        // "/reviews/:path*",
        // "/users/:path*",
        "/login",
        "/register",
    ],
};
