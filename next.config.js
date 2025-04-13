module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      }
    ],
    unoptimized: process.env.NODE_ENV === 'development'
  }
}