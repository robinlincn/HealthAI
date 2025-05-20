
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ClipboardList, Pill, CalendarCheck2, Edit, PlusCircle, MessageCircleMore, CheckSquare, UserCircle, Edit3, ListChecks, History as HistoryIcon, Trash2 } from "lucide-react"; 
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import type { DoctorPatient, TreatmentPlan, TreatmentPlanMedication, TreatmentAdvice, TreatmentAdviceStatus } from "@/lib/types";
import { format, parseISO, isValid } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { TreatmentPlanFormDialog } from "@/components/doctor/treatment-plans/TreatmentPlanFormDialog";
import { TreatmentAdviceFormDialog } from "@/components/doctor/treatment-plans/TreatmentAdviceFormDialog"; 
import { Separator } from "@/components/ui/separator";


// Mock data fetching function (similar to /doctor/patients/[patientId]/page.tsx)
const getPatientDetails = (patientId: string): DoctorPatient | null => {
  const mockPatientsList: DoctorPatient[] = [
    { id: "pat001", name: "张三", age: 45, gender: "male", diagnosis: "高血压, 2型糖尿病", currentTreatmentPlan: {
        id: "tp-pat001-current",
        patientId: "pat001",
        doctorId: "doc001",
        planName: "张三 - 2024年Q2慢病管理方案",
        startDate: new Date(2024,3,1).toISOString(), // April 1, 2024
        shortTermGoals: "1. 未来一个月将空腹血糖稳定在7.0mmol/L以下。\n2. 血压控制在140/90mmHg以下。",
        longTermGoals: "1. 未来三个月糖化血红蛋白控制在7.0%以下。\n2. 养成每日30分钟运动习惯。",
        lifestyleAdjustments: "1. 饮食：低盐、低脂、低糖，增加蔬菜摄入。\n2. 运动：每周至少5次，每次不少于30分钟中等强度有氧运动。\n3. 监测：每日监测血糖、血压，每周称重一次。",
        medications: [
          { id: "med1", drugName: "二甲双胍片", dosage: "500mg", frequency: "每日两次", notes: "随餐服用", medStartDate: new Date(2024,3,1).toISOString() },
          { id: "med2", drugName: "硝苯地平控释片", dosage: "30mg", frequency: "每日一次", notes: "晨起服用", medStartDate: new Date(2024,3,1).toISOString() },
        ],
        isActive: true,
        creationDate: new Date(2024,3,1).toISOString(),
        updatedAt: new Date(2024,4,15).toISOString(),
    }},
    { id: "pat002", name: "李四", age: 62, gender: "female", diagnosis: "冠心病" },
    { id: "pat003", name: "王五", age: 50, gender: "male", diagnosis: "高血脂" },
  ];
  return mockPatientsList.find(p => p.id === patientId) || null;
};


const mockInitialAdvices: TreatmentAdvice[] = [
    { id: "adv1", patientId: "pat001", doctorId:"doc001", advice: "请于下周复查空腹血糖及餐后2小时血糖，并记录。", date: new Date(2024,4,10).toISOString(), status: "待执行" },
    { id: "adv2", patientId: "pat001", doctorId:"doc001", advice: "建议增加晨起散步30分钟，监测步数。", date: new Date(2024,4,8).toISOString(), status: "已执行", patientFeedback: "已开始散步，感觉良好。" },
];

// Mock adjustment history - this would usually be part of the plan or fetched separately
const mockPlanAdjustmentHistory = [
    { date: "2024-04-15T00:00:00.000Z", change: "二甲双胍剂量由500mg每日两次调整为850mg每日两次，因近期血糖控制不佳。", physicianName: "王医生" },
    { date: "2024-03-01T00:00:00.000Z", change: "初次制定方案，开始使用二甲双胍和硝苯地平。", physicianName: "王医生" },
];

const doctorIdMock = "doc001"; // Mock current doctor's ID

