// lib/auth.config.ts – Edge-safe NextAuth config (no prisma / bcrypt imports)
// Dùng riêng cho middleware (Edge Runtime). Chứa callbacks, session, pages.
// Không import prisma hoặc bcryptjs để tương thích Edge Runtime trên Vercel.
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // Providers chỉ khai báo trong lib/auth.ts (Node runtime)
  session: { strategy: "jwt" as const },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session({ session, token }: any) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.role = token.role;
      return session;
    },
  },
  pages: { signIn: "/login", error: "/login" },
} satisfies NextAuthConfig;
