
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
import { LogOut } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter

const doctorAppTitle = "AI慢病管理系统-医生端";

// Inner component to ensure useSidebar is called within SidebarProvider's context
function DoctorLayoutContent({ children }: { children: React.ReactNode }) {
  const { setOpenMobile, isMobile } = useSidebar();
  const router = useRouter(); // Initialize useRouter

  const handleLinkClick = () => {
    if (isMobile && typeof setOpenMobile === 'function') {
      setOpenMobile(false); 
    }
  };

  const handleLogout = () => {
    // In a real app, you would clear session, tokens, etc.
    router.push('/doctor/auth/login'); // Redirect to doctor login page
  };

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
            onClick={handleLogout} // Add onClick handler
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
  // For simplicity, doctor's sidebar defaults to open and doesn't use cookies for now.
  // Or, ensure a different cookie name if SidebarProvider is enhanced.
  // For now, it will share the same cookie as user dashboard if SidebarProvider is not modified.
  const [defaultOpen, setDefaultOpen] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Using a different cookie name for doctor's sidebar state
      const storedState = document.cookie
        .split('; ')
        .find(row => row.startsWith('doctor_sidebar_state='))
        ?.split('=')[1];
      if (storedState) {
        setDefaultOpen(storedState === 'true');
      } else {
        // If no cookie, set one
         document.cookie = `doctor_sidebar_state=${defaultOpen}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
    }
  }, [defaultOpen]);
  
  const handleOpenChange = (open: boolean) => {
    setDefaultOpen(open);
    document.cookie = `doctor_sidebar_state=${open}; path=/; max-age=${60 * 60 * 24 * 7}`;
  };


  return (
    <SidebarProvider defaultOpen={defaultOpen} onOpenChange={handleOpenChange}>
      <DoctorLayoutContent>{children}</DoctorLayoutContent>
    </SidebarProvider>
  );
}

