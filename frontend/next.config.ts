import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/:path*', // Proxy backend API requests
      },
    ];
  },
  images: {
    domains: ['berry.reactbd.com',"res.cloudinary.com"],
  },
};

export default nextConfig;
