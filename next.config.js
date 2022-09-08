/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["trade.mango.markets", "assets.website-files.com"],
  },
};

module.exports = nextConfig;
