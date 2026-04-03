// app/api/admin/[...nextadmin]/route.ts
// next-admin v8 – API handler
import { createHandler } from "@premieroctet/next-admin/appHandler";
import prisma from "@/lib/prisma";
import { options } from "@/lib/next-admin-options";
import { auth } from "@/lib/auth";

const { run } = createHandler({
  apiBasePath: "/api/admin",
  prisma,
  options,
  onRequest: async (_req: Request) => {
    // Chỉ cho phép ADMIN gọi API admin
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});

export { run as GET, run as POST, run as PUT, run as DELETE };
