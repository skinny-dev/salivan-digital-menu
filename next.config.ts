import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow loading images from any external URL
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "*",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
