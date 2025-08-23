/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com", pathname: "/**" },
      { protocol: "https", hostname: "images.clerk.dev", pathname: "/**" },
    ],
  },
 webpack: (config, { isServer }) => {
    if (!config.resolve) return config;

    // บอก Webpack อย่าสแกน path ที่ lock หรือเป็น system
    config.resolve.modules = [
      path.resolve(__dirname, "node_modules"), // ใช้ node_modules ของโปรเจกต์
    ];

    return config;
  },
};

export default nextConfig;
