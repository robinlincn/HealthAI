
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketingManagementRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first relevant sub-page, e.g., promotions management
    router.replace('/saas-admin/online-mall/marketing-management/promotions');
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center">
      <p>正在跳转到营销管理...</p>
      {/* You could add a spinner here */}
    </div>
  );
}
