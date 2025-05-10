
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Users, BarChart3, Activity, FileDown } from "lucide-react"; // Using BarChart for charts
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, BarChart, Area, ComposedChart, Line, Bar } from "recharts" // Added Area and ComposedChart

const mockGroupTrendData = [
  { month: "一月", avgBloodSugar: 7.5, bpControlRate: 65 },
  { month: "二月", avgBloodSugar: 7.2, bpControlRate: 68 },
  { month: "三月", avgBloodSugar: 7.0, bpControlRate: 72 },
  { month: "四月", avgBloodSugar: 6.8, bpControlRate: 75 },
  { month: "五月", avgBloodSugar: 7.1, bpControlRate: 73 },
];

const chartConfigTrend = {
  avgBloodSugar: { label: "平均血糖 (mmol/L)", color: "hsl(var(--chart-1))" },
  bpControlRate: { label: "血压控制率 (%)", color: "hsl(var(--chart-2))" },
};

export default function DoctorStatisticsTrendsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <TrendingUp className="mr-3 h-7 w-7 text-primary" />
            病情趋势分析
          </CardTitle>
          <CardDescription>
            分析病人群体的健康数据，如平均血糖水平、血压控制情况等，并基于历史数据预测病情发展趋势，提前干预。
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>群体健康数据趋势</CardTitle>
          <div className="flex gap-2 mt-2">
            <Select defaultValue="all_patients">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择病人群体" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_patients">所有病人</SelectItem>
                <SelectItem value="diabetes_type2">2型糖尿病患者</SelectItem>
                <SelectItem value="hypertension">高血压患者</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="last_6_months">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择时间范围" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_3_months">近3个月</SelectItem>
                <SelectItem value="last_6_months">近6个月</SelectItem>
                <SelectItem value="last_12_months">近1年</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">应用筛选</Button>
          </div>
        </CardHeader>
        <CardContent>
           <ChartContainer config={chartConfigTrend} className="h-[350px] w-full">
            <ComposedChart data={mockGroupTrendData} accessibilityLayer margin={{ left: 0, right: 10 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis yAxisId="left" orientation="left" stroke="var(--color-avgBloodSugar)" domain={[5,10]} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--color-bpControlRate)" domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line yAxisId="left" type="monotone" dataKey="avgBloodSugar" stroke="var(--color-avgBloodSugar)" strokeWidth={2} dot={true} name="平均血糖" />
              <Bar yAxisId="right" dataKey="bpControlRate" fill="var(--color-bpControlRate)" radius={4} name="血压控制率" />
            </ComposedChart>
          </ChartContainer>
          <div className="flex justify-end mt-4">
             <Button variant="secondary"><FileDown className="mr-2 h-4 w-4"/>导出趋势报告 (PDF)</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center"><Activity className="mr-2 h-5 w-5 text-muted-foreground"/>病情发展趋势预测 (AI)</CardTitle>
            <CardDescription>基于历史数据和AI模型，预测高危病人病情发展趋势。</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mt-8 flex flex-col items-center text-center">
                <BarChart3 className="w-24 h-24 text-primary/30 mb-4" />
                <h3 className="text-xl font-semibold text-foreground/70">预测模型建设中</h3>
                <p className="text-foreground/50 max-w-md">
                此功能将利用AI分析历史数据，为高风险患者提供病情发展趋势预测，帮助医生提前制定干预措施。敬请期待。
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
