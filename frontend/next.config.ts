/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://localhost:1111/api/v1/:path*', // <-- add :path* to match dynamic paths
      },
    ];
  },

  // Any other Next.js config options here
};

module.exports = nextConfig;
