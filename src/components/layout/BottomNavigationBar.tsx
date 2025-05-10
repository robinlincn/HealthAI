
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LineChart, Bot, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/types';
import { useActivePath } from '@/hooks/use-active-path';

const bottomNavLinksData: NavItem[] = [
  { title: '仪表盘', href: '/dashboard', icon: LayoutDashboard },
  { title: '健康数据', href: '/dashboard/health-data', icon: LineChart },
  { title: 'AI助手', href: '/dashboard/assistant', icon: Bot },
  { title: '我的', href: '/dashboard/profile', icon: UserCircle },
];

export default function BottomNavigationBar() {
  const pathname = usePathname();
  const checkActivePath = useActivePath();

  return (
    <nav className="bg-card border-t border-border sticky bottom-0 z-20 flex-shrink-0">
      <div className="flex justify-around items-center h-16">
        {bottomNavLinksData.map((link) => {
          const isActive = checkActivePath(link.href);
          const Icon = link.icon;
          return (
            <Link key={link.title} href={link.href} className="flex flex-col items-center justify-center flex-1 p-1 text-center">
              <Icon className={cn("h-5 w-5 mb-0.5", isActive ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-xs", isActive ? "text-primary font-medium" : "text-muted-foreground")}>
                {link.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
