// lib/auth.ts - Auth.js v5 Credentials provider
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

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

const config: NextAuthConfig = {
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
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token["id"] = user.id as string;
        token["username"] = user.username;
        token["role"] = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token["id"] as string;
      session.user.username = token["username"] as string;
      session.user.role = token["role"] as "ADMIN" | "CUSTOMER";
      return session;
    },
  },
  pages: { signIn: "/login", error: "/login" },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
