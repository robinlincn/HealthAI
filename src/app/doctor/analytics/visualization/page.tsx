
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart3, Activity, BarChart as BarChartIconLucide } from "lucide-react"; // Using BarChartIconLucide for clarity
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart as RechartsLineChart, BarChart as RechartsBarChart, Bar, Line as RechartsLine } from "recharts"

// Mock data for demonstration
const mockBloodSugarData = [
  { date: "2024-05-01", value: 7.2 }, { date: "2024-05-02", value: 6.5 },
  { date: "2024-05-03", value: 8.0 }, { date: "2024-05-04", value: 7.5 },
  { date: "2024-05-05", value: 6.8 }, { date: "2024-05-06", value: 7.0 },
  { date: "2024-05-07", value: 7.9 },
];

const mockBloodPressureData = [
  { date: "2024-05-01", systolic: 130, diastolic: 85 }, { date: "2024-05-02", systolic: 135, diastolic: 88 },
  { date: "2024-05-03", systolic: 128, diastolic: 82 }, { date: "2024-05-04", systolic: 140, diastolic: 90 },
  { date: "2024-05-05", systolic: 132, diastolic: 86 }, { date: "2024-05-06", systolic: 133, diastolic: 85 },
  { date: "2024-05-07", systolic: 138, diastolic: 89 },
];

const chartConfigBloodSugar = { value: { label: "血糖 (mmol/L)", color: "hsl(var(--chart-1))" } };
const chartConfigBloodPressure = { 
  systolic: { label: "收缩压 (mmHg)", color: "hsl(var(--chart-1))" },
  diastolic: { label: "舒张压 (mmHg)", color: "hsl(var(--chart-2))" },
};


export default function DoctorAnalyticsVisualizationPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <BarChart3 className="mr-3 h-7 w-7 text-primary" />
            病人健康数据可视化
          </CardTitle>
          <CardDescription>
            查看单个或群体病人的血糖、血压、体重、血脂等健康数据趋势。支持数据标注重要事件。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>血糖数据趋势 (示例病人)</CardTitle>
            <CardDescription>支持按日、周、月、年查看，并标注药物调整等事件。</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigBloodSugar} className="h-[300px] w-full">
              <RechartsLineChart data={mockBloodSugarData} accessibilityLayer margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} />
                <YAxis domain={['auto', 'auto']} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} />
                <RechartsLine type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={true} />
              </RechartsLineChart>
            </ChartContainer>
            <p className="text-sm text-muted-foreground mt-2">数据标注功能正在开发中。</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>血压数据趋势 (示例病人)</CardTitle>
             <CardDescription>柱状图展示收缩压和舒张压变化。</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigBloodPressure} className="h-[300px] w-full">
               <RechartsBarChart data={mockBloodPressureData} accessibilityLayer margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="systolic" fill="var(--color-systolic)" radius={4} />
                <Bar dataKey="diastolic" fill="var(--color-diastolic)" radius={4} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
       <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Activity className="mr-2 h-5 w-5 text-muted-foreground"/>其他健康数据 (体重、血脂等)</CardTitle>
            <CardDescription>更多类型的数据图表展示正在建设中。</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-8 flex flex-col items-center text-center">
                <BarChartIconLucide className="w-24 h-24 text-primary/30 mb-4" />
                <h3 className="text-xl font-semibold text-foreground/70">功能建设中</h3>
                <p className="text-foreground/50 max-w-md">
                体重、血脂等健康数据的图表展示功能将在此处提供。
                </p>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
