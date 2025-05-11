import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/vue-patient-app/:path*',
        // Assuming the Vue app's dev server runs on port 9003
        destination: 'http://localhost:9003/:path*', 
      },
    ];
  },
};

export default nextConfig;
