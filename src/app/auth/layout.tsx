
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI慢病管理 - 认证',
  description: '登录或注册AI慢病管理系统',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {children}
    </div>
  );
}
