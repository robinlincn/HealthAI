
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ClipboardList, Pill, CalendarCheck2, Edit, PlusCircle, MessageCircleMore, CheckSquare, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";

// Mock data fetching function (similar to /doctor/patients/[patientId]/page.tsx)
const getPatientDetails = (patientId: string) => {
  const mockPatientsList = [
    { id: "pat001", name: "张三", age: 45, gender: "男", diagnosis: "高血压, 2型糖尿病" },
    { id: "pat002", name: "李四", age: 62, gender: "女", diagnosis: "冠心病" },
    { id: "pat003", name: "王五", age: 50, gender: "男", diagnosis: "高血脂" },
  ];
  return mockPatientsList.find(p => p.id === patientId) || null;
};


// Mock plan and advice data - in a real app, this would be fetched/specific to the patient
const mockPlan = {
  patientName: "示例病人", // This will be updated with actual patient name
  medications: [
    { id: "med1", name: "硝苯地平控释片", dosage: "30mg", frequency: "每日一次", notes: "晨起服用" },
    { id: "med2", name: "二甲双胍", dosage: "0.5g", frequency: "每日两次", notes: "餐后服用" },
  ],
  lifestyleAdjustments: "低盐低脂饮食，每日快走30分钟，监测血糖血压。",
  shortTermGoals: "一周内空腹血糖控制在7.0mmol/L以下。",
  longTermGoals: "三个月内糖化血红蛋白控制在7.0%以下，血压控制在130/80mmHg以下。",
  adjustmentHistory: [
    { date: "2024-04-15", change: "二甲双胍剂量由0.25g TID调整为0.5g BID。" },
    { date: "2024-03-01", change: "初次制定方案。" },
  ],
};

const mockAdvice = [
    { id: "adv1", patientName: "示例病人", advice: "请于下周复查空腹血糖及餐后2小时血糖。", date: "2024-05-10", status: "待执行" },
    { id: "adv2", patientName: "示例病人", advice: "建议增加阿司匹林每日100mg。", date: "2024-05-08", status: "已执行" },
];

export default function PatientTreatmentPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;
  const [patient, setPatient] = useState<ReturnType<typeof getPatientDetails>>(null);
  const { toast } = useToast();
  // Add states for form inputs if creating/editing plans

  useEffect(() => {
    const details = getPatientDetails(patientId);
    setPatient(details);
    // Update mockPlan and mockAdvice with actual patient name if needed
    if (details) {
        mockPlan.patientName = details.name;
        mockAdvice.forEach(adv => adv.patientName = details.name);
    }
  }, [patientId]);

  if (!patient) {
    return (
      <div className="space-y-6 p-4">
        <Card>
          <CardHeader>
            <CardTitle>病人信息加载中或未找到</CardTitle>
          </CardHeader>
          <CardContent>
            <p>无法加载ID为 {patientId} 的病人治疗方案信息。</p>
            <Button variant="link" className="mt-4" onClick={() => router.push('/doctor/treatment-plans')}>
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
        <Button variant="outline" onClick={() => router.push('/doctor/treatment-plans')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回病人列表
        </Button>
        <h1 className="text-xl md:text-2xl font-semibold flex items-center">
          <UserCircle className="mr-2 h-6 w-6 md:h-7 md:w-7 text-primary" />
          治疗方案与建议: {patient.name}
        </h1>
        <div /> 
      </div>

      <Tabs defaultValue="treatmentPlan" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
          <TabsTrigger value="treatmentPlan">
            <CalendarCheck2 className="mr-2 h-4 w-4" /> 治疗方案管理
          </TabsTrigger>
          <TabsTrigger value="treatmentAdvice">
            <MessageCircleMore className="mr-2 h-4 w-4" /> 治疗建议记录
          </TabsTrigger>
        </TabsList>

        <TabsContent value="treatmentPlan">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>当前治疗方案: {patient.name}</CardTitle>
              <Button variant="outline" disabled><Edit className="mr-2 h-4 w-4" /> 编辑方案</Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><Pill className="mr-2 h-5 w-5 text-primary/80"/>药物管理</h3>
                <ul className="space-y-2">
                  {mockPlan.medications.map(med => (
                    <li key={med.id} className="p-3 border rounded-md bg-muted/30">
                      <p><strong>{med.name}</strong> - {med.dosage}, {med.frequency}</p>
                      {med.notes && <p className="text-sm text-muted-foreground">备注: {med.notes}</p>}
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" size="sm" className="mt-2" disabled><PlusCircle className="mr-2 h-4 w-4"/> 添加药物</Button>
              </section>
              
              <section>
                <h3 className="text-lg font-semibold mb-1">生活方式调整</h3>
                <p className="text-sm">{mockPlan.lifestyleAdjustments}</p>
              </section>

              <div className="grid md:grid-cols-2 gap-4">
                <section>
                    <h3 className="text-lg font-semibold mb-1">短期治疗目标</h3>
                    <p className="text-sm">{mockPlan.shortTermGoals}</p>
                </section>
                <section>
                    <h3 className="text-lg font-semibold mb-1">长期治疗目标</h3>
                    <p className="text-sm">{mockPlan.longTermGoals}</p>
                </section>
              </div>

              <section>
                <h3 className="text-lg font-semibold mb-2">方案调整记录</h3>
                <ul className="space-y-1 text-sm">
                  {mockPlan.adjustmentHistory.map((adj, idx) => (
                    <li key={idx} className="text-muted-foreground"><strong>{adj.date}:</strong> {adj.change}</li>
                  ))}
                </ul>
              </section>
              <p className="text-center text-muted-foreground text-sm pt-4">完整的治疗方案制定与编辑功能正在建设中。</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatmentAdvice">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>治疗建议记录: {patient.name}</CardTitle>
              <Button variant="outline" disabled><PlusCircle className="mr-2 h-4 w-4" /> 新增建议</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAdvice.filter(adv => adv.patientName === patient.name).map(advice => ( // Filter advice for current patient
                <Card key={advice.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      {/* Removed Patient Name here as it's already in the CardTitle */}
                      <p className="text-sm">{advice.advice}</p>
                      <p className="text-xs text-muted-foreground">建议时间: {advice.date}</p>
                    </div>
                    <div className="text-right">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${advice.status === "已执行" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {advice.status}
                        </span>
                        <Button variant="ghost" size="sm" className="mt-1" disabled><CheckSquare className="mr-1 h-3 w-3"/> 更新状态</Button>
                    </div>
                  </div>
                </Card>
              ))}
               {mockAdvice.filter(adv => adv.patientName === patient.name).length === 0 && (
                <p className="text-muted-foreground text-center">暂无该病人的治疗建议。</p>
               )}
              <p className="text-center text-muted-foreground text-sm pt-4">建议内容编辑、病人反馈跟踪等功能正在建设中。</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
