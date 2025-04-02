import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "runnix-africa.vercel.app",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "runnix-africa.vercel.app",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "runnix-africa",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "runnix-africa",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost:**",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
}

export default nextConfig
