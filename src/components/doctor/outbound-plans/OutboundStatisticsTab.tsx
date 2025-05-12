
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartHorizontal, CalendarDays, ListFilter, Activity, BarChart2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import type { DateRange } from "react-day-picker";
import { useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Mock data for charts
const mockTaskStatusData = [
  { name: "已完成", count: 120, fill: "hsl(var(--chart-1))" },
  { name: "进行中", count: 30, fill: "hsl(var(--chart-2))" },
  { name: "待安排", count: 45, fill: "hsl(var(--chart-3))" },
  { name: "失败", count: 15, fill: "hsl(var(--chart-4))" },
  { name: "已取消", count: 10, fill: "hsl(var(--chart-5))" },
];

const mockDailyExecutionData = [
  { date: "周一", success: 20, failed: 2 },
  { date: "周二", success: 25, failed: 1 },
  { date: "周三", success: 18, failed: 3 },
  { date: "周四", success: 30, failed: 0 },
  { date: "周五", success: 22, failed: 1 },
];

const chartConfigTaskStatus = {
  count: { label: "任务数" },
  // Colors are defined in mockTaskStatusData directly for Pie chart
};
const chartConfigDailyExecution = {
  success: { label: "成功", color: "hsl(var(--chart-1))" },
  failed: { label: "失败", color: "hsl(var(--chart-4))" },
};


export function OutboundStatisticsTab() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>("all");
  const [selectedTaskTypeFilter, setSelectedTaskTypeFilter] = useState<string>("all");


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">外呼计划统计</CardTitle>
        <CardDescription>查看外呼任务的执行情况、成功率等关键指标。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="dateRangeStats" className="text-sm font-medium text-muted-foreground">时间范围</label>
            <DatePickerWithRange date={dateRange} onDateChange={setDateRange} className="w-full mt-1" />
          </div>
          <div className="flex-1 min-w-[180px]">
             <label htmlFor="groupFilterStats" className="text-sm font-medium text-muted-foreground">外呼组筛选</label>
            <Select value={selectedGroupFilter} onValueChange={setSelectedGroupFilter}>
              <SelectTrigger id="groupFilterStats" className="w-full mt-1">
                <ListFilter className="mr-2 h-4 w-4 text-muted-foreground"/>
                <SelectValue placeholder="所有外呼组" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有外呼组</SelectItem>
                <SelectItem value="grp-001" disabled>高血压随访组 (示例)</SelectItem>
                <SelectItem value="grp-002" disabled>糖尿病教育组 (示例)</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="flex-1 min-w-[180px]">
            <label htmlFor="taskTypeFilterStats" className="text-sm font-medium text-muted-foreground">任务类型筛选</label>
            <Select value={selectedTaskTypeFilter} onValueChange={setSelectedTaskTypeFilter}>
              <SelectTrigger id="taskTypeFilterStats" className="w-full mt-1">
                 <ListFilter className="mr-2 h-4 w-4 text-muted-foreground"/>
                <SelectValue placeholder="所有任务类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有任务类型</SelectItem>
                <SelectItem value="single_patient" disabled>单个病人任务 (示例)</SelectItem>
                <SelectItem value="group_task" disabled>组任务 (示例)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="self-end mt-2 md:mt-0">
            <Activity className="mr-2 h-4 w-4" /> 应用筛选并分析
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">任务状态分布</CardTitle>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={chartConfigTaskStatus} className="h-[250px] w-full aspect-square">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name"/>} />
                            <Pie data={mockTaskStatusData} dataKey="count" nameKey="name" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                                {mockTaskStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="shadow-sm">
                 <CardHeader>
                    <CardTitle className="text-base">每日执行情况 (示例)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfigDailyExecution} className="h-[250px] w-full">
                        <RechartsBarChart data={mockDailyExecutionData} accessibilityLayer>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="success" fill="var(--color-success)" radius={4} />
                            <Bar dataKey="failed" fill="var(--color-failed)" radius={4} />
                        </RechartsBarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">详细数据列表 (开发中)</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground py-8">
                <Users className="mx-auto h-12 w-12 mb-2" />
                <p>此处将展示详细的统计数据表格，支持排序和导出。</p>
            </CardContent>
        </Card>

      </CardContent>
    </Card>
  );
}
