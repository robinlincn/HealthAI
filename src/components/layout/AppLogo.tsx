
import Link from 'next/link';
import { Icons } from '@/components/icons';

interface AppLogoProps {
  href?: string;
  title?: string;
}

export function AppLogo({ href = '/dashboard', title = "AI慢病管理系统" }: AppLogoProps) {
  return (
    <Link href={href} className="flex items-center space-x-2" aria-label={`${title} Home`}>
      <Icons.Logo className="h-8 w-8 text-primary" />
      <span className="font-bold text-lg hidden md:inline-block text-sidebar-foreground group-data-[collapsible=icon]/sidebar-wrapper:hidden">
        {title}
      </span>
    </Link>
  );
}
