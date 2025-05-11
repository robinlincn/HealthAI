
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page will redirect to the SAAS admin dashboard or login page
export default function SaasRootPage() {
  const router = useRouter();

  useEffect(() => {
    // For now, directly redirect to SAAS admin dashboard.
    // Later, this can check auth state and redirect to /saas-admin/auth/login if not authenticated.
    router.replace('/saas-admin/dashboard'); // Updated to dashboard, login logic separate
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <p className="text-foreground">正在加载SAAS管理后台...</p>
      {/* You can add a spinner or loader component here */}
    </div>
  );
}
