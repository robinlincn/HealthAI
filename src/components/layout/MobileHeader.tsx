
"use client";

import { usePathname, useRouter } from 'next/navigation';
import { navLinks } from '@/lib/nav-links';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileHeader() {
  const pathname = usePathname();
  const router = useRouter();
  let title = "AI慢病管理系统"; // Default title

  // Determine current page title based on navLinks
  const activeLink = navLinks.find(link => {
    if (link.href === '/dashboard' && pathname === '/dashboard') return true;
    // Match if pathname starts with link.href and they share the same primary segment (e.g. 'profile')
    // or if the pathname exactly matches the link href
    if (link.href !== '/dashboard' && (pathname === link.href || pathname.startsWith(link.href + '/'))) {
        // A more specific check for nested routes that share a base segment
        const linkSegments = link.href.split('/');
        const pathSegments = pathname.split('/');
        if (pathSegments.length >= linkSegments.length && linkSegments[2] === pathSegments[2]) {
             // Check if it's an exact match or a sub-route of the link's main segment
            if (pathname === link.href || (pathSegments.length > linkSegments.length && link.href.includes(pathSegments[2]))) {
                 return true;
            }
        } else if (pathname === link.href) { // Exact match for top-level secondary pages
            return true;
        }
    }
    return false;
  });

  if (activeLink) {
    title = activeLink.title;
  } else if (pathname === '/dashboard') {
    title = '仪表盘';
  } else if (pathname.startsWith('/dashboard/profile/edit-details')) {
    // Special case for deeply nested common pages if not covered by general logic
    title = '编辑资料'; // Or derive from a breadcrumb system if available
  }


  const showBackButton = pathname !== '/dashboard';

  return (
    <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-20 shadow-md flex items-center">
      {showBackButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-primary-foreground hover:bg-primary/80 mr-2"
          aria-label="返回上一页"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      <h1 className={cn(
        "text-lg font-semibold truncate",
        showBackButton ? "flex-grow text-left" : "w-full text-center"
      )}>
        {title}
      </h1>
      {/* Optional: If you need to perfectly center title when back button is present, add a spacer
      {showBackButton && <div className="w-8 h-8" /> } // Adjust width to match back button
      */}
    </header>
  );
}

