
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SAAS Admin - AI慢病管理系统',
  description: 'SAAS Administration Panel for AI Chronic Disease Management System',
};

export default function SaasAdminRootLayout({ children }: { children: ReactNode }) {
  // This layout can be very simple, or you can add specific SAAS admin global styles/providers here
  // For now, it just passes children through. It will use the main app's global styles.
  return <>{children}</>;
}
