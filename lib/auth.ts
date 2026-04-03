// lib/auth.ts – Auth.js v5 full config (Node runtime only – có prisma + bcryptjs)
// Callbacks, session strategy, và pages được chia sẻ từ lib/auth.config.ts
// để middleware (Edge) có thể dùng cùng cấu hình mà không import Node-only deps.
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { authConfig } from "./auth.config";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      name?: string | null;
      role: "ADMIN" | "CUSTOMER";
    };
  }
  interface User {
    id?: string;
    username: string;
    name?: string | null;
    role: "ADMIN" | "CUSTOMER";
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Ten dang nhap", type: "text" },
        password: { label: "Mat khau", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { username: credentials.username as string },
        });
        if (!user) return null;
        const ok = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!ok) return null;
        return {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
