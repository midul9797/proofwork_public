import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@proofwork/shared", "@proofwork/db"],
};

export default nextConfig;
