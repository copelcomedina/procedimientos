import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/procedimientos",
  output: "standalone",
  images: {
    unoptimized: true,
  },
};
export default nextConfig;
