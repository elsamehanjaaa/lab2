import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "pub-5260a756fae843f4a820feff9dc0ad6f.r2.dev",
    ],
  },
};

export default nextConfig;
