
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  output: 'standalone', // Optional, if you're building a Docker image for production
};

module.exports = nextConfig;
