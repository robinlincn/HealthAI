import { Menu, Bell, UserCircle } from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="rounded-full p-2 hover:bg-muted md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link href="/admin" className="text-xl font-semibold text-primary hidden md:block">
          SAAS Admin
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <button className="rounded-full p-2 hover:bg-muted" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <button className="rounded-full p-1 hover:bg-muted" aria-label="User profile">
          <UserCircle className="h-7 w-7 text-muted-foreground" />
        </button>
        {/* Future: Dropdown for user profile */}
      </div>
    </header>
  );
}
