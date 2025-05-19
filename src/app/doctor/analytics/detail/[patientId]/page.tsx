
"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, FileSpreadsheet, LineChart as LineChartIcon, Loader2, Download, UserCircle, CalendarClock, Leaf, Zap, Bed, Pill, Smile, ShieldAlertIcon, ShieldAlert } from "lucide-react"; // Added more icons
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
import { Separator } from "@/components/ui/separator";

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

const PillarCard = ({ title, icon: Icon, analysis, recommendations }: { title: string, icon: React.ElementType, analysis?: string, recommendations?: string }) => (
  <Card className="shadow-sm">
    <CardHeader className="pb-3">
      <CardTitle className="text-md flex items-center">
        <Icon className="mr-2 h-5 w-5 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="text-sm space-y-2">
      <div>
        <h4 className="font-semibold text-xs text-muted-foreground mb-0.5">分析:</h4>
        <p className="text-foreground/80 whitespace-pre-wrap">{analysis || "暂无相关分析。"}</p>
      </div>
      <div>
        <h4 className="font-semibold text-xs text-muted-foreground mb-0.5">建议:</h4>
        <p className="text-foreground/80 whitespace-pre-wrap">{recommendations || "暂无相关建议。"}</p>
      </div>
    </CardContent>
  </Card>
);


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
      // Pre-fill with more comprehensive placeholder data for the six pillars
      setPatientDataInput(
        `病人姓名: ${details.name}\n年龄: ${details.age}\n性别: ${details.gender}\n主要诊断: ${details.diagnosis}\n健康数据摘要: ${details.healthDataSummary}\n\n` +
        `饮食记录 (示例):\n- 早餐: 燕麦粥一碗, 鸡蛋一个\n- 午餐: 米饭半碗, 清炒时蔬, 鸡胸肉100g\n- 晚餐: 杂粮馒头一个, 豆腐炒青菜\n\n` +
        `运动记录 (示例):\n- 每周快走3次, 每次30分钟\n- 日均步数: 6000步\n\n` +
        `睡眠记录 (示例):\n- 平均睡眠时长: 7小时/晚\n- 自述睡眠质量: 一般, 偶有早醒\n\n` +
        `药物服用 (示例):\n- 二甲双胍: 500mg, 每日两次, 依从性良好\n- 硝苯地平: 30mg, 每日一次, 按时服用\n\n` +
        `情绪与压力 (示例):\n- 近期工作压力较大, 自述情绪尚可\n- SAS焦虑自评: 35分 (轻度焦虑)\n\n` +
        `毒素暴露 (示例):\n- 吸烟史: 已戒烟5年\n- 饮酒: 每周社交饮酒1-2次, 啤酒1瓶左右\n\n` +
        `近期血糖数据（示例）：...\n近期血压数据（示例）：...\n主要症状：...`
      );
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
        reportType: selectedReportPeriod, 
        userPreferences: "请重点分析六大健康支柱：饮食、运动、睡眠、药物、情绪、毒素。并给出具体的生活方式调整建议。", 
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
                <Label htmlFor="patientData" className="block text-sm font-medium mb-1">病人相关数据 (请确保与所选周期及六大健康支柱相关)</Label>
                <Textarea
                  id="patientData"
                  placeholder="粘贴或输入病人的健康数据，包括饮食、运动、睡眠、药物、情绪、毒素（如吸烟饮酒）等方面的信息，以及常规监测指标..."
                  className="min-h-[200px]"
                  value={patientDataInput}
                  onChange={(e) => setPatientDataInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">提供的数据越全面、与所选周期和六大支柱越匹配，AI分析越精准。</p>
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
                <Card className="mt-6 border-primary/20">
                  <CardHeader className="bg-primary/5 flex flex-row justify-between items-center">
                    <CardTitle className="text-xl text-primary">{generatedReport.reportTitle || "AI分析报告"}</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => toast({title: "提示", description: "导出功能暂未实现。"})}>
                      <Download className="mr-2 h-4 w-4" /> 导出报告
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-6">
                     <Card className="border-muted-foreground/30">
                        <CardHeader className="pb-2"><CardTitle className="text-lg">总体摘要</CardTitle></CardHeader>
                        <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">{generatedReport.reportSummary}</CardContent>
                     </Card>
                     
                     <Separator />

                    <div className="grid md:grid-cols-2 gap-4">
                        <PillarCard title="饮食分析与建议" icon={Leaf} analysis={generatedReport.dietAnalysis?.analysis} recommendations={generatedReport.dietAnalysis?.recommendations} />
                        <PillarCard title="运动分析与建议" icon={Zap} analysis={generatedReport.exerciseAnalysis?.analysis} recommendations={generatedReport.exerciseAnalysis?.recommendations} />
                        <PillarCard title="睡眠分析与建议" icon={Bed} analysis={generatedReport.sleepAnalysis?.analysis} recommendations={generatedReport.sleepAnalysis?.recommendations} />
                        <PillarCard title="药物分析与建议" icon={Pill} analysis={generatedReport.medicationAnalysis?.analysis} recommendations={generatedReport.medicationAnalysis?.recommendations} />
                        <PillarCard title="情绪分析与建议" icon={Smile} analysis={generatedReport.emotionAnalysis?.analysis} recommendations={generatedReport.emotionAnalysis?.recommendations} />
                        <PillarCard title="毒素暴露分析与建议" icon={ShieldAlert} analysis={generatedReport.toxinAnalysis?.analysis} recommendations={generatedReport.toxinAnalysis?.recommendations} />
                    </div>
                  </CardContent>
                   <CardFooter className="border-t pt-4 mt-4">
                      <div className="text-xs text-muted-foreground space-y-1">
                          <p className="flex items-center"><ShieldAlertIcon className="h-4 w-4 mr-1.5 text-yellow-600"/><strong>免责声明:</strong></p>
                          <p>此AI生成的报告仅为临床决策提供辅助参考，不能替代执业医师的专业判断。所有医疗决策应由具备相应资质的医疗专业人员结合病人的具体情况最终做出。</p>
                      </div>
                  </CardFooter>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

