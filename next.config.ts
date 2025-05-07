import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT,
    CONTENTFUL_WEBHOOK_SECRET: process.env.CONTENTFUL_WEBHOOK_SECRET,
    CONTENTFUL_OLD_PREVIEW_SECRET: process.env.CONTENTFUL_OLD_PREVIEW_SECRET,
    CONTENTFUL_PREVIEW_SECRET: process.env.CONTENTFUL_PREVIEW_SECRET,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        pathname: "/**",
      },
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
