
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  UserCircle,
  MessageSquare,
  CheckSquare,
  Activity,
  Smile,
  ChevronRight,
  LogOut,
  Stethoscope,
  FileText, // Using FileText for 健康档案
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const mockUser = {
  name: "王小宝",
  avatarUrl: "https://picsum.photos/seed/userprofilemain/100/100",
  dataAiHint: "user portrait",
};

const mockDoctor = {
  name: "王老师",
  avatarUrl: "https://picsum.photos/seed/doctorprofilemain/80/80",
  dataAiHint: "doctor professional",
};

const profileLinks = [
  {
    title: "健康档案",
    icon: FileText,
    href: "/dashboard/profile/edit-details",
  },
  {
    title: "在线咨询",
    icon: MessageSquare,
    href: "/dashboard/consultations",
  },
  {
    title: "我的打卡",
    icon: CheckSquare,
    href: "/dashboard/reminders",
  },
  {
    title: "健康指数",
    icon: Activity,
    href: "/dashboard/health-data",
  },
  {
    title: "联系我们",
    icon: Smile,
    href: "/dashboard/help",
  },
];

export default function ProfilePage() {
  return (
    <div className="space-y-4 pb-4">
      {/* Top Banner Section */}
      <div className="relative h-40 sm:h-48 md:h-40 rounded-lg overflow-hidden">
        <Image
          src="https://picsum.photos/seed/profileheader/600/240"
          alt="健康背景"
          layout="fill"
          objectFit="cover"
          className="opacity-80"
          data-ai-hint="health medical"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-1">
          {/* Placeholder for "实时监管您的健康" text if needed */}
        </div>
      </div>

      {/* User Info and Doctor Card - Overlapping the banner */}
      <Card className="relative -mt-20 mx-2 shadow-xl">
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <Avatar className="h-20 w-20 border-4 border-background shadow-md">
              <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} data-ai-hint={mockUser.dataAiHint} />
              <AvatarFallback className="text-2xl">
                {mockUser.name.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
            <p className="mt-2 text-lg font-semibold">{mockUser.name}</p>
          </div>

          <Separator orientation="vertical" className="h-20 mx-2 sm:mx-4" />

          <div className="flex-1 text-center p-2 border border-primary/30 rounded-lg bg-background">
            <p className="text-sm font-medium text-primary">专属健康管理师</p>
            <Avatar className="h-12 w-12 mx-auto my-1 border-2 border-primary/20">
              <AvatarImage src={mockDoctor.avatarUrl} alt={mockDoctor.name} data-ai-hint={mockDoctor.dataAiHint} />
              <AvatarFallback>
                {mockDoctor.name.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground mb-2">{mockDoctor.name}</p>
            <Button
              size="sm"
              className="w-full h-8 text-xs bg-green-500 hover:bg-green-600 text-white"
              asChild
            >
              <Link href="/dashboard/consultations">
                <Stethoscope className="mr-1 h-3 w-3" /> 询问医生
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <Card className="mx-2 shadow-lg">
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {profileLinks.map((linkItem) => {
              const Icon = linkItem.icon;
              return (
                <li key={linkItem.title}>
                  <Link
                    href={linkItem.href}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">
                        {linkItem.title}
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Card className="mx-2 shadow-lg">
        <CardContent className="p-2">
          <Button
            variant="ghost"
            className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive font-medium"
            onClick={() => alert("退出登录功能暂未实现")}
          >
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
