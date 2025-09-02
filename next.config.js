/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Clerk configuration
  publicRuntimeConfig: {
    clerkFrontendApi: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API,
  },
};

module.exports = nextConfig;
