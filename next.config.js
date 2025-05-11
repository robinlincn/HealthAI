/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for highlighting potential problems
  swcMinify: true, // Enable SWC minifier for faster builds
  // output: 'standalone', // Uncomment if you plan to deploy to a Docker container or similar
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  async rewrites() {
    // For development, proxy /vue-patient-app to the Vue dev server
    // The Vue dev server should be running (e.g., via `npm run dev:vue`)
    // Ensure VUE_DEV_SERVER_URL if set, does not have a trailing slash for consistent URL construction.
    let vueDevServerUrl = (process.env.VUE_DEV_SERVER_URL || 'http://localhost:9003').replace(/\/$/, "");
    let saasAdminServerUrl = (process.env.SAAS_ADMIN_DEV_SERVER_URL || 'http://localhost:3000').replace(/\/$/, "");

    try {
      // Validate if vueDevServerUrl is a proper URL structure.
      new URL(vueDevServerUrl);
    } catch (e) {
      console.error(
        `[Next.js Config] Invalid VUE_DEV_SERVER_URL: "${process.env.VUE_DEV_SERVER_URL}". ` +
        `Error: ${(e instanceof Error ? e.message : String(e))}. ` +
        `Defaulting to 'http://localhost:9003'. ` +
        `Please ensure VUE_DEV_SERVER_URL is a complete and valid URL (e.g., http://localhost:9003).`
      );
      vueDevServerUrl = 'http://localhost:9003'; // Default without trailing slash
    }

    try {
      new URL(saasAdminServerUrl);
    } catch (e) {
       console.error(
        `[Next.js Config] Invalid SAAS_ADMIN_DEV_SERVER_URL: "${process.env.SAAS_ADMIN_DEV_SERVER_URL}". ` +
        `Error: ${(e instanceof Error ? e.message : String(e))}. ` +
        `Defaulting to 'http://localhost:3000'. ` +
        `Please ensure SAAS_ADMIN_DEV_SERVER_URL is a complete and valid URL (e.g., http://localhost:3000).`
      );
      saasAdminServerUrl = 'http://localhost:3000';
    }
    
    return [
      {
        source: '/saas-admin', // Matches /saas-admin (no trailing slash)
        destination: `${saasAdminServerUrl}/saas-admin/`, // Proxies to SAAS admin dev server with trailing slash
      },
      {
        source: '/saas-admin/:path*', // Matches /saas-admin/anything
        destination: `${saasAdminServerUrl}/saas-admin/:path*`, // Proxies to SAAS admin dev server
      },
      {
        source: '/vue-patient-app', // Matches /vue-patient-app (no trailing slash)
        destination: `${vueDevServerUrl}/vue-patient-app/`, // Proxies to Vue dev server base with trailing slash
      },
      {
        source: '/vue-patient-app/:path*', // Matches /vue-patient-app/anything
        destination: `${vueDevServerUrl}/vue-patient-app/:path*`, // Proxies to Vue dev server
      },
    ];
  },
};

module.exports = nextConfig;
