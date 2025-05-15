
"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, UserCircle, AlertTriangle, FileText, Activity, Lightbulb, ShieldAlert, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Separator } from "@/components/ui/separator";

// Mock data structures (can be expanded)
interface AiPredictionDetail {
  patientId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  primaryDiagnosis?: string;
  predictionDate: string; 
  riskLevel: '高' | '中' | '低';
  primaryConcern?: string; 
  predictedEvents: Array<{ event: string; confidence?: number; timeframe?: string }>;
  keyObservations: string[];
  recommendedInterventions: Array<{ action: string; priority: 'High' | 'Medium' | 'Low'; rationale?: string }>;
  confidenceScore?: number; // Overall confidence for the report
  reportGeneratedDate: string;
}

// Mock detailed AI report data - in a real app, this would be fetched
const mockDetailedAiReports: Record<string, AiPredictionDetail> = {
  "pat001": {
    patientId: "pat001",
    patientName: "张三",
    patientAge: 45,
    patientGender: "男",
    primaryDiagnosis: "高血压, 2型糖尿病",
    predictionDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    riskLevel: '高',
    primaryConcern: "血糖控制恶化和心血管事件风险",
    predictedEvents: [
      { event: "未来1月内血糖大幅波动", confidence: 0.75, timeframe: "未来1个月" },
      { event: "未来3月内血压升高超出目标范围", confidence: 0.65, timeframe: "未来3个月" },
      { event: "未来6月内心血管事件（如心绞痛）风险增加", confidence: 0.70, timeframe: "未来6个月" },
    ],
    keyObservations: [
      "过去两周空腹血糖平均值 8.2 mmol/L，餐后血糖平均值 11.5 mmol/L，均高于控制目标。",
      "血压记录显示波动较大，收缩压多次超过 140 mmHg。",
      "病人报告近期有轻微头晕症状，且夜间睡眠质量不佳。",
      "饮食日记（若有）显示近期高GI食物摄入偏多。",
      "药物依从性评分 7/10 (模拟数据)。"
    ],
    recommendedInterventions: [
      { action: "立即安排复诊，评估当前血糖和血压控制情况。", priority: 'High', rationale: "关键指标未达标，需及时调整方案。" },
      { action: "强化糖尿病和高血压饮食教育，强调低盐低脂低糖饮食。", priority: 'High', rationale: "饮食是影响血糖血压的重要因素。" },
      { action: "考虑调整降糖药物方案，例如增加二甲双胍剂量或联用其他降糖药。", priority: 'Medium', rationale: "当前血糖控制不佳。" },
      { action: "建议增加规律的有氧运动，如每日快走30分钟。", priority: 'Medium', rationale: "运动有助于改善血糖和血压。" },
      { action: "进行一次24小时动态血压监测，以更准确评估血压波动情况。", priority: 'Medium', rationale: "了解全天血压模式。" },
    ],
    confidenceScore: 0.72,
    reportGeneratedDate: new Date().toISOString(),
  },
  "pat002": {
    patientId: "pat002",
    patientName: "李四",
    patientAge: 62,
    patientGender: "女",
    primaryDiagnosis: "冠心病",
    predictionDate: new Date(Date.now() - 86400000 * 2).toISOString(), // Two days ago
    riskLevel: '中',
    primaryConcern: "心血管事件复发风险",
    predictedEvents: [
      { event: "未来6个月内心绞痛发作频率可能增加", confidence: 0.60, timeframe: "未来6个月" },
      { event: "药物依从性下降可能导致病情不稳定", confidence: 0.55, timeframe: "持续关注" },
    ],
    keyObservations: [
      "病人报告近期偶有胸闷，特别是在体力活动后。",
      "血脂检查显示LDL-C水平略高于目标值。",
      "生活方式：病人近期因家庭原因减少了日常活动量。",
    ],
    recommendedInterventions: [
      { action: "提醒病人按时服药，并询问是否有药物副作用。", priority: 'High', rationale: "确保治疗方案有效执行。" },
      { action: "评估当前抗血小板和调脂药物治疗方案是否需要优化。", priority: 'Medium', rationale: "控制血脂和预防血栓。" },
      { action: "鼓励病人逐步恢复适度的日常活动，如散步。", priority: 'Medium', rationale: "有益于心脏康复。" },
      { action: "安排一次心脏功能复查（如心电图、超声心动图）。", priority: 'Low', rationale: "定期评估心脏状况。" },
    ],
    confidenceScore: 0.63,
    reportGeneratedDate: new Date().toISOString(),
  },
   "pat004": {
    patientId: "pat004",
    patientName: "赵六",
    patientAge: 71,
    patientGender: "男",
    primaryDiagnosis: "慢性阻塞性肺疾病",
    predictionDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    riskLevel: '低',
    primaryConcern: "病情急性加重风险",
    predictedEvents: [
      { event: "未来3个月内病情急性加重风险较低，但需注意季节变化", confidence: 0.85, timeframe: "未来3个月" },
    ],
    keyObservations: [
      "病人近期呼吸道症状稳定，无明显加重。",
      "肺功能检查结果与上次相比无明显变化。",
      "坚持使用吸入性药物，自我管理能力较好。",
    ],
    recommendedInterventions: [
      { action: "继续当前治疗方案，保持良好用药依从性。", priority: 'Low', rationale: "病情稳定，维持现状。" },
      { action: "提醒病人在季节交替时注意保暖，预防感冒。", priority: 'Low', rationale: "降低急性加重诱因。" },
      { action: "鼓励参与肺康复锻炼。", priority: 'Low', rationale: "改善肺功能和生活质量。" },
    ],
    confidenceScore: 0.88,
    reportGeneratedDate: new Date().toISOString(),
  },
};

