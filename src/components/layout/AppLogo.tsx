import Link from 'next/link';
import { Icons } from '@/components/icons';

export function AppLogo() {
  return (
    <Link href="/dashboard" className="flex items-center space-x-2" aria-label="AI慢病管理系统 Home">
      <Icons.Logo className="h-8 w-8 text-primary" />
      <span className="font-bold text-lg hidden md:inline-block text-sidebar-foreground group-data-[collapsible=icon]/sidebar-wrapper:hidden">
        AI慢病管理系统
      </span>
    </Link>
  );
}