export default function PatientTreatmentPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;
  const [patient, setPatient] = useState<ReturnType<typeof getPatientDetails>>(null);
  const [currentTreatmentPlan, setCurrentTreatmentPlan] = useState<TreatmentPlan | null>(null);
  const [treatmentAdvices, setTreatmentAdvices] = useState<TreatmentAdvice[]>([]);
  
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);
  const [editingTreatmentPlan, setEditingTreatmentPlan] = useState<TreatmentPlan | null>(null);

  const [isAdviceFormOpen, setIsAdviceFormOpen] = useState(false);
  const [editingAdvice, setEditingAdvice] = useState<TreatmentAdvice | null>(null);
  
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const details = getPatientDetails(patientId);
    setPatient(details);
    if (details?.currentTreatmentPlan) {
        setCurrentTreatmentPlan(details.currentTreatmentPlan);
    } else {
        setCurrentTreatmentPlan(null); 
    }
    setTreatmentAdvices(mockInitialAdvices.filter(adv => adv.patientId === patientId));
  }, [patientId]);

  const handleSavePlan = (planData: TreatmentPlan) => {
    setCurrentTreatmentPlan(planData);
    setPatient(prev => prev ? ({ ...prev, currentTreatmentPlan: planData }) : null);
    toast({ title: "治疗方案已保存", description: `方案 "${planData.planName}" 已成功${planData.id === currentTreatmentPlan?.id ? '更新' : '创建'}。` });
    setIsPlanFormOpen(false);
    setEditingTreatmentPlan(null);
  };

  const handleOpenCreatePlanDialog = () => {
    setEditingTreatmentPlan(null);
    setIsPlanFormOpen(true);
  };
  
  const handleOpenEditPlanDialog = () => {
    if (currentTreatmentPlan) {
      setEditingTreatmentPlan(currentTreatmentPlan);
      setIsPlanFormOpen(true);
    } else {
      toast({ title: "无方案可编辑", description: "请先创建治疗方案。", variant: "destructive" });
    }
  };

  const handleOpenAddAdviceDialog = () => {
    setEditingAdvice(null);
    setIsAdviceFormOpen(true);
  };

  const handleOpenEditAdviceDialog = (advice: TreatmentAdvice) => {
    setEditingAdvice(advice);
    setIsAdviceFormOpen(true);
  };

  const handleSaveAdvice = (adviceData: Partial<TreatmentAdvice>) => {
    if (editingAdvice) {
      setTreatmentAdvices(prev => prev.map(adv => adv.id === editingAdvice.id ? { ...editingAdvice, ...adviceData } as TreatmentAdvice : adv));
      toast({ title: "建议已更新" });
    } else {
      const newAdvice: TreatmentAdvice = {
        id: `adv-${Date.now()}`,
        patientId: patientId,
        doctorId: doctorIdMock,
        date: new Date().toISOString(),
        ...adviceData,
      } as TreatmentAdvice; // Cast to ensure all required fields are there
      setTreatmentAdvices(prev => [newAdvice, ...prev]);
      toast({ title: "建议已添加" });
    }
    setIsAdviceFormOpen(false);
    setEditingAdvice(null);
  };

  const handleDeleteAdvice = (adviceId: string) => {
    if (window.confirm("确定要删除此条建议吗？")) {
      setTreatmentAdvices(prev => prev.filter(adv => adv.id !== adviceId));
      toast({ title: "建议已删除" });
    }
  };
  
  const getAdviceStatusBadge = (status: TreatmentAdviceStatus) => {
    switch(status) {
        case '待执行': return <Badge variant="outline" className="text-yellow-600 border-yellow-400">待执行</Badge>;
        case '已执行': return <Badge variant="default" className="bg-green-500 hover:bg-green-600">已执行</Badge>;
        case '已取消': return <Badge variant="outline" className="text-gray-500 border-gray-400">已取消</Badge>;
        // Handle other statuses from Patient side if needed
        case 'pending': return <Badge variant="outline">待处理 (病人端)</Badge>;
        case 'acknowledged': return <Badge variant="secondary">病人已确认</Badge>;
        case 'implemented': return <Badge variant="default" className="bg-green-500 hover:bg-green-600">病人已执行</Badge>;
        case 'rejected': return <Badge variant="destructive">病人已拒绝</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
  };


  if (!isClient) {
    return (
      <div className="space-y-6 p-4 text-center">
        <p className="text-muted-foreground">正在加载治疗方案信息...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="space-y-6 p-4">
        <Card>
          <CardHeader><CardTitle>病人信息未找到</CardTitle></CardHeader>
          <CardContent><p>无法加载ID为 {patientId} 的病人治疗方案信息。</p>
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
          治疗方案: {patient.name}
        </h1>
        <div /> 
      </div>

      <Tabs defaultValue="treatmentPlan" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3"> 
          <TabsTrigger value="treatmentPlan"><ListChecks className="mr-2 h-4 w-4" /> 方案管理</TabsTrigger>
          <TabsTrigger value="adjustmentHistory"><HistoryIcon className="mr-2 h-4 w-4" /> 调整历史</TabsTrigger>
          <TabsTrigger value="treatmentAdvice"><MessageCircleMore className="mr-2 h-4 w-4" /> 治疗建议</TabsTrigger>
        </TabsList>

        <TabsContent value="treatmentPlan">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>当前治疗方案</CardTitle>
              {currentTreatmentPlan ? (
                <Button variant="outline" onClick={handleOpenEditPlanDialog}>
                  <Edit className="mr-2 h-4 w-4" /> 编辑当前方案
                </Button>
              ) : (
                <Button onClick={handleOpenCreatePlanDialog}>
                  <PlusCircle className="mr-2 h-4 w-4" /> 创建新方案
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {currentTreatmentPlan ? (
                <>
                  <p className="text-sm"><strong>方案名称:</strong> {currentTreatmentPlan.planName}</p>
                  <p className="text-sm">
                    <strong>开始日期:</strong> {format(parseISO(currentTreatmentPlan.startDate), "yyyy-MM-dd")}
                    {currentTreatmentPlan.endDate && isValid(parseISO(currentTreatmentPlan.endDate)) && <span> - <strong>结束日期:</strong> {format(parseISO(currentTreatmentPlan.endDate), "yyyy-MM-dd")}</span>}
                  </p>
                  
                  <section>
                    <h3 className="text-md font-semibold mb-2 flex items-center"><Pill className="mr-2 h-4 w-4 text-primary/80"/>药物列表</h3>
                    {currentTreatmentPlan.medications.length > 0 ? (
                      <ul className="space-y-2 text-sm">
                        {currentTreatmentPlan.medications.map(med => (
                          <li key={med.id} className="p-2 border rounded-md bg-muted/30">
                            <p><strong>{med.drugName}</strong> - {med.dosage}, {med.frequency}</p>
                            {med.medStartDate && isValid(parseISO(med.medStartDate)) && <p className="text-xs text-muted-foreground">开始: {format(parseISO(med.medStartDate), 'yyyy-MM-dd')}{med.medEndDate && isValid(parseISO(med.medEndDate)) ? ` - 结束: ${format(parseISO(med.medEndDate), 'yyyy-MM-dd')}` : ''}</p>}
                            {med.notes && <p className="text-xs text-muted-foreground">备注: {med.notes}</p>}
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-sm text-muted-foreground">此方案暂无药物信息。</p>}
                  </section>
                  
                  {currentTreatmentPlan.lifestyleAdjustments && <section><h3 className="text-md font-semibold mb-1">生活方式调整</h3><p className="text-sm whitespace-pre-wrap">{currentTreatmentPlan.lifestyleAdjustments}</p></section>}
                  {currentTreatmentPlan.shortTermGoals && <section><h3 className="text-md font-semibold mb-1">短期治疗目标</h3><p className="text-sm whitespace-pre-wrap">{currentTreatmentPlan.shortTermGoals}</p></section>}
                  {currentTreatmentPlan.longTermGoals && <section><h3 className="text-md font-semibold mb-1">长期治疗目标</h3><p className="text-sm whitespace-pre-wrap">{currentTreatmentPlan.longTermGoals}</p></section>}
                  {typeof currentTreatmentPlan.isActive === 'boolean' && 
                    <div className="text-sm mt-2"> 
                      <strong>当前激活:</strong> 
                      {currentTreatmentPlan.isActive ? <Badge className="bg-green-500 ml-1">是</Badge> : <Badge variant="outline" className="ml-1">否</Badge>}
                    </div>
                  }
                </>
              ) : (
                <p className="text-center text-muted-foreground py-8">暂未给该病人制定治疗方案。</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="adjustmentHistory">
          <Card>
            <CardHeader><CardTitle>方案调整历史</CardTitle></CardHeader>
            <CardContent>
               {mockPlanAdjustmentHistory.length > 0 ? (
                <ScrollArea className="h-[300px] pr-2">
                  <ul className="space-y-3">
                    {mockPlanAdjustmentHistory.map((adj, idx) => (
                      <li key={idx} className="p-3 border rounded-md bg-muted/30">
                        <p className="text-xs text-muted-foreground">
                          调整日期: {isClient && adj.date ? format(parseISO(adj.date), "yyyy-MM-dd") : '...'} 
                          {adj.physicianName && ` | 操作医生: ${adj.physicianName}`}
                        </p>
                        <p className="text-sm font-medium mt-1">{adj.change}</p>
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

        <TabsContent value="treatmentAdvice">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>治疗建议记录</CardTitle>
              <Button variant="outline" onClick={handleOpenAddAdviceDialog}><PlusCircle className="mr-2 h-4 w-4" /> 新增建议</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {treatmentAdvices.length > 0 ? treatmentAdvices.map(advice => ( 
                <Card key={advice.id} className="p-3 shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm pr-2">{advice.advice}</p>
                    {getAdviceStatusBadge(advice.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    建议时间: {isClient ? format(parseISO(advice.date), "yyyy-MM-dd HH:mm") : '...'}
                  </p>
                  {advice.patientFeedback && <p className="text-xs mt-1 italic">病人反馈: {advice.patientFeedback}</p>}
                  <div className="mt-2 flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => handleOpenEditAdviceDialog(advice)}>
                        <Edit className="mr-1 h-3 w-3"/> 编辑
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-destructive hover:text-destructive" onClick={() => handleDeleteAdvice(advice.id)}>
                        <Trash2 className="mr-1 h-3 w-3"/> 删除
                    </Button>
                  </div>
                </Card>
              )) : <p className="text-muted-foreground text-center py-6">暂无该病人的治疗建议。</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isClient && isPlanFormOpen && (
        <TreatmentPlanFormDialog
          isOpen={isPlanFormOpen}
          onClose={() => setIsPlanFormOpen(false)}
          onSubmit={handleSavePlan}
          initialData={editingTreatmentPlan} 
          patientId={patient.id}
          doctorId={doctorIdMock} 
        />
      )}
      {isClient && isAdviceFormOpen && (
        <TreatmentAdviceFormDialog
          isOpen={isAdviceFormOpen}
          onClose={() => setIsAdviceFormOpen(false)}
          onSubmit={handleSaveAdvice}
          initialData={editingAdvice}
          patientId={patient.id}
          doctorId={doctorIdMock}
        />
      )}
    </div>
  );
}

