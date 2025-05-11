
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ServiceCenterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first relevant sub-page, e.g., service package management
    router.replace('/saas-admin/service-center/service-package-management');
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center">
      <p>正在跳转到服务中心...</p>
      {/* You could add a spinner here */}
    </div>
  );
}

```