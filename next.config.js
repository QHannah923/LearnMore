/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com'],
  },
  experimental: {
    serverActions: true,
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config
  },
  // env: {
  //   POSTGRES_HOST: process.env.POSTGRES_HOST,
  //   POSTGRES_PORT: process.env.POSTGRES_PORT,
  //   POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
  //   POSTGRES_USER: process.env.POSTGRES_USER,
  //   POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  // },
};

module.exports = nextConfig;