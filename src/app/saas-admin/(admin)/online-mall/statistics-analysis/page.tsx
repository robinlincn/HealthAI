
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import type { DateRange } from "react-day-picker";
import { LineChart, ShoppingCart, Users, PackageSearch, BarChartHorizontal, Download, FileText } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { format, subDays } from 'date-fns';

const mockSalesData = [
  { date: format(subDays(new Date(), 6), 'MM-dd'), sales: Math.floor(Math.random() * 2000) + 500 },
  { date: format(subDays(new Date(), 5), 'MM-dd'), sales: Math.floor(Math.random() * 2000) + 600 },
  { date: format(subDays(new Date(), 4), 'MM-dd'), sales: Math.floor(Math.random() * 2000) + 700 },
  { date: format(subDays(new Date(), 3), 'MM-dd'), sales: Math.floor(Math.random() * 2000) + 800 },
  { date: format(subDays(new Date(), 2), 'MM-dd'), sales: Math.floor(Math.random() * 2000) + 900 },
  { date: format(subDays(new Date(), 1), 'MM-dd'), sales: Math.floor(Math.random() * 2000) + 1000 },
  { date: format(new Date(), 'MM-dd'), sales: Math.floor(Math.random() * 2000) + 1100 },
];

const chartConfig = {
  sales: {
    label: "销售额 (元)",
    color: "hsl(var(--primary))",
  },
};


export default function MallStatisticsAnalysisPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [reportType, setReportType] = useState("monthly_sales");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGenerateReport = () => {
    toast({
      title: "报表生成 (模拟)",
      description: `正在生成 "${reportType}" 报表，时间范围: ${dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : ''} - ${dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : ''}。实际导出功能开发中。`
    });
  };

  if (!isClient) {
    return <div className="p-4 text-center text-muted-foreground">正在加载商城统计分析...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <LineChart className="h-6 w-6 text-primary" />
            商城统计与分析
          </CardTitle>
          <CardDescription>
            查看商城运营数据，如销售额、订单量、用户行为、商品表现等。
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Sales Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5 text-primary/80" />
            销售统计 (最近7日示例)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6 text-center">
            <Card className="p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">总销售额</p>
              <p className="text-2xl font-semibold">¥{ (mockSalesData.reduce((sum, item) => sum + item.sales, 0) * 4.5).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } (模拟月度)</p>
            </Card>
            <Card className="p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">总订单数</p>
              <p className="text-2xl font-semibold">{(mockSalesData.length * 30).toLocaleString()} (模拟月度)</p>
            </Card>
            <Card className="p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">热销商品</p>
              <p className="text-lg font-semibold">智能血糖仪套装 (模拟)</p>
            </Card>
          </div>
          <CardDescription className="mb-2 text-sm">销售额趋势 (最近7日):</CardDescription>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={mockSalesData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis tickFormatter={(value) => `¥${value}`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* User Behavior Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary/80" />
            用户行为分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed border-border rounded-md text-center bg-muted/30 min-h-[150px] flex flex-col justify-center items-center">
            <BarChartHorizontal className="h-12 w-12 mx-auto text-primary/30 mb-3" />
            <p className="font-semibold text-muted-foreground">用户行为分析图表区 (开发中)</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              将展示用户访问路径、页面停留时间、购物车转化率、新老用户占比等分析图表。
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Report Generation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary/80" />
            报表生成
          </CardTitle>
          <CardDescription>选择报表类型和日期范围以生成并导出数据报表。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reportType" className="text-sm font-medium text-muted-foreground">报表类型</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="reportType" className="mt-1">
                  <SelectValue placeholder="选择报表类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly_sales">月度销售总览</SelectItem>
                  <SelectItem value="product_performance">商品表现报告</SelectItem>
                  <SelectItem value="customer_segment_analysis">用户分群报告</SelectItem>
                  <SelectItem value="traffic_conversion">流量转化报告</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="reportDateRange" className="text-sm font-medium text-muted-foreground">日期范围</label>
              <DatePickerWithRange date={dateRange} onDateChange={setDateRange} className="w-full mt-1" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleGenerateReport}>
              <Download className="mr-2 h-4 w-4" /> 生成并导出报告 (模拟)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
