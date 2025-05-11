'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page will redirect to the admin dashboard or login page
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // For now, directly redirect to admin dashboard.
    // Later, this can check auth state and redirect to /admin/auth/login if not authenticated.
    router.replace('/admin'); 
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <p className="text-foreground">正在加载管理后台...</p>
      {/* You can add a spinner or loader component here */}
    </div>
  );
}
