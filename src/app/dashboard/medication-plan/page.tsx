
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill, ListChecks, Edit3, History, PlusCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Mock data types (simplified version of what might be in src/lib/types.ts)
interface MockMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
  startDate?: string; // ISO
  endDate?: string; // ISO
}

interface MockMedicationAdjustment {
  id: string;
  date: string; // ISO string
  changeDetails: string;
  reason?: string;
  physicianName?: string;
}

interface MockMedicationLogEntry {
  id: string;
  medicationName: string;
  timeTaken: string; // ISO string
  status: '已服用' | '已跳过' | '稍后提醒';
  notes?: string;
}

const mockCurrentMedicationPlan = {
  doctorName: "王医生",
  planStartDate: "2024-05-01T00:00:00.000Z",
  medications: [
    { id: "med1", name: "二甲双胍片", dosage: "500mg", frequency: "每日两次", notes: "随餐服用", startDate: "2024-05-01T00:00:00.000Z" },
    { id: "med2", name: "硝苯地平控释片", dosage: "30mg", frequency: "每日一次", notes: "晨起服用", startDate: "2024-04-15T00:00:00.000Z" },
    { id: "med3", name: "阿司匹林肠溶片", dosage: "100mg", frequency: "每日一次", notes: "晚餐后", startDate: "2024-03-01T00:00:00.000Z", endDate: "2024-06-01T00:00:00.000Z" },
  ],
  generalInstructions: "请严格按照医嘱服药，注意监测血糖和血压。如有任何不适，请及时与我联系或就近就医。保持良好作息和饮食习惯。",
};

const mockMedicationAdjustments: MockMedicationAdjustment[] = [
  { id: "adj1", date: "2024-05-15T00:00:00.000Z", physicianName: "王医生", changeDetails: "二甲双胍片剂量由500mg每日两次调整为850mg每日两次。", reason: "近期血糖控制不佳，餐后血糖偏高。" },
  { id: "adj2", date: "2024-04-01T00:00:00.000Z", physicianName: "李医生", changeDetails: "停用格列齐特，开始使用二甲双胍。", reason: "患者出现轻微低血糖反应。" },
];

const mockMedicationLogs: MockMedicationLogEntry[] = [
  { id: "log1", medicationName: "二甲双胍片", timeTaken: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), status: "已服用" },
  { id: "log2", medicationName: "硝苯地平控释片", timeTaken: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), status: "已服用" },
  { id: "log3", medicationName: "二甲双胍片", timeTaken: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), status: "已跳过", notes: "忘记了" },
];


