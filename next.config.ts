
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
    // For development, proxy /vue-patient-app to the Vue dev server
    // The Vue dev server should be running (e.g., via `npm run dev:vue`)
    const vueDevServerUrl = process.env.VUE_DEV_SERVER_URL || 'http://127.0.0.1:9003';
    
    return [
      {
        source: '/vue-patient-app/:path*',
        // The destination must also include the base path if the Vue app is configured with one.
        // e.g., if Vue's base is '/vue-patient-app/', then Next.js needs to proxy to 'http://localhost:9003/vue-patient-app/:path*'
        destination: `${vueDevServerUrl}/vue-patient-app/:path*`,
      },
    ];
  },
};

export default nextConfig;
