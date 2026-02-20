// src/middleware.js
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;
    if (!token) {
        if (pathname.startsWith("/api/users")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/signin", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/api/users/:path*"],
};