export default function MedicationPlanPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogMedicationAction = (medicationName: string, action: MockMedicationLogEntry['status']) => {
    // This is a mock action. In a real app, this would update state and possibly a backend.
    toast({
      title: "用药记录 (模拟)",
      description: `已将 "${medicationName}" 标记为 "${action}"。`,
    });
  };
  
  const getStatusBadge = (status: MockMedicationLogEntry['status']) => {
    switch(status) {
      case '已服用': return <Badge className="bg-green-100 text-green-700"><CheckCircle className="mr-1 h-3 w-3"/>已服用</Badge>;
      case '已跳过': return <Badge className="bg-red-100 text-red-700"><XCircle className="mr-1 h-3 w-3"/>已跳过</Badge>;
      case '稍后提醒': return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="mr-1 h-3 w-3"/>稍后提醒</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="plan" className="w-full">
        <TabsList className="grid w-full grid-cols-3 text-sm h-10">
          <TabsTrigger value="plan" className="py-2 px-1">
            <ListChecks className="mr-1 h-4 w-4" /> 用药计划
          </TabsTrigger>
          <TabsTrigger value="adjustments" className="py-2 px-1">
            <Edit3 className="mr-1 h-4 w-4" /> 用药调整
          </TabsTrigger>
          <TabsTrigger value="records" className="py-2 px-1">
            <History className="mr-1 h-4 w-4" /> 用药记录
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plan">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center">
                <Pill className="mr-2 h-5 w-5 text-primary" />
                当前用药计划
              </CardTitle>
              {mockCurrentMedicationPlan.doctorName && (
                <CardDescription className="text-xs">
                  由 {mockCurrentMedicationPlan.doctorName} 于 {isClient && mockCurrentMedicationPlan.planStartDate ? format(parseISO(mockCurrentMedicationPlan.planStartDate), "yyyy年MM月dd日") : 'N/A'} 开具
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">药物列表:</h4>
                {mockCurrentMedicationPlan.medications.length > 0 ? (
                  <ul className="space-y-3">
                    {mockCurrentMedicationPlan.medications.map(med => (
                      <li key={med.id} className="p-3 border rounded-md bg-muted/50">
                        <div className="font-medium text-primary">{med.name}</div>
                        <div className="text-xs text-muted-foreground">
                          <span>剂量: {med.dosage}</span> | <span>频次: {med.frequency}</span>
                        </div>
                        {med.notes && <p className="text-xs mt-1">备注: {med.notes}</p>}
                        {med.startDate && <p className="text-xs mt-0.5 text-gray-500">开始日期: {isClient ? format(parseISO(med.startDate), "yyyy-MM-dd") : '...'}</p>}
                        {med.endDate && <p className="text-xs mt-0.5 text-red-500">结束日期: {isClient ? format(parseISO(med.endDate), "yyyy-MM-dd") : '...'}</p>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">暂无具体药物信息。</p>
                )}
              </div>
              {mockCurrentMedicationPlan.generalInstructions && (
                <div>
                  <h4 className="font-semibold text-sm mb-1">通用医嘱:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{mockCurrentMedicationPlan.generalInstructions}</p>
                </div>
              )}
               <Button variant="outline" size="sm" className="mt-4 text-xs" disabled>
                  <PlusCircle className="mr-1 h-3 w-3"/> 添加/编辑药物 (医生操作)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjustments">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center">
                <Edit3 className="mr-2 h-5 w-5 text-primary" />
                用药调整历史
              </CardTitle>
              <CardDescription className="text-xs">
                查看您的用药方案历次调整记录。
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {mockMedicationAdjustments.length > 0 ? (
                <ScrollArea className="h-[300px] pr-2">
                  <ul className="space-y-3">
                    {mockMedicationAdjustments.map(adj => (
                      <li key={adj.id} className="p-3 border rounded-md bg-muted/30">
                        <p className="text-xs text-muted-foreground">
                          调整日期: {isClient ? format(parseISO(adj.date), "yyyy-MM-dd") : '...'} 
                          {adj.physicianName && ` | 操作医生: ${adj.physicianName}`}
                        </p>
                        <p className="text-sm font-medium mt-1">{adj.changeDetails}</p>
                        {adj.reason && <p className="text-xs mt-1 text-gray-600">原因: {adj.reason}</p>}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              ) : (
                <p className="text-center text-muted-foreground py-4">暂无用药调整记录。</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base flex items-center">
                <History className="mr-2 h-5 w-5 text-primary" />
                用药记录
              </CardTitle>
              <CardDescription className="text-xs">
                记录和查看您的每日用药情况。
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={() => toast({title: "提示", description:"记录服药功能正在开发中。"})} className="w-full sm:w-auto text-sm h-9">
                      <PlusCircle className="mr-1 h-4 w-4"/> 记录今日用药
                  </Button>
                  <Button variant="outline" onClick={() => toast({title: "提示", description:"与“提醒”模块联动功能开发中。"})} className="w-full sm:w-auto text-sm h-9" disabled>
                      同步提醒记录
                  </Button>
              </div>
              {mockMedicationLogs.length > 0 ? (
                <ScrollArea className="h-[280px] pr-2">
                  <ul className="space-y-3">
                    {mockMedicationLogs.map(log => (
                      <li key={log.id} className="p-3 border rounded-md bg-muted/40">
                        <div className="flex justify-between items-start">
                            <p className="font-medium text-sm">{log.medicationName}</p>
                            {getStatusBadge(log.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          记录时间: {isClient ? format(parseISO(log.timeTaken), "yyyy-MM-dd HH:mm") : '...'}
                        </p>
                        {log.notes && <p className="text-xs mt-1 text-gray-600">备注: {log.notes}</p>}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              ) : (
                <p className="text-center text-muted-foreground py-4">暂无用药记录。</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    