
"use client"; // Keep as client component for consistency if other pages in this area use client hooks

import { WelcomeBannerDoctor } from "@/components/doctor/WelcomeBannerDoctor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarClock, MailWarning, Users, Megaphone } from "lucide-react";
import Link from "next/link";

export default function DoctorDashboardPage() {
  const stats = [
    { title: "今日预约", value: "12", icon: CalendarClock, href: "/doctor/appointments", description: "待处理 3"},
    { title: "待处理消息", value: "5", icon: MailWarning, href: "/doctor/consultations", description: "新消息 2"}, // Changed href from /doctor/messages
    { title: "活跃患者", value: "150", icon: Users, href: "/doctor/patients", description: "本周新增 5" },
    { title: "系统公告", value: "2", icon: Megaphone, href: "/doctor/messages", description: "重要通知"}, // Changed href to /doctor/messages for announcements
  ];

  return (
    <div className="space-y-6">
      <WelcomeBannerDoctor />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground pt-1">
                {stat.description}
              </p>
              <Link href={stat.href} className="text-sm text-primary hover:underline mt-2 block">
                查看详情 &rarr;
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>近期活动日志</CardTitle>
          <CardDescription>最近的患者互动和系统操作记录。</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Placeholder for activity log */}
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>[10:35 AM] 更新了患者 王五 的治疗方案。</li>
            <li>[09:17 AM] 完成了与患者 李四 的线上咨询。</li>
            <li>[昨日 04:30 PM] 添加了新患者 赵六。</li>
            <li>[昨日 02:15 PM] 查看了患者 孙七 的最新报告。</li>
          </ul>
           <Link href="#" className="text-sm text-primary hover:underline mt-4 inline-block" aria-disabled="true" onClick={(e) => e.preventDefault()}>
            查看所有活动 &rarr; (建设中)
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
