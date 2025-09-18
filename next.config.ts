// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",            
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    optimizePackageImports: ['tailwindcss'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
