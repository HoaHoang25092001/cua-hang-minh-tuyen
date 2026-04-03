// middleware.ts – Auth.js v5 Edge-compatible middleware
// Dùng split-config pattern: NextAuth(authConfig) chỉ dùng lib/auth.config.ts
// (không có prisma/bcrypt) để an toàn với Edge Runtime trên Vercel.
//
// Lý do KHÔNG dùng getToken() từ next-auth/jwt:
//   Auth.js v5 mã hóa JWT bằng JWE (encrypted), còn getToken() của v4 chỉ
//   đọc được JWT ký (JWS). Kết quả: getToken() luôn trả về null trên Vercel
//   → middleware redirect về /login dù đã đăng nhập → admin không vào được.
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  const isAdminRoute =
    nextUrl.pathname.startsWith("/admin") ||
    nextUrl.pathname.startsWith("/api/admin");

  if (isAdminRoute) {
    // req.auth được NextAuth tự giải mã từ cookie — hoạt động đúng với JWE
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (req.auth?.user as any)?.role;
    if (!req.auth || role !== "ADMIN") {
      const loginUrl = new URL("/login", nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

