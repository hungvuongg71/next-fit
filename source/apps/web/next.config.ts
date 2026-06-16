import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/next-fit",
  assetPrefix: "/next-fit/",
};

export default nextConfig;
