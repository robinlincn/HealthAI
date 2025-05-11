'use client';

import { useState, type ReactNode } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to closed on mobile

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {/* Adjust ml-0 for mobile and ml-64 for desktop when sidebar is fixed open */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ease-in-out md:ml-64`}>
        <AdminHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
