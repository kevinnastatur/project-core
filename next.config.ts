import type { NextConfig } from "next";

// Cache invalidation: 2026-01-30T12:50:00Z
const nextConfig: NextConfig = {
  basePath: "/id/warranty",
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_BASE_IMAGE_URL || "localhost",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
