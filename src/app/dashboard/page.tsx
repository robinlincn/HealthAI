import { BentoGrid, BentoGridItem } from "@/components/dashboard/BentoGrid";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { navLinks } from "@/lib/nav-links";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, BellRing, Activity } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const chartData = [
  { month: "一月", desktop: 186, mobile: 80 },
  { month: "二月", desktop: 305, mobile: 200 },
  { month: "三月", desktop: 237, mobile: 120 },
  { month: "四月", desktop: 73, mobile: 190 },
  { month: "五月", desktop: 209, mobile: 130 },
  { month: "六月", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "指标A",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "指标B",
    color: "hsl(var(--chart-2))",
  },
};


export default function DashboardPage() {
  const bentoItems = navLinks.filter(link => link.href !== '/dashboard').slice(0, 6); // Get up to 6 items, excluding dashboard itself

  return (
    <div className="space-y-6">
      <WelcomeBanner />
      
      <BentoGrid className="md:grid-cols-2 lg:grid-cols-3">
        {bentoItems.map((item, idx) => (
          <BentoGridItem
            key={idx}
            title={item.title}
            href={item.href}
            icon={item.icon}
            description={`管理您的${item.title}和相关健康数据。`}
            className={idx === 0 || idx === 4 ? "md:col-span-1" : idx === 3 ? "md:col-span-2 md:row-span-1" : "md:col-span-1"}
          >
            {/* You can add specific content for each bento item here if needed */}
             {idx === 0 && ( // Example for first item to show some specific content
              <div className="flex items-center justify-center h-full text-muted-foreground/50">
                <item.icon className="w-16 h-16" />
              </div>
            )}
          </BentoGridItem>
        ))}

        {/* Example of a larger bento item, e.g. a chart */}
        <Card className="md:col-span-3 p-4 rounded-xl shadow-input bg-card border-border">
          <h3 className="text-lg font-semibold mb-2 text-card-foreground">健康指标概览</h3>
           <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-video">
            <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

      </BentoGrid>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">近期活动</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+3 项已完成</div>
            <p className="text-xs text-muted-foreground">
              相比上周 +10%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">提醒事项</CardTitle>
            <BellRing className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 个待办</div>
            <p className="text-xs text-muted-foreground">
              今日需完成
            </p>
          </CardContent>
        </Card>
         <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">自定义指标</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73.5%</div>
            <p className="text-xs text-muted-foreground">
              目标达成率
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
