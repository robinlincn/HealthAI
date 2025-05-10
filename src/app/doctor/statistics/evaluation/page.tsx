
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Users, BarChart3, FileDown, GitCompareArrows } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"

// Mock data for demonstration
const mockEvaluationData = [
  { metric: "平均空腹血糖", before: 8.5, after: 6.8, unit: "mmol/L" },
  { metric: "糖化血红蛋白", before: 7.9, after: 7.1, unit: "%" },
  { metric: "血压达标率", before: 60, after: 75, unit: "%" },
  { metric: "体重变化", before: 85, after: 82, unit: "kg" },
];

const chartConfigEvaluation = {
  before: { label: "治疗前", color: "hsl(var(--chart-2))" }, // Sky blue
  after: { label: "治疗后", color: "hsl(var(--chart-1))" },   // Teal
};


export default function DoctorStatisticsEvaluationPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <ShieldCheck className="mr-3 h-7 w-7 text-primary" />
            治疗效果评估
          </CardTitle>
          <CardDescription>
            对比病人治疗前后的健康数据，评估治疗方案的有效性，并生成评估报告。
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>治疗效果对比分析</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <Input placeholder="搜索病人ID或姓名 (pat001)" className="max-w-xs h-9" />
            <Select defaultValue="diabetes_plan_xyz">
              <SelectTrigger className="w-full sm:w-[220px] h-9">
                <SelectValue placeholder="选择治疗方案/周期" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diabetes_plan_xyz">糖尿病管理方案 (2024 Q1)</SelectItem>
                <SelectItem value="hypertension_adj">高血压药物调整 (2024-03)</SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-9">加载对比数据</Button>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigEvaluation} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockEvaluationData} layout="vertical" accessibilityLayer margin={{ left: 20, right: 20}}>
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="metric" type="category" width={100} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="before" fill="var(--color-before)" radius={4} name="治疗前" />
                    <Bar dataKey="after" fill="var(--color-after)" radius={4} name="治疗后" />
                </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <p className="text-sm text-muted-foreground mt-2">图表显示关键指标在治疗前后的变化。单位：血糖(mmol/L), 糖化(%), 达标率(%), 体重(kg)。</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle className="flex items-center"><GitCompareArrows className="mr-2 h-5 w-5 text-muted-foreground"/>评估报告与效果跟踪</CardTitle>
                <CardDescription>生成详细的治疗效果评估报告，并持续跟踪病人治疗效果以调整方案。</CardDescription>
            </div>
            <Button variant="secondary"><FileDown className="mr-2 h-4 w-4"/>导出评估报告 (PDF)</Button>
        </CardHeader>
        <CardContent>
            <div className="mt-8 flex flex-col items-center text-center">
                <BarChart3 className="w-24 h-24 text-primary/30 mb-4" />
                <h3 className="text-xl font-semibold text-foreground/70">详细报告与跟踪功能建设中</h3>
                <p className="text-foreground/50 max-w-md">
                此部分将提供更详细的数据对比分析、统计学意义评估、以及治疗效果随时间变化的跟踪图表。敬请期待。
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
