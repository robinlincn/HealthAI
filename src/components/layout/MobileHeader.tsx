
"use client";

import { usePathname, useRouter } from 'next/navigation';
import { navLinks } from '@/lib/nav-links';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/lib/cartStore'; // Import cart store
import { Badge } from '@/components/ui/badge'; // Import Badge component
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MobileHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setIsClient(true);
    // Subscribe to cart changes to re-render header when cart updates
    const unsubscribe = useCartStore.subscribe(
      (state) => state.items,
      () => {
        // This forces a re-render if needed, or just rely on totalItems changing
      }
    );
    return unsubscribe;
  }, []);


  let title = "AI慢病管理系统"; // Default title

  const activeLink = navLinks.find(link => {
    if (link.href === '/dashboard' && pathname === '/dashboard') return true;
    if (link.href !== '/dashboard' && (pathname === link.href || pathname.startsWith(link.href + '/'))) {
      const linkSegments = link.href.split('/');
      const pathSegments = pathname.split('/');
      if (pathSegments.length >= linkSegments.length && linkSegments[2] === pathSegments[2]) {
        if (pathname === link.href || (pathSegments.length > linkSegments.length && link.href.includes(pathSegments[2]))) {
          return true;
        }
      } else if (pathname === link.href) {
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
    title = '编辑资料';
  } else if (pathname.startsWith('/dashboard/mall/cart')) {
    title = '购物车';
  } else if (pathname.startsWith('/dashboard/mall/checkout')) {
    title = '结算';
  } else if (pathname.startsWith('/dashboard/mall/order-status')) {
    title = '订单状态';
  } else if (pathname.startsWith('/dashboard/mall/')) {
     title = '商品详情'; // Default for other mall sub-pages
  }


  const showBackButton = pathname !== '/dashboard';
  const showCartIcon = pathname.startsWith('/dashboard/mall') && !pathname.startsWith('/dashboard/mall/cart');

  return (
    <header className="bg-primary text-primary-foreground p-3 sticky top-0 z-20 shadow-md flex items-center justify-between h-16">
      <div className="flex items-center">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-primary-foreground hover:bg-primary/80 mr-1 -ml-1 h-10 w-10"
            aria-label="返回上一页"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
      </div>
      
      <h1 className={cn(
        "text-lg font-semibold truncate text-center flex-grow",
        showBackButton && !showCartIcon && "ml-0", // Adjust margin based on button presence
        !showBackButton && showCartIcon && "mr-0",
        !showBackButton && !showCartIcon && "mx-auto" // Center if no buttons
      )}>
        {title}
      </h1>

      <div className="flex items-center">
        {isClient && showCartIcon && (
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-primary-foreground hover:bg-primary/80 relative h-10 w-10 -mr-1"
            aria-label="购物车"
          >
            <Link href="/dashboard/mall/cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 min-w-[1rem] px-1 text-[10px] bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </Badge>
              )}
            </Link>
          </Button>
        )}
        {/* Spacer if back button is shown but cart is not, or vice-versa to keep title centered */}
         {(showBackButton && !showCartIcon) && <div className="w-10 h-10" />}
         {(!showBackButton && showCartIcon) && <div className="w-10 h-10" />}
      </div>
    </header>
  );
}

    