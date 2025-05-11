
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
    // Ensure VUE_DEV_SERVER_URL if set, does not have a trailing slash for consistent URL construction.
    let vueDevServerUrl = (process.env.VUE_DEV_SERVER_URL || 'http://localhost:9003').replace(/\/$/, "");


    try {
      // Validate if vueDevServerUrl is a proper URL structure.
      // new URL() will throw an error if the URL is malformed.
      new URL(vueDevServerUrl);
    } catch (e) {
      console.error(
        `[Next.js Config] Invalid VUE_DEV_SERVER_URL: "${process.env.VUE_DEV_SERVER_URL}". ` +
        `Error: ${(e as Error).message}. ` +
        `Defaulting to 'http://localhost:9003'. ` +
        `Please ensure VUE_DEV_SERVER_URL is a complete and valid URL (e.g., http://localhost:9003).`
      );
      vueDevServerUrl = 'http://localhost:9003'; // Default without trailing slash
    }
    
    return [
      {
        source: '/vue-patient-app/:path*',
        // The destination path combines the sanitized vueDevServerUrl with the expected base path of the Vue app.
        destination: `${vueDevServerUrl}/vue-patient-app/:path*`,
      },
    ];
  },
};

export default nextConfig;

