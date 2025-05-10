
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileSpreadsheet, LineChart } from "lucide-react";
import Link from "next/link";

export default function DoctorAnalyticsPage() {
  const analyticsModules = [
    {
      title: "健康数据可视化",
      description: "查看单个或群体病人的血糖、血压、体重、血脂等健康数据趋势。支持数据标注重要事件。",
      href: "/doctor/analytics/visualization",
      icon: LineChart, // Using LineChart for general visualization, can be BarChart3 as well
    },
    {
      title: "AI辅助病情分析报告",
      description: "根据病人的健康数据自动生成详细的病情分析报告，包括数据统计、趋势分析和异常数据标记。",
      href: "/doctor/analytics/reports",
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <BarChart3 className="mr-3 h-7 w-7 text-primary" />
            病情分析总览
          </CardTitle>
          <CardDescription>
            选择下方的病情分析模块进行详细操作和查看。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {analyticsModules.map((module) => (
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
        <BarChart3 className="w-16 h-16 text-primary/30 mb-4" />
        <p>您当前在病情分析总览页面。更多功能模块正在建设中。</p>
      </div>
    </div>
  );
}
