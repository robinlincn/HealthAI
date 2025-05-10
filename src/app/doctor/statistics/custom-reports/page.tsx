
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"; // Assuming this component exists or will be created
import { FilePieChart, Settings2, Download, TableProperties, Users, Activity, Pill } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useState } from "react";

// Placeholder for DatePickerWithRange if not yet implemented
const PlaceholderDatePickerWithRange = ({ date, onDateChange }: { date?: DateRange, onDateChange: (range?: DateRange) => void }) => (
  <div className="p-2 border rounded-md text-sm text-muted-foreground">
    日期范围选择器 (功能建设中)
    <Button onClick={() => onDateChange({ from: new Date(2024,0,1), to: new Date(2024,0,31)})} size="sm" variant="outline" className="ml-2">示例</Button>
  </div>
);


export default function DoctorStatisticsCustomReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  const handleMetricChange = (metric: string, checked: boolean | string) => {
    if (checked === true) {
        setSelectedMetrics(prev => [...prev, metric]);
    } else {
        setSelectedMetrics(prev => prev.filter(m => m !== metric));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <FilePieChart className="mr-3 h-7 w-7 text-primary" />
            自定义统计报表
          </CardTitle>
          <CardDescription>
            根据需要选择统计维度、指标和时间范围，生成自定义报表，并支持导出。
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Settings2 className="mr-2 h-5 w-5 text-muted-foreground"/>报表配置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium">选择时间范围</Label>
               {/* Replace with actual DatePickerWithRange if available */}
              <PlaceholderDatePickerWithRange date={dateRange} onDateChange={setDateRange} />
            </div>
            <div>
              <Label htmlFor="diseaseType" className="text-sm font-medium">疾病类型筛选</Label>
              <Select>
                <SelectTrigger id="diseaseType">
                  <SelectValue placeholder="所有疾病类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有疾病类型</SelectItem>
                  <SelectItem value="diabetes">糖尿病</SelectItem>
                  <SelectItem value="hypertension">高血压</SelectItem>
                  <SelectItem value="copd">慢性阻塞性肺疾病</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div>
              <Label htmlFor="reportType" className="text-sm font-medium">报表类型</Label>
              <Select>
                <SelectTrigger id="reportType">
                  <SelectValue placeholder="选择报表类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient_stats"><Users className="mr-2 h-4 w-4 inline-block"/> 病人统计</SelectItem>
                  <SelectItem value="treatment_stats"><Pill className="mr-2 h-4 w-4 inline-block"/> 治疗统计</SelectItem>
                  <SelectItem value="activity_stats"><Activity className="mr-2 h-4 w-4 inline-block"/> 活动统计</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label className="text-base font-medium">选择统计指标 (示例)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                {['病人总数', '新增病人', '活跃病人', '平均年龄', '性别分布', '血糖达标率', '血压达标率', '常用药物', '治疗方案A使用数', '检查项目频率'].map(metric => (
                    <div key={metric} className="flex items-center space-x-2">
                        <Checkbox 
                            id={metric} 
                            onCheckedChange={(checked) => handleMetricChange(metric, checked)}
                            checked={selectedMetrics.includes(metric)}
                        />
                        <Label htmlFor={metric} className="text-sm font-normal">{metric}</Label>
                    </div>
                ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline">重置配置</Button>
            <Button><TableProperties className="mr-2 h-4 w-4"/> 生成报表 (预览)</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>报表预览与导出</CardTitle>
            <Button variant="secondary" disabled={selectedMetrics.length === 0}><Download className="mr-2 h-4 w-4"/>导出报表 (Excel/PDF)</Button>
        </CardHeader>
        <CardContent>
            <div className="mt-4 p-6 border rounded-md bg-muted/30 min-h-[200px] flex items-center justify-center">
                {selectedMetrics.length > 0 ? (
                    <p className="text-muted-foreground">报表预览区：将显示基于您选择的指标 ( {selectedMetrics.join(', ')} ) 生成的表格或图表。此功能正在建设中。</p>
                ) : (
                    <p className="text-muted-foreground">请先配置报表参数并点击“生成报表”进行预览。</p>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Basic DatePickerWithRange (can be moved to ui/date-picker-with-range.tsx)
// This is a very basic placeholder. A real one would use shadcn/ui Popover and Calendar.
// For now, this component is defined here. In a real app, it should be in its own file.
// import { Calendar } from "@/components/ui/calendar"; 
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// export function DatePickerWithRange({date, onDateChange}: {date?: DateRange, onDateChange: (range?: DateRange) => void}) {
//     return (
//         <Popover>
//             <PopoverTrigger asChild>
//                 <Button variant="outline">
//                     {date?.from ? (date.to ? `${date.from.toLocaleDateString()} - ${date.to.toLocaleDateString()}` : date.from.toLocaleDateString()) : "选择日期范围"}
//                 </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0">
//                 <Calendar mode="range" selected={date} onSelect={onDateChange} initialFocus />
//             </PopoverContent>
//         </Popover>
//     )
// }