export default function DetailedAiReportPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;
  const reportData = mockDetailedAiReports[patientId];

  const getRiskBadgeVariant = (riskLevel?: AiPredictionDetail['riskLevel']) => {
    if (!riskLevel) return 'outline';
    if (riskLevel === '高') return 'destructive';
    if (riskLevel === '中') return 'default';
    return 'secondary';
  };

  if (!reportData) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">AI分析报告未找到</CardTitle>
          </CardHeader>
          <CardContent>
            <p>无法找到病人ID为 {patientId} 的AI分析报告数据。</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-1 md:p-4 space-y-4">
      <Button variant="outline" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" /> 返回趋势分析
      </Button>

      <Card className="shadow-lg">
        <CardHeader className="bg-primary/5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle className="text-2xl flex items-center text-primary">
                <BarChart3 className="mr-2 h-6 w-6" />
                AI病情发展趋势分析报告
              </CardTitle>
              <CardDescription>
                报告生成于: {format(parseISO(reportData.reportGeneratedDate), "yyyy年MM月dd日 HH:mm")}
              </CardDescription>
            </div>
            {reportData.confidenceScore && (
                <Badge variant="outline" className="mt-2 sm:mt-0 text-sm">
                    报告置信度: {(reportData.confidenceScore * 100).toFixed(0)}%
                </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><UserCircle className="mr-2 h-5 w-5 text-muted-foreground"/>病人信息</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p><strong>姓名:</strong> {reportData.patientName}</p>
              <p><strong>ID:</strong> {reportData.patientId}</p>
              {reportData.patientAge && <p><strong>年龄:</strong> {reportData.patientAge}岁</p>}
              {reportData.patientGender && <p><strong>性别:</strong> {reportData.patientGender}</p>}
              {reportData.primaryDiagnosis && <p className="md:col-span-2"><strong>主要诊断:</strong> {reportData.primaryDiagnosis}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-destructive"/>风险评估与主要关注点</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center"><strong>总体风险等级:</strong> <Badge variant={getRiskBadgeVariant(reportData.riskLevel)} className="ml-2 text-base px-2 py-0.5">{reportData.riskLevel}</Badge></div>
              {reportData.primaryConcern && <p><strong>主要关注:</strong> {reportData.primaryConcern}</p>}
              <p className="text-xs text-muted-foreground">预测日期: {format(parseISO(reportData.predictionDate), "yyyy年MM月dd日")}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><FileText className="mr-2 h-5 w-5 text-muted-foreground"/>预测事件详情</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {reportData.predictedEvents.map((eventData, index) => (
                  <li key={index} className="p-3 border rounded-md bg-muted/20">
                    <p className="font-medium">{eventData.event}</p>
                    {eventData.timeframe && <p className="text-xs text-muted-foreground">预测时间窗: {eventData.timeframe}</p>}
                    {eventData.confidence !== undefined && <p className="text-xs text-muted-foreground">置信度: {(eventData.confidence * 100).toFixed(0)}%</p>}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><Activity className="mr-2 h-5 w-5 text-muted-foreground"/>关键观察点 / 数据依据</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {reportData.keyObservations.map((obs, index) => (
                  <li key={index}>{obs}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-muted-foreground"/>建议的下一步 / 干预措施</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {reportData.recommendedInterventions.map((int, index) => (
                  <li key={index} className="p-3 border rounded-md bg-muted/20">
                    <div className="flex justify-between items-start">
                        <p className="font-medium">{int.action}</p>
                        <Badge variant={int.priority === 'High' ? 'destructive' : (int.priority === 'Medium' ? 'default' : 'outline')} className="text-xs">{int.priority}优先级</Badge>
                    </div>
                    {int.rationale && <p className="text-xs text-muted-foreground mt-1">理由: {int.rationale}</p>}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

        </CardContent>
        <CardFooter className="border-t pt-4">
            <div className="text-xs text-muted-foreground space-y-1">
                <p className="flex items-center"><ShieldAlert className="h-4 w-4 mr-1.5 text-yellow-600"/><strong>免责声明:</strong></p>
                <p>此AI生成的报告仅为临床决策提供辅助参考，不能替代执业医师的专业判断。所有医疗决策应由具备相应资质的医疗专业人员结合病人的具体情况最终做出。</p>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
