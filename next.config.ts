// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // El lint corre en tu CI; en build de producción no bloquea el deploy
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
