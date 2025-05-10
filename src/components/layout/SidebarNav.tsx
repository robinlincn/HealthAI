"use client";

import Link from "next/link";
import { useActivePath } from "@/hooks/use-active-path";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface SidebarNavProps {
  items: NavItem[];
  onLinkClick?: () => void; // Callback for when a link is clicked, useful for closing mobile sidebar
}

export function SidebarNav({ items, onLinkClick }: SidebarNavProps) {
  const isActive = useActivePath();

  if (!items?.length) {
    return null;
  }

  return (
    <SidebarMenu>
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          item.href && (
            <SidebarMenuItem key={index}>
              <Link href={item.disabled ? "#" : item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild={false} // Important: Link is the child, not the button itself replacing Link
                  variant="default"
                  size="default"
                  className={cn(
                    "w-full justify-start",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                  isActive={isActive(item.href)}
                  onClick={onLinkClick} // Close mobile sidebar on click
                  tooltip={item.title}
                  aria-disabled={item.disabled}
                  tabIndex={item.disabled ? -1 : 0}
                >
                  <Icon className="mr-2 h-5 w-5 flex-shrink-0" />
                  <span className="truncate group-data-[collapsible=icon]/sidebar-wrapper:hidden">
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )
        );
      })}
    </SidebarMenu>
  );
}
