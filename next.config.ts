import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: `${process.env.NEXT_PUBLIC_HOST_NAME}`,
        port: "7000",
        pathname: "/*/**",
      },
      {
        protocol: "http",
        hostname: `${process.env.NEXT_PUBLIC_HOST_NAME}`,
        port: "7000",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: `${process.env.NEXT_PUBLIC_HOST_NAME}`,
        port: "",
        pathname: "/*/**",
      },
      {
        protocol: "https",
        hostname: `${process.env.NEXT_PUBLIC_HOST_NAME}`,
        port: "",
        pathname: "/*",
      },
    ],
  },
};

export default nextConfig;
