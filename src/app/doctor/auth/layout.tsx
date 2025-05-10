
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI慢病管理 - 医生端认证',
  description: '医生登录AI慢病管理系统',
};

export default function DoctorAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Removed: bg-gradient-to-br from-primary/20 via-background to-accent/20
    // The login page itself will handle its background (e.g., full-screen image)
    <div className="flex items-center justify-center min-h-screen">
      {children}
    </div>
  );
}
