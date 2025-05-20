/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      }
    ],
  },
  async rewrites() {
    let vueDevServerUrl = (process.env.VUE_DEV_SERVER_URL || 'http://localhost:9003').replace(/\/$/, "");
    let vueDoctorDevServerUrl = (process.env.VUE_DOCTOR_DEV_SERVER_URL || 'http://localhost:9004').replace(/\/$/, "");
    // SAAS Admin is now part of the main Next.js app, so no rewrite for it unless deployed separately.

    try {
      new URL(vueDevServerUrl);
    } catch (e) {
      console.error(
        `[Next.js Config] Invalid VUE_DEV_SERVER_URL: "${process.env.VUE_DEV_SERVER_URL}". ` +
        `Error: ${(e instanceof Error ? e.message : String(e))}. ` +
        `Defaulting to 'http://localhost:9003'.`
      );
      vueDevServerUrl = 'http://localhost:9003';
    }

    try {
      new URL(vueDoctorDevServerUrl);
    } catch (e) {
      console.error(
        `[Next.js Config] Invalid VUE_DOCTOR_DEV_SERVER_URL: "${process.env.VUE_DOCTOR_DEV_SERVER_URL}". ` +
        `Error: ${(e instanceof Error ? e.message : String(e))}. ` +
        `Defaulting to 'http://localhost:9004'.`
      );
      vueDoctorDevServerUrl = 'http://localhost:9004';
    }
    
    return [
      // Vue Patient App rewrites
      {
        source: '/vue-patient-app',
        destination: `${vueDevServerUrl}/vue-patient-app/`, 
      },
      {
        source: '/vue-patient-app/:path*',
        destination: `${vueDevServerUrl}/vue-patient-app/:path*`,
      },
      // Vue Doctor App rewrites
      {
        source: '/vue-doctor-app',
        destination: `${vueDoctorDevServerUrl}/vue-doctor-app/`,
      },
      {
        source: '/vue-doctor-app/:path*',
        destination: `${vueDoctorDevServerUrl}/vue-doctor-app/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
