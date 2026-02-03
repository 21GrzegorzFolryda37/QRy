import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Exclude native/WASM modules from Turbopack bundling
  serverExternalPackages: [
    '@qr-platform/qr-code.js',
    '@resvg/resvg-js',
    '@undecaf/zbar-wasm',
    'image-js',
  ],
};

export default nextConfig;
