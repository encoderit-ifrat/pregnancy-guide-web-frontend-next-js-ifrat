import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encoder-test-vpn.space",
        pathname: "/**", // allows all image paths from this domain
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**", // allows all image paths from this domain
      },
    ],
  },
};

export default nextConfig;
