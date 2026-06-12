import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
