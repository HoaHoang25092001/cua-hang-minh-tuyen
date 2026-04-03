import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Prisma 7 + next-admin v8 compatibility:
  // next-admin imports from "@prisma/client/runtime/library" which was removed in Prisma 7
  turbopack: {
    resolveAlias: {
      "@prisma/client/runtime/library": "./lib/prisma-stub/library.js",
    },
  },
  // Webpack fallback (for `NODE_ENV` based switches or non-Turbopack CI builds)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@prisma/client/runtime/library": path.resolve(
        __dirname,
        "lib/prisma-stub/library.js"
      ),
    };
    return config;
  },
  // Allow images from UploadThing and common CDNs
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "**.ufs.sh",
      },
    ],
  },
};

export default nextConfig;



