"use client";

import { usePathname } from 'next/navigation';

export function useActivePath(): (path: string) => boolean {
  const pathname = usePathname();

  const checkActivePath = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    // For nested routes, ensure it's not matching the root dashboard path unless explicitly that path.
    if (path !== '/dashboard' && pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return checkActivePath;
}
