'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SystemMonitoringRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first relevant sub-page, e.g., external system status
    router.replace('/admin/system-monitoring/external-system-status');
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center">
      <p>正在跳转到系统监控...</p>
    </div>
  );
}
