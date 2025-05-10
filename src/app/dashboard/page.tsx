
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { navLinks } from "@/lib/nav-links";
import { ChevronRight } from "lucide-react";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner"; 

export default function DashboardPage() {
  const quickAccessLinks = navLinks.filter(link =>
    link.href !== '/dashboard' &&
    (link.href === '/dashboard/health-data' ||
     link.href === '/dashboard/nutrition' ||
     link.href === '/dashboard/reports' ||
     link.href === '/dashboard/reminders' ||
     link.href === '/dashboard/consultations')
  ).slice(0, 5); 

  return (
    <div className="space-y-4">
      <WelcomeBanner />

      <div className="space-y-3">
        <CardHeader className="px-0 pt-2 pb-1">
             <CardTitle className="text-base font-medium">常用功能</CardTitle>
        </CardHeader>
        {quickAccessLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link href={link.href} key={link.title} legacyBehavior>
              <a className="block">
                <Card className="hover:bg-muted/50 active:bg-muted/70 transition-colors shadow-xs">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{link.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </a>
            </Link>
          );
        })}
      </div>

      <Card className="shadow-sm">
        <CardHeader className="p-4">
            <CardTitle className="text-base font-medium">今日概览 (示例)</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-1 text-sm">
            <p>血糖: 5.8 mmol/L (餐前)</p>
            <p>血压: 125/80 mmHg</p>
            <p>今日步数: 3450</p>
            <p className="text-xs text-muted-foreground pt-1">数据为模拟，请及时记录真实数据。</p>
        </CardContent>
      </Card>
    </div>
  );
}

