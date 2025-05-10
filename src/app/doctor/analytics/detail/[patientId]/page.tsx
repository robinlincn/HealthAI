
"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, FileSpreadsheet, LineChart as LineChartIcon, Loader2, Download, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, BarChart as RechartsBarChart, Bar, Line as RechartsLine } from "recharts";

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
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  useEffect(() => {
    const details = getPatientDetails(patientId);
    setPatient(details);
    if (details) {
      setPatientDataInput(`病人姓名: ${details.name}\n年龄: ${details.age}\n性别: ${details.gender}\n主要诊断: ${details.diagnosis}\n健康数据摘要: ${details.healthDataSummary}\n\n近期血糖数据：...\n近期血压数据：...\n主要症状：...`);
    }
  }, [patientId]);

  const handleGenerateReport = async () => {
    if (!patientDataInput.trim()) {
      toast({ title: "请输入病人数据", variant: "destructive" });
      return;
    }
    setIsLoadingReport(true);
    setGeneratedReport(null);
    // Mock AI report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockReport = `
病情分析报告 - 病人：${patient?.name || '未知'} (ID: ${patientId})
==================================

数据统计:
-----------
- 根据输入数据分析... (示例：平均血糖（近7天）: 7.8 mmol/L)
- 根据输入数据分析... (示例：血压（平均）: 135/88 mmHg)

趋势分析:
-----------
- 根据输入数据分析... (示例：血糖水平整体偏高)

异常数据标记:
-------------
- 根据输入数据分析... (示例：2024-05-03 餐后血糖达12.5 mmol/L)

初步建议:
---------
1. 建议调整当前治疗方案。
2. 强化饮食控制教育。
3. 密切监测相关指标。

**免责声明: 此报告由AI生成，仅供参考，具体诊疗请结合临床实际情况。**
    `;
    setGeneratedReport(mockReport);
    setIsLoadingReport(false);
    toast({ title: "AI病情分析报告已生成 (模拟)" });
  };

  if (!patient) {
    return (
      <div className="space-y-6 p-4">
        <Card>
          <CardHeader>
            <CardTitle>病人信息加载中或未找到</CardTitle>
          </CardHeader>
          <CardContent>
            <p>无法加载ID为 {patientId} 的病人病情分析信息。</p>
            <Button asChild variant="link" className="mt-4" onClick={() => router.push('/doctor/analytics')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> 返回病人列表
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1 md:p-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={() => router.push('/doctor/analytics')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回病人列表
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
              {/* Blood Sugar Chart */}
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

              {/* Blood Pressure Chart */}
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
                <label htmlFor="patientData" className="block text-sm font-medium mb-1">病人相关数据 (自动填充，可编辑)</label>
                <Textarea
                  id="patientData"
                  placeholder="粘贴或输入病人的健康数据、病历摘要、主诉等信息..."
                  className="min-h-[150px]"
                  value={patientDataInput}
                  onChange={(e) => setPatientDataInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">提供的数据越全面，AI分析越精准。</p>
              </div>
              <Button onClick={handleGenerateReport} disabled={isLoadingReport}>
                {isLoadingReport ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                )}
                {isLoadingReport ? "报告生成中..." : "生成分析报告"}
              </Button>

              {generatedReport && (
                <Card className="mt-6">
                  <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="text-lg">生成的分析报告</CardTitle>
                    <Button variant="outline" onClick={() => alert("导出功能暂未实现")}>
                      <Download className="mr-2 h-4 w-4" /> 导出报告
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 border rounded-md bg-muted/30 whitespace-pre-wrap text-sm max-h-[400px] overflow-y-auto">
                      {generatedReport}
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
