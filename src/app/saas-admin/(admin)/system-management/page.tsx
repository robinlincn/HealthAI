
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SystemManagementRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first relevant sub-page, e.g., API management
    router.replace('/saas-admin/system-management/api-management');
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center">
      <p>正在跳转到系统管理...</p>
      {/* You could add a spinner here */}
    </div>
  );
}

```