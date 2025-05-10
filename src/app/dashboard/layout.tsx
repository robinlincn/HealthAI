"use client";

import { navLinks } from "@/lib/nav-links";
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get cookie for default open state
  const [defaultOpen, setDefaultOpen] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedState = document.cookie
        .split('; ')
        .find(row => row.startsWith('sidebar_state='))
        ?.split('=')[1];
      if (storedState) {
        setDefaultOpen(storedState === 'true');
      }
    }
  }, []);
  
  const { setOpenMobile } = useSidebar() || { setOpenMobile: () => {} }; // Default for SSR

  const handleLinkClick = () => {
    if (typeof setOpenMobile === 'function') {
      setOpenMobile(false); // Close mobile sidebar on link click
    }
  };


  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar side="left" variant="sidebar" collapsible="icon">
          <SidebarHeader>
            <AppLogo />
          </SidebarHeader>
          <SidebarContent className="flex-1 p-2">
            <SidebarNav items={navLinks} onLinkClick={handleLinkClick} />
          </SidebarContent>
          <SidebarFooter>
            <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]/sidebar-wrapper:justify-center group-data-[collapsible=icon]/sidebar-wrapper:px-2">
              <LogOut className="mr-2 h-5 w-5 flex-shrink-0" />
              <span className="group-data-[collapsible=icon]/sidebar-wrapper:hidden">退出登录</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 group-data-[state=expanded]/sidebar-wrapper:sm:pl-[16rem] transition-[padding-left] duration-200 ease-linear">
           <Header />
          <SidebarInset>
            <main className="flex-1 p-4 sm:px-6 sm:py-0 md:p-6 bg-background">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
