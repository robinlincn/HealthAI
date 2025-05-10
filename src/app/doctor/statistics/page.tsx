
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePieChart, TrendingUp, ShieldCheck, TableProperties } from "lucide-react";
import Link from "next/link";

export default function DoctorStatisticsPage() {
  const statisticsModules = [
    {
      title: "病情趋势分析",
      description: "分析病人群体的健康数据，预测病情发展趋势，提前干预。",
      href: "/doctor/statistics/trends",
      icon: TrendingUp,
    },
    {
      title: "治疗效果评估",
      description: "对比病人治疗前后的健康数据，评估治疗方案的有效性。",
      href: "/doctor/statistics/evaluation",
      icon: ShieldCheck,
    },
    {
      title: "自定义统计报表",
      description: "根据需要选择统计维度、指标和时间范围，生成自定义报表。",
      href: "/doctor/statistics/custom-reports",
      icon: TableProperties, // Using TableProperties for custom reports
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <FilePieChart className="mr-3 h-7 w-7 text-primary" />
            统计报告总览
          </CardTitle>
          <CardDescription>
            选择下方的统计报告模块进行详细操作和查看。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {statisticsModules.map((module) => (
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
        <FilePieChart className="w-16 h-16 text-primary/30 mb-4" />
        <p>您当前在统计报告总览页面。更多功能模块正在建设中。</p>
      </div>
    </div>
  );
}
