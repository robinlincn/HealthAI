"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"; 
import { FilePieChart, Settings2, Download, TableProperties, Users, Activity, Pill, Loader2 } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function DoctorStatisticsCustomReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [reportPreview, setReportPreview] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [selectedDiseaseType, setSelectedDiseaseType] = useState<string>("all");
  const [selectedReportType, setSelectedReportType] = useState<string>("patient_stats");
  const { toast } = useToast();

  const allMetrics = ['病人总数', '新增病人', '活跃病人', '平均年龄', '性别分布', '血糖达标率', '血压达标率', '常用药物', '治疗方案A使用数', '检查项目频率', '平均住院天数', '复诊率'];


  const handleMetricChange = (metric: string, checked: boolean | string) => {
    if (checked === true) {
        setSelectedMetrics(prev => [...prev, metric]);
    } else {
        setSelectedMetrics(prev => prev.filter(m => m !== metric));
    }
  };

  const handleGenerateReport = async () => {
    if (selectedMetrics.length === 0) {
      toast({ title: "请选择指标", description: "至少选择一个统计指标来生成报告。", variant: "destructive" });
      return;
    }
    setIsLoadingPreview(true);
    setReportPreview(null);
    // Simulate API call or report generation logic
    await new Promise(resolve => setTimeout(resolve, 1500));

    let reportContent = `自定义统计报告\n============================\n\n`;
    reportContent += `报告生成时间: ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}\n`;
    if (dateRange?.from) {
      reportContent += `时间范围: ${format(dateRange.from, "yyyy-MM-dd")}`;
      if (dateRange.to) {
        reportContent += ` 至 ${format(dateRange.to, "yyyy-MM-dd")}\n`;
      } else {
        reportContent += ` (单日)\n`;
      }
    } else {
      reportContent += `时间范围: 所有时间\n`;
    }
    reportContent += `筛选疾病类型: ${selectedDiseaseType === "all" ? "所有疾病" : selectedDiseaseType}\n`;
    reportContent += `报表类型: ${selectedReportType === "patient_stats" ? "病人统计" : selectedReportType === "treatment_stats" ? "治疗统计" : "活动统计"}\n`;
    reportContent += `\n已选指标及模拟数据:\n----------------------------\n`;
    selectedMetrics.forEach(metric => {
      let mockValue: string | number;
      switch(metric) {
        case '病人总数': mockValue = Math.floor(Math.random() * 200) + 50; break;
        case '新增病人': mockValue = Math.floor(Math.random() * 30); break;
        case '活跃病人': mockValue = Math.floor(Math.random() * 150) + 40; break;
        case '平均年龄': mockValue = `${(Math.random() * 30 + 40).toFixed(1)} 岁`; break;
        case '性别分布': mockValue = `男: ${Math.floor(Math.random() * 50 + 20)}%, 女: ${Math.floor(Math.random() * 40 + 10)}%, 其他: ${Math.floor(Math.random()*5)}%`; break;
        case '血糖达标率': mockValue = `${(Math.random() * 40 + 50).toFixed(1)} %`; break;
        case '血压达标率': mockValue = `${(Math.random() * 30 + 60).toFixed(1)} %`; break;
        case '常用药物': mockValue = '二甲双胍, 硝苯地平'; break;
        case '治疗方案A使用数': mockValue = Math.floor(Math.random() * 50); break;
        case '检查项目频率': mockValue = '血糖监测 (每日), 血压测量 (每周)'; break;
        case '平均住院天数': mockValue = `${(Math.random() * 5 + 7).toFixed(1)} 天`; break;
        case '复诊率': mockValue = `${(Math.random() * 20 + 70).toFixed(1)} %`; break;
        default: mockValue = 'N/A';
      }
      reportContent += `- ${metric}: ${mockValue}\n`;
    });
    reportContent += `\n--- 报告结束 ---`;

    setReportPreview(reportContent);
    setIsLoadingPreview(false);
    toast({ title: "报告已生成", description: "自定义报告已生成并显示在预览区。" });
  };

  const handleExportReport = () => {
    if (!reportPreview) {
      toast({ title: "无报告可导出", description: "请先生成报告。", variant: "destructive"});
      return;
    }
    // Simulate PDF/Excel export
    toast({ title: "导出报告 (模拟)", description: "报告正在导出...实际导出功能需后端支持。" });
    console.log("Exporting report:", reportPreview);
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
              <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
            </div>
            <div>
              <Label htmlFor="diseaseType" className="text-sm font-medium">疾病类型筛选</Label>
              <Select name="diseaseType" value={selectedDiseaseType} onValueChange={setSelectedDiseaseType}>
                <SelectTrigger id="diseaseTypeTrigger">
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
              <Select name="reportType" value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger id="reportTypeTrigger">
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
            <Label className="text-base font-medium">选择统计指标</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2 p-4 border rounded-md max-h-60 overflow-y-auto">
                {allMetrics.map(metric => (
                    <div key={metric} className="flex items-center space-x-2">
                        <Checkbox 
                            id={metric} 
                            onCheckedChange={(checked) => handleMetricChange(metric, checked)}
                            checked={selectedMetrics.includes(metric)}
                        />
                        <Label htmlFor={metric} className="text-sm font-normal cursor-pointer">{metric}</Label>
                    </div>
                ))}
            </div>
             <p className="text-xs text-muted-foreground mt-1">已选 {selectedMetrics.length} 项指标。</p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => { setSelectedMetrics([]); setDateRange(undefined); setReportPreview(null); setSelectedDiseaseType("all"); setSelectedReportType("patient_stats"); toast({title: "配置已重置"}) }}>重置配置</Button>
            <Button onClick={handleGenerateReport} disabled={isLoadingPreview}>
              {isLoadingPreview ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TableProperties className="mr-2 h-4 w-4"/>}
              {isLoadingPreview ? "生成中..." : "生成报表 (预览)"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>报表预览与导出</CardTitle>
            <Button variant="secondary" onClick={handleExportReport} disabled={!reportPreview || isLoadingPreview}>
                <Download className="mr-2 h-4 w-4"/>导出报表 (Excel/PDF)
            </Button>
        </CardHeader>
        <CardContent>
            <div className="mt-4 p-4 border rounded-md bg-muted/30 min-h-[200px] text-sm">
                {isLoadingPreview ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary"/>
                        <p className="text-muted-foreground">正在生成报表预览...</p>
                    </div>
                ) : reportPreview ? (
                    <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto">{reportPreview}</pre>
                ) : (
                    <p className="text-muted-foreground text-center py-10">请先配置报表参数并点击“生成报表”进行预览。</p>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
