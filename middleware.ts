// middleware.ts – Bảo vệ route /admin bằng JWT token (Edge-compatible)
// Không dùng prisma/pg trong middleware vì Edge runtime không hỗ trợ
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const isAdminRoute =
    nextUrl.pathname.startsWith("/admin") ||
    nextUrl.pathname.startsWith("/api/admin");

  if (isAdminRoute) {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    });

    if (!token || token["role"] !== "ADMIN") {
      const loginUrl = new URL("/login", nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

