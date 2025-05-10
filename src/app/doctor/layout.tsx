
"use client";

import { doctorNavLinks } from "@/lib/doctor-nav-links";
import { AppLogo } from "@/components/layout/AppLogo";
import { Header } from "@/components/layout/Header";
import { SidebarNav } from "@/components/layout/SidebarNav";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import React from "react";
import { usePathname } from "next/navigation";
import { DoctorAuthProvider, useDoctorAuth } from "@/contexts/DoctorAuthContext";

const doctorAppTitle = "AI慢病管理系统-医生端";

function DoctorLayoutContent({ children }: { children: React.ReactNode }) {
  const { setOpenMobile, isMobile } = useSidebar();
  const { logoutDoctor, isDoctorAuthenticated, isLoadingAuth } = useDoctorAuth();
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (isMobile && typeof setOpenMobile === 'function') {
      setOpenMobile(false); 
    }
  };

  const handleLogout = () => {
    logoutDoctor();
  };

  // If loading or not authenticated and not on the login page, show a loader or return null
  // This prevents the layout from rendering for protected routes until auth is checked.
  if (isLoadingAuth) {
    return <div className="flex items-center justify-center min-h-screen w-full"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  if (!isDoctorAuthenticated && pathname !== '/doctor/auth/login') {
    // The redirect is handled by DoctorAuthProvider's useEffect,
    // so we can just return a loader/null here to prevent rendering children.
     return <div className="flex items-center justify-center min-h-screen w-full"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }
  
  // Allow rendering login page even if not authenticated
  if (pathname === '/doctor/auth/login') {
    return <>{children}</>;
  }
  
  // If authenticated, render the full layout
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <AppLogo href="/doctor" title={doctorAppTitle} />
        </SidebarHeader>
        <SidebarContent className="flex-1 p-2">
          <SidebarNav items={doctorNavLinks} onLinkClick={handleLinkClick} />
        </SidebarContent>
        <SidebarFooter>
          <Button 
            variant="ghost" 
            className="w-full justify-start group-data-[collapsible=icon]/sidebar-wrapper:justify-center group-data-[collapsible=icon]/sidebar-wrapper:px-2"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5 flex-shrink-0" />
            <span className="group-data-[collapsible=icon]/sidebar-wrapper:hidden">退出登录</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-1 flex-col sm:gap-4 sm:py-4">
        <Header logoHref="/doctor" logoTitle={doctorAppTitle} />
        <SidebarInset>
          <main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-6 bg-background">
            {children}
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [defaultOpen, setDefaultOpen] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedState = document.cookie
        .split('; ')
        .find(row => row.startsWith('doctor_sidebar_state='))
        ?.split('=')[1];
      if (storedState) {
        setDefaultOpen(storedState === 'true');
      } else {
         document.cookie = `doctor_sidebar_state=${defaultOpen}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
    }
  }, [defaultOpen]);
  
  const handleOpenChange = (open: boolean) => {
    setDefaultOpen(open);
    document.cookie = `doctor_sidebar_state=${open}; path=/; max-age=${60 * 60 * 24 * 7}`;
  };

  return (
    <DoctorAuthProvider>
      <SidebarProvider defaultOpen={defaultOpen} onOpenChange={handleOpenChange}>
        <DoctorLayoutContent>{children}</DoctorLayoutContent>
      </SidebarProvider>
    </DoctorAuthProvider>
  );
}
