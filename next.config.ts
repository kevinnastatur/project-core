import type { NextConfig } from "next";

// Cache invalidation: 2026-01-30T12:50:00Z
const nextConfig: NextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/id/warranty' : undefined, // penyebab e pin, routing e di paksa ada /id/warranty
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_BASE_IMAGE_URL || "localhost",
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



// sedangkan cara routing e next iku berdasarkan folder
// misal src/app/dashboard jadine localhost:3000/dashboard
