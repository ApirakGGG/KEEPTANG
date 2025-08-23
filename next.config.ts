import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
       remotePatterns: [
    { protocol: 'https', hostname: 'img.clerk.com', pathname: '/**' },
    { protocol: 'https', hostname: 'images.clerk.dev', pathname: '/**' }
  ],
    }
};

export default nextConfig;
