
import { cn } from "@/lib/utils";
import { AppLogo } from "./AppLogo";
import { UserNav } from "./UserNav";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  className?: string;
  logoHref?: string;
  logoTitle?: string;
}

export function Header({ className, logoHref, logoTitle }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <SidebarTrigger className="md:hidden" /> {/* Only show on mobile */}
          <div className="hidden md:block"> {/* Hide AppLogo on mobile if SidebarTrigger is shown */}
            <AppLogo href={logoHref} title={logoTitle} />
          </div>
        </div>
        
        {/* AppLogo for mobile when sidebar is not triggered */}
        <div className="md:hidden flex-1 flex justify-center">
            <AppLogo href={logoHref} title={logoTitle} />
        </div>

        <div className="flex items-center space-x-4">
          {/* Add any header actions here, e.g., theme toggle */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
