
"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, FileSpreadsheet, LineChart as LineChartIcon, Loader2, Download, UserCircle, CalendarClock } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateDataAnalysisReport, type GenerateDataAnalysisReportInput, type GenerateDataAnalysisReportOutput } from "@/ai/flows/generate-data-analysis-report";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart as RechartsLineChart, BarChart as RechartsBarChart, Bar, Line as RechartsLine } from "recharts";

// Mock data fetching function (similar to /doctor/patients/[patientId]/page.tsx)
const getPatientDetails = (patientId: string) => {
  const mockPatientsList = [
    { id: "pat001", name: "张三", age: 45, gender: "男", diagnosis: "高血压, 2型糖尿病", healthDataSummary: "血糖近期偏高。血压控制尚可。" },
    { id: "pat002", name: "李四", age: 62, gender: "女", diagnosis: "冠心病", healthDataSummary: "心率稳定，偶有胸闷。" },
    { id: "pat003", name: "王五", age: 50, gender: "男", diagnosis: "高血脂", healthDataSummary: "血脂水平持续较高。" },
  ];
  return mockPatientsList.find(p => p.id === patientId) || null;
};

// Mock chart data - in a real app, this would be fetched for the specific patient
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

export default function PatientAnalyticsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;
  const [patient, setPatient] = useState<ReturnType<typeof getPatientDetails>>(null);
  const { toast } = useToast();
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [patientDataInput, setPatientDataInput] = useState("");
  const [generatedReport, setGeneratedReport] = useState<GenerateDataAnalysisReportOutput | null>(null);
  const [selectedReportPeriod, setSelectedReportPeriod] = useState<string>("monthly_report"); // Default to monthly

  useEffect(() => {
    const details = getPatientDetails(patientId);
    setPatient(details);
    if (details) {
      setPatientDataInput(`病人姓名: ${details.name}\n年龄: ${details.age}\n性别: ${details.gender}\n主要诊断: ${details.diagnosis}\n健康数据摘要: ${details.healthDataSummary}\n\n近期血糖数据（示例）：...\n近期血压数据（示例）：...\n主要症状：...\n`);
    }
  }, [patientId]);

  const handleGenerateReport = async () => {
    if (!patientDataInput.trim()) {
      toast({ title: "请输入病人数据", variant: "destructive", description: "需要提供病人健康数据以生成报告。" });
      return;
    }
    setIsLoadingReport(true);
    setGeneratedReport(null);
    
    try {
      const reportInput: GenerateDataAnalysisReportInput = {
        healthData: patientDataInput,
        reportType: selectedReportPeriod, // Pass selected period
        userPreferences: "请重点关注血糖和血压的控制情况，并给出具体的生活方式调整建议。", // Example preference
      };
      const result = await generateDataAnalysisReport(reportInput);
      setGeneratedReport(result);
      toast({ title: "AI病情分析报告已生成", description: "报告内容已显示在下方。" });
    } catch (error) {
      console.error("Error generating AI report:", error);
      toast({ title: "报告生成失败", description: "AI分析时发生错误，请稍后再试。", variant: "destructive" });
    } finally {
      setIsLoadingReport(false);
    }
  };
  
  const reportPeriodOptions = [
    { value: "daily_report", label: "每日报告" },
    { value: "weekly_report", label: "每周报告" },
    { value: "biweekly_report", label: "半月报告" },
    { value: "monthly_report", label: "月度报告" },
    { value: "quarterly_report", label: "季度报告" },
    { value: "semiannual_report", label: "半年度报告" },
    { value: "annual_report", label: "年度报告" },
  ];


  if (!patient) {
    return (
      <div className="space-y-6 p-4">
        <Card>
          <CardHeader>
            <CardTitle>病人信息加载中或未找到</CardTitle>
          </CardHeader>
          <CardContent>
            <p>无法加载ID为 {patientId} 的病人病情分析信息。</p>
            <Button variant="link" className="mt-4" asChild>
              <Link href="/doctor/analytics" className="inline-flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" /> 返回病人列表
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1 md:p-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={() => router.push('/doctor/analytics')} >
          <span className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> 返回病人列表
          </span>
        </Button>
        <h1 className="text-xl md:text-2xl font-semibold flex items-center">
          <UserCircle className="mr-2 h-6 w-6 md:h-7 md:w-7 text-primary" />
          病情分析: {patient.name}
        </h1>
        <div /> 
      </div>

      <Tabs defaultValue="visualization" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visualization"><BarChart3 className="mr-2 h-4 w-4" />健康数据可视化</TabsTrigger>
          <TabsTrigger value="aiReport"><FileSpreadsheet className="mr-2 h-4 w-4" />AI分析报告</TabsTrigger>
        </TabsList>

        <TabsContent value="visualization">
          <Card>
            <CardHeader>
              <CardTitle>健康数据可视化</CardTitle>
              <CardDescription>查看病人 {patient.name} 的健康数据趋势。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">血糖数据趋势</CardTitle>
                  <CardDescription>支持按日、周、月、年查看，并标注药物调整等事件 (功能建设中)。</CardDescription>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">血压数据趋势</CardTitle>
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
               <p className="text-sm text-muted-foreground text-center pt-4">更多数据可视化及数据标注功能正在建设中。</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aiReport">
          <Card>
            <CardHeader>
              <CardTitle>AI辅助病情分析报告</CardTitle>
              <CardDescription>为病人 {patient.name} 生成AI分析报告。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="reportPeriodSelect" className="block text-sm font-medium mb-1">选择报告周期</Label>
                <Select value={selectedReportPeriod} onValueChange={setSelectedReportPeriod}>
                    <SelectTrigger id="reportPeriodSelect" className="w-full md:w-[240px]">
                         <CalendarClock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="选择报告周期" />
                    </SelectTrigger>
                    <SelectContent>
                        {reportPeriodOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">选择周期后，请在下方文本框中提供该周期内的相关健康数据。</p>
              </div>

              <div>
                <Label htmlFor="patientData" className="block text-sm font-medium mb-1">病人相关数据 (请确保与所选周期一致)</Label>
                <Textarea
                  id="patientData"
                  placeholder="粘贴或输入病人的健康数据、病历摘要、主诉等信息..."
                  className="min-h-[150px]"
                  value={patientDataInput}
                  onChange={(e) => setPatientDataInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">提供的数据越全面、与所选周期越匹配，AI分析越精准。</p>
              </div>
              <Button onClick={handleGenerateReport} disabled={isLoadingReport}>
                {isLoadingReport ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                )}
                {isLoadingReport ? "报告生成中..." : "生成分析报告"}
              </Button>
              <p className="text-xs text-muted-foreground">自动生成并推送报告给病人的功能正在规划中。医生可根据半月或月度报告调整治疗计划。</p>

              {generatedReport && (
                <Card className="mt-6">
                  <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="text-lg">{generatedReport.reportTitle || "AI分析报告"}</CardTitle>
                    <Button variant="outline" onClick={() => toast({title: "提示", description: "导出功能暂未实现。"})}>
                      <Download className="mr-2 h-4 w-4" /> 导出报告
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                     <div>
                        <h3 className="font-semibold mb-1">报告摘要:</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{generatedReport.reportSummary}</p>
                     </div>
                     <div>
                        <h3 className="font-semibold mb-1">详细分析:</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{generatedReport.reportDetails}</p>
                     </div>
                      <div>
                        <h3 className="font-semibold mb-1">AI建议:</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{generatedReport.recommendations}</p>
                     </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

