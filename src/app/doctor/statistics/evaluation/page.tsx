
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Users, BarChart3, FileDown, GitCompareArrows, Activity, ThumbsUp, TrendingDown, TrendingUp, MessageSquare } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge"; // Added import for Badge

// Mock data for demonstration
const mockEvaluationData = [
  { metric: "平均空腹血糖", before: 8.5, after: 6.8, unit: "mmol/L" },
  { metric: "糖化血红蛋白", before: 7.9, after: 7.1, unit: "%" },
  { metric: "血压达标率", before: 60, after: 75, unit: "%" },
  { metric: "体重变化", before: 85, after: 82, unit: "kg" },
];

const chartConfigEvaluation = {
  before: { label: "治疗前", color: "hsl(var(--chart-2))" }, // Sky blue
  after: { label: "治疗后", color: "hsl(var(--chart-1))" },   // Teal
};

const mockReportDetails = {
  patientName: "张三 (pat001)",
  treatmentPlan: "糖尿病管理方案 (2024 Q1)",
  period: "2024-01-01 至 2024-03-31",
  summary: "患者张三在本季度糖尿病管理方案实施后，各项关键指标均有显著改善。空腹血糖平均值从8.5 mmol/L下降至6.8 mmol/L，糖化血红蛋白由7.9%降至7.1%。血压控制情况良好，达标率从60%提升至75%。体重亦有所下降。总体评估为治疗有效，建议继续当前方案并加强生活方式干预。",
  keyMetricChanges: [
    { metric: "空腹血糖", change: "-1.7 mmol/L", icon: TrendingDown, iconColor: "text-green-500" },
    { metric: "糖化血红蛋白", change: "-0.8%", icon: TrendingDown, iconColor: "text-green-500" },
    { metric: "血压达标率", change: "+15%", icon: TrendingUp, iconColor: "text-green-500" },
    { metric: "体重", change: "-3 kg", icon: TrendingDown, iconColor: "text-green-500" },
  ],
  patientFeedback: "患者反馈自我感觉良好，精力有所提升，愿意继续配合治疗。",
  adherence: "药物依从性评估为 90%，饮食控制依从性 75%。",
  recommendations: "1. 继续当前药物治疗方案。\n2. 加强饮食控制宣教，争取将饮食依从性提高至85%以上。\n3. 鼓励每日进行至少30分钟中等强度运动。\n4. 3个月后复查糖化血红蛋白及相关并发症筛查。",
  effectTracking: [
    { date: "2024-01-15", note: "开始执行新方案，空腹血糖8.2 mmol/L。", status: "进行中" },
    { date: "2024-02-10", note: "复诊，空腹血糖7.5 mmol/L，调整饮食结构。", status: "调整" },
    { date: "2024-03-20", note: "电话随访，患者反馈良好，空腹血糖平均7.0 mmol/L。", status: "持续" },
  ]
};


export default function DoctorStatisticsEvaluationPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <ShieldCheck className="mr-3 h-7 w-7 text-primary" />
            治疗效果评估
          </CardTitle>
          <CardDescription>
            对比病人治疗前后的健康数据，评估治疗方案的有效性，并生成评估报告。
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>治疗效果对比分析</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <Input placeholder="搜索病人ID或姓名 (pat001)" className="max-w-xs h-9" />
            <Select defaultValue="diabetes_plan_xyz">
              <SelectTrigger className="w-full sm:w-[220px] h-9">
                <SelectValue placeholder="选择治疗方案/周期" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diabetes_plan_xyz">糖尿病管理方案 (2024 Q1)</SelectItem>
                <SelectItem value="hypertension_adj">高血压药物调整 (2024-03)</SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-9">加载对比数据</Button>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfigEvaluation} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockEvaluationData} layout="vertical" accessibilityLayer margin={{ left: 20, right: 20}}>
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="metric" type="category" width={100} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="before" fill="var(--color-before)" radius={4} name="治疗前" />
                    <Bar dataKey="after" fill="var(--color-after)" radius={4} name="治疗后" />
                </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <p className="text-sm text-muted-foreground mt-2">图表显示关键指标在治疗前后的变化。单位：血糖(mmol/L), 糖化(%), 达标率(%), 体重(kg)。</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle className="flex items-center"><GitCompareArrows className="mr-2 h-5 w-5 text-muted-foreground"/>评估报告与效果跟踪</CardTitle>
                <CardDescription>生成详细的治疗效果评估报告，并持续跟踪病人治疗效果以调整方案。</CardDescription>
            </div>
            <Button variant="secondary"><FileDown className="mr-2 h-4 w-4"/>导出评估报告 (PDF)</Button>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">评估报告摘要 - {mockReportDetails.patientName}</h3>
              <p className="text-xs text-muted-foreground">治疗方案: {mockReportDetails.treatmentPlan} | 评估周期: {mockReportDetails.period}</p>
              <p className="mt-2 text-sm bg-muted/30 p-3 rounded-md">{mockReportDetails.summary}</p>
            </div>

            <Separator />

            <div>
                <h4 className="text-md font-semibold mb-2">关键指标变化</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {mockReportDetails.keyMetricChanges.map(item => {
                        const ChangeIcon = item.icon;
                        return (
                            <div key={item.metric} className="flex items-center p-2 border rounded-md text-sm">
                                <ChangeIcon className={`h-5 w-5 mr-2 ${item.iconColor}`} />
                                <span>{item.metric}: <strong className={item.iconColor}>{item.change}</strong></span>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-md font-semibold mb-2 flex items-center"><MessageSquare className="h-4 w-4 mr-1.5 text-blue-500" />患者反馈与依从性</h4>
                    <p className="text-sm"><strong>反馈:</strong> {mockReportDetails.patientFeedback}</p>
                    <p className="text-sm"><strong>依从性:</strong> {mockReportDetails.adherence}</p>
                </div>
                 <div>
                    <h4 className="text-md font-semibold mb-2 flex items-center"><Activity className="h-4 w-4 mr-1.5 text-green-500"/>后续建议</h4>
                    <p className="text-sm whitespace-pre-line">{mockReportDetails.recommendations}</p>
                </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-md font-semibold mb-2">效果跟踪记录 (示例)</h4>
              {mockReportDetails.effectTracking.length > 0 ? (
                <ul className="space-y-2">
                  {mockReportDetails.effectTracking.map((track, index) => (
                    <li key={index} className="p-2 border rounded-md text-sm bg-muted/20">
                      <p><strong>{track.date}:</strong> {track.note} <Badge variant="outline" className="ml-2 text-xs">{track.status}</Badge></p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">暂无效果跟踪记录。</p>
              )}
            </div>
             <p className="text-xs text-muted-foreground text-center pt-4">
              此为模拟评估报告。实际应用中将基于真实数据动态生成。
            </p>
        </CardContent>
      </Card>
    </div>
  );
}

