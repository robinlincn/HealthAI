"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Users, BarChart3, Activity, FileDown, AlertTriangle, ShieldCheck, Bot, Eye } from "lucide-react"; // Added Eye
import Link from "next/link"; // Added Link
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, ComposedChart, Line, Bar } from "recharts" 
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

const mockGroupTrendData = [
  { month: "一月", avgBloodSugar: 7.5, bpControlRate: 65 },
  { month: "二月", avgBloodSugar: 7.2, bpControlRate: 68 },
  { month: "三月", avgBloodSugar: 7.0, bpControlRate: 72 },
  { month: "四月", avgBloodSugar: 6.8, bpControlRate: 75 },
  { month: "五月", avgBloodSugar: 7.1, bpControlRate: 73 },
];

const chartConfigTrend = {
  avgBloodSugar: { label: "平均血糖 (mmol/L)", color: "hsl(var(--chart-1))" },
  bpControlRate: { label: "血压控制率 (%)", color: "hsl(var(--chart-2))" },
};

interface AiPrediction {
  patientId: string;
  patientName: string;
  predictionDate: string; 
  riskLevel: '高' | '中' | '低';
  predictedEvents: string[];
  confidence?: number; 
  primaryConcern?: string; 
}

const mockAiPredictions: AiPrediction[] = [
  {
    patientId: "pat001",
    patientName: "张三",
    predictionDate: new Date().toISOString(),
    riskLevel: '高',
    predictedEvents: ["未来1月内血糖大幅波动", "未来3月内血压升高"],
    confidence: 0.75,
    primaryConcern: "血糖控制恶化"
  },
  {
    patientId: "pat002",
    patientName: "李四",
    predictionDate: new Date().toISOString(),
    riskLevel: '中',
    predictedEvents: ["心血管事件风险轻度增加"],
    confidence: 0.60,
    primaryConcern: "心血管健康"
  },
  {
    patientId: "pat004",
    patientName: "赵六",
    predictionDate: new Date().toISOString(),
    riskLevel: '低',
    predictedEvents: ["病情相对稳定"],
    confidence: 0.85,
    primaryConcern: "维持当前状态"
  },
];

export default function DoctorStatisticsTrendsPage() {
  const getRiskBadgeVariant = (riskLevel: AiPrediction['riskLevel']) => {
    if (riskLevel === '高') return 'destructive';
    if (riskLevel === '中') return 'default'; 
    return 'secondary';
  };
  
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <TrendingUp className="mr-3 h-7 w-7 text-primary" />
            病情趋势分析
          </CardTitle>
          <CardDescription>
            分析病人群体的健康数据，如平均血糖水平、血压控制情况等，并基于历史数据预测病情发展趋势，提前干预。
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>群体健康数据趋势</CardTitle>
          <div className="flex gap-2 mt-2">
            <Select defaultValue="all_patients">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择病人群体" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_patients">所有病人</SelectItem>
                <SelectItem value="diabetes_type2">2型糖尿病患者</SelectItem>
                <SelectItem value="hypertension">高血压患者</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="last_6_months">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择时间范围" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_3_months">近3个月</SelectItem>
                <SelectItem value="last_6_months">近6个月</SelectItem>
                <SelectItem value="last_12_months">近1年</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">应用筛选</Button>
          </div>
        </CardHeader>
        <CardContent>
           <ChartContainer config={chartConfigTrend} className="h-[350px] w-full">
            <ComposedChart data={mockGroupTrendData} accessibilityLayer margin={{ left: 0, right: 10 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis yAxisId="left" orientation="left" stroke="var(--color-avgBloodSugar)" domain={[5,10]} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--color-bpControlRate)" domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line yAxisId="left" type="monotone" dataKey="avgBloodSugar" stroke="var(--color-avgBloodSugar)" strokeWidth={2} dot={true} name="平均血糖" />
              <Bar yAxisId="right" dataKey="bpControlRate" fill="var(--color-bpControlRate)" radius={4} name="血压控制率" />
            </ComposedChart>
          </ChartContainer>
          <div className="flex justify-end mt-4">
             <Button variant="secondary"><FileDown className="mr-2 h-4 w-4"/>导出趋势报告 (PDF)</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center"><Bot className="mr-2 h-5 w-5 text-muted-foreground"/>病情发展趋势预测 (AI)</CardTitle>
            <CardDescription>基于历史数据和AI模型，预测高危病人病情发展趋势。</CardDescription>
        </CardHeader>
        <CardContent>
            {mockAiPredictions.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockAiPredictions.map(pred => (
                  <Card key={pred.patientId} className="shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{pred.patientName} ({pred.patientId})</CardTitle>
                        <Badge variant={getRiskBadgeVariant(pred.riskLevel)}>{pred.riskLevel}风险</Badge>
                      </div>
                      <CardDescription className="text-xs">预测日期: {format(parseISO(pred.predictionDate), "yyyy-MM-dd")}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                      {pred.primaryConcern && <p><strong>主要关注:</strong> {pred.primaryConcern}</p>}
                      <p><strong>预测事件:</strong></p>
                      <ul className="list-disc list-inside pl-2 text-xs text-muted-foreground">
                        {pred.predictedEvents.map((event, i) => <li key={i}>{event}</li>)}
                      </ul>
                      {pred.confidence && <p className="text-xs mt-1">置信度: {(pred.confidence * 100).toFixed(0)}%</p>}
                    </CardContent>
                    <CardContent className="pt-0 pb-3">
                       <Button asChild variant="link" size="sm" className="p-0 h-auto text-xs">
                          <Link href={`/doctor/analytics/ai-report/${pred.patientId}`}>
                            <Eye className="mr-1 h-3 w-3" /> 查看完整AI报告
                          </Link>
                       </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center text-center">
                  <BarChart3 className="w-24 h-24 text-primary/30 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground/70">暂无AI预测数据</h3>
                  <p className="text-foreground/50 max-w-md">
                  AI预测模型正在努力工作中，请稍后再来查看。
                  </p>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
