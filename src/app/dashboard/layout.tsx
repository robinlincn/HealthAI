
"use client";

import type { ReactNode } from 'react';
import MobileAppLayout from '@/components/layout/MobileAppLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileAppLayout>
      {children}
    </MobileAppLayout>
  );
}
