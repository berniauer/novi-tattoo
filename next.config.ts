import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output bundles everything needed into .next/standalone/
  // → single "node server.js" command, perfect for Docker
  output: "standalone",

  images: {
    // Allow Unsplash placeholder images (replace with your domain later)
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
