
"use client";

import { usePathname } from 'next/navigation';
import { navLinks } from '@/lib/nav-links';

export default function MobileHeader() {
  const pathname = usePathname();
  let title = "AI慢病管理系统"; // Default title

  // Determine current page title based on navLinks
  const activeLink = navLinks.find(link => {
    if (link.href === '/dashboard' && pathname === '/dashboard') return true;
    // Match if pathname starts with link.href and they share the same primary segment (e.g. 'profile')
    if (link.href !== '/dashboard' && pathname.startsWith(link.href)) {
        const linkSegments = link.href.split('/');
        const pathSegments = pathname.split('/');
        if (linkSegments.length > 2 && pathSegments.length > 2 && linkSegments[2] === pathSegments[2]) {
            return true;
        }
    }
    return false;
  });

  if (activeLink) {
    title = activeLink.title;
  } else if (pathname === '/dashboard') {
    title = '仪表盘'; 
  }


  return (
    <header className="bg-primary text-primary-foreground p-4 text-center sticky top-0 z-20 shadow-md flex-shrink-0">
      <h1 className="text-lg font-semibold truncate px-2">{title}</h1>
    </header>
  );
}
