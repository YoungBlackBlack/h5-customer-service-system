/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },
  // 在构建时跳过数据库连接检查
  env: {
    SKIP_ENV_VALIDATION: 'true',
  },
}

module.exports = nextConfig