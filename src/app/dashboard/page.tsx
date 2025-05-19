
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { navLinks } from "@/lib/nav-links";
import { Droplets, HeartPulse, Scale, Footprints } from "lucide-react";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner"; 

export default function DashboardPage() {
  const quickAccessLinks = navLinks.filter(link =>
    link.href !== '/dashboard' &&
    (link.href === '/dashboard/health-data' ||
     link.href === '/dashboard/nutrition' ||
     link.href === '/dashboard/medication-plan' || // Added medication-plan here
     link.href === '/dashboard/reports' ||
     link.href === '/dashboard/reminders' ||
     link.href === '/dashboard/consultations')
  ).slice(0, 5); 

  const overviewData = [
    { title: "血糖", value: "5.8", unit: "mmol/L", description: "餐前", icon: Droplets, color: "text-blue-500", href: "/dashboard/health-data" },
    { title: "血压", value: "125/80", unit: "mmHg", description: "最新记录", icon: HeartPulse, color: "text-red-500", href: "/dashboard/health-data" },
    { title: "体重", value: "70.2", unit: "kg", description: "稳定", icon: Scale, color: "text-green-500", href: "/dashboard/health-data" },
    { title: "今日步数", value: "3450", unit: "步", description: "加油！", icon: Footprints, color: "text-orange-500", href: "/dashboard/health-data" }, // Assuming steps are part of general health data
  ];

  return (
    <div className="space-y-4">
      <WelcomeBanner />

      <Card className="shadow-sm">
        <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-medium">今日概览</CardTitle>
            <CardDescription className="text-xs">您的健康数据摘要 (示例)。</CardDescription>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-2 gap-3">
          {overviewData.map((item) => {
            const Icon = item.icon;
            return (
              <Link href={item.href} key={item.title} legacyBehavior>
                <a className="block">
                  <Card className="shadow-xs hover:shadow-md transition-shadow bg-muted/30 h-full flex flex-col">
                    <CardHeader className="p-2.5 pb-1">
                      <div className="flex items-center space-x-1.5">
                        <Icon className={`h-4 w-4 ${item.color || 'text-primary'}`} />
                        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-2.5 pt-0 flex-grow">
                      <p className="text-xl font-semibold">{item.value} <span className="text-xs text-muted-foreground">{item.unit}</span></p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            );
          })}
        </CardContent>
         <CardContent className="p-4 pt-0">
             <p className="text-xs text-muted-foreground text-center">数据为模拟，请及时记录真实数据以获得准确分析。</p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <CardHeader className="px-0 pt-2 pb-1">
             <CardTitle className="text-base font-medium">常用功能</CardTitle>
        </CardHeader>
        {quickAccessLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link href={link.href} key={link.title} legacyBehavior>
              <a className="block">
                <Card className="hover:shadow-md active:bg-muted/60 transition-all shadow-sm">
                  <CardContent className="p-3 flex items-center space-x-3"> {/* Reduced padding from p-4 to p-3 */}
                      <Icon className="h-6 w-6 text-primary flex-shrink-0" /> {/* Reduced icon size from h-7 w-7 */}
                      <span className="text-sm font-semibold text-foreground">{link.title}</span> {/* Reduced text size from text-base */}
                  </CardContent>
                </Card>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
