
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, UserCog, DatabaseBackup, Settings2, PlugZap } from "lucide-react";
import Link from "next/link";

export default function DoctorSettingsPage() {
  const settingsModules = [
    {
      title: "用户与权限管理",
      description: "管理医生、护士等系统用户账号，设置角色并分配相应操作权限。",
      href: "/doctor/settings/users",
      icon: UserCog,
    },
    {
      title: "数据备份与恢复",
      description: "管理系统数据的自动和手动备份，以及在需要时从备份文件恢复数据。",
      href: "/doctor/settings/backup",
      icon: DatabaseBackup,
    },
    {
      title: "系统配置",
      description: "配置系统界面、通知方式以及进行系统维护操作。",
      href: "/doctor/settings/system",
      icon: Settings2,
    },
    {
      title: "集成与扩展",
      description: "管理与外部系统（如EMR）的集成，以及API接口的配置。",
      href: "/doctor/settings/integrations",
      icon: PlugZap,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Settings className="mr-3 h-7 w-7 text-primary" />
            系统管理总览
          </CardTitle>
          <CardDescription>
            选择下方的系统管理模块进行详细配置和操作。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"> {/* Adjusted to 2 columns for better fit */}
        {settingsModules.map((module) => (
          <Card key={module.href} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <module.icon className="mr-3 h-6 w-6 text-primary/80" />
                {module.title}
              </CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href={module.href}>进入模块</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
       <div className="mt-8 flex flex-col items-center text-center text-muted-foreground">
        <Settings className="w-16 h-16 text-primary/30 mb-4" />
        <p>您当前在系统管理总览页面。确保系统安全高效运行。</p>
      </div>
    </div>
  );
}
