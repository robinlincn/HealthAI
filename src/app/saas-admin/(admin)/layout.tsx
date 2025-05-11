
"use client"; 

import type { ReactNode } from 'react';
import React, { useState } from 'react'; // Added React import
import { AdminHeader } from '@/components/saas-admin/layout/AdminHeader'; // Corrected import path
import { AdminSidebar } from '@/components/saas-admin/layout/AdminSidebar'; // Corrected import path

export default function SaasAdminDashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className={`flex flex-1 flex-col transition-all duration-300 ease-in-out md:ml-64`}>
        <AdminHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
