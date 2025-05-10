
"use client";

import type { ReactNode } from 'react';
import BottomNavigationBar from './BottomNavigationBar';
import MobileHeader from './MobileHeader';

interface MobileAppLayoutProps {
  children: ReactNode;
}

export default function MobileAppLayout({ children }: MobileAppLayoutProps) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-700 p-0 md:p-4"> {/* Outer container for centering and dark background */}
      <div className="w-full md:max-w-sm md:h-[85vh] md:max-h-[750px] bg-background shadow-2xl md:rounded-3xl overflow-hidden flex flex-col md:border-8 border-neutral-900">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto">
          {/* Add a wrapper for padding inside the scrollable area */}
          <div className="p-4">
            {children}
          </div>
        </main>
        <BottomNavigationBar />
      </div>
    </div>
  );
}
