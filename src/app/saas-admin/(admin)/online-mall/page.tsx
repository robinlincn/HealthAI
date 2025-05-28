
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnlineMallPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first relevant sub-page, e.g., product management
    router.replace('/saas-admin/online-mall/product-management');
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center">
      <p>正在跳转到在线商城...</p>
      {/* You could add a spinner here */}
    </div>
  );
}
