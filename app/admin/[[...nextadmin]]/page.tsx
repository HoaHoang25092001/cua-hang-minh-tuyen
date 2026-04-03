// app/admin/[[...nextadmin]]/page.tsx
// next-admin v8 – App Router page
import { NextAdmin } from "@premieroctet/next-admin/adapters/next";
import type { AdminComponentProps, PrismaClient } from "@premieroctet/next-admin";
import { getNextAdminProps } from "@premieroctet/next-admin/appRouter";

import prisma from "@/lib/prisma";
import { options } from "@/lib/next-admin-options";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarToggle } from "@/components/admin/sidebar-toggle";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

// Force dynamic rendering để search params luôn được xử lý mới nhất
export const dynamic = "force-dynamic";

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ nextadmin?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Bảo vệ route: chỉ ADMIN mới được vào
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const props = await getNextAdminProps({
    params: resolvedParams.nextadmin,
    searchParams: resolvedSearchParams,
    basePath: "/admin",
    apiBasePath: "/api/admin",
    prisma: prisma as unknown as PrismaClient,
    options,
  });

  return (
    <>
      <SidebarToggle />
      <NextAdmin
        {...(props as AdminComponentProps)}
        dashboard={<AdminDashboard />}
        user={{
          data: {
            name: session.user?.name ?? session.user?.username ?? "Admin",
          },
          logout: "/api/auth/signout",
        }}
      />
    </>
  );
}
