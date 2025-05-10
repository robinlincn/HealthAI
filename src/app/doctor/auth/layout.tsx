
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
    // The login page itself now handles its background (e.g., full-screen image)
    // This layout ensures children are centered if they don't take full screen,
    // but the login page will override this for its specific layout.
    <div className="flex items-center justify-center min-h-screen w-full">
      {children}
    </div>
  );
}
