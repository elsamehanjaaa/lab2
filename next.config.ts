import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "pub-5260a756fae843f4a820feff9dc0ad6f.r2.dev",
      "https://98a286812cb76663dd817af7ef0e084d.r2.cloudflarestorage.com"
    ],
  },
};

export default nextConfig;
