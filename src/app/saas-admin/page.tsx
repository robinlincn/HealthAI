'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page will redirect to the admin dashboard or login page
export default function SaasRootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main SAAS admin dashboard page within the (admin) group.
    router.replace('/saas-admin/(admin)'); 
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <p className="text-foreground">正在加载SAAS管理后台...</p>
      {/* You can add a spinner or loader component here */}
    </div>
  );
}
