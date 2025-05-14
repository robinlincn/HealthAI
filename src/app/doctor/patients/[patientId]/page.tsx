"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, UserCircle, FileText, LineChart as LineChartIcon, ClipboardList, Edit3 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { DoctorPatient } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Mock data fetching function (replace with actual data fetching)
const getPatientDetails = (patientId: string): DoctorPatient | null => {
  const mockPatientsList: DoctorPatient[] = [
    { 
      id: "pat001", name: "张三", age: 45, gender: "male", diagnosis: "高血压, 2型糖尿病", lastVisit: "2024-05-01",
      contact: "13800138001",
      emergencyContact: { name: "李四", phone: "13900139002", relationship: "配偶" },
      detailedProfile: {
        recordNumber: "MR00123",
        name: "张三",
        gender: "male",
        age: 45,
        maritalStatus: "married",
        occupation: "工程师",
        chiefComplaint: "头晕、乏力一周",
        historyOfPresentIllness: "患者一周前无明显诱因出现头晕，伴乏力，自测血压波动于150-160/90-100mmHg，血糖餐后10-12mmol/L。",
        pastMedicalHistoryDetails: "2010年阑尾炎手术。高血压病史5年，2型糖尿病3年。",
        familyHistory_father: "高血压病史",
      },
      healthDataSummary: "血糖近期偏高，血压控制尚可，需关注。",
      reports: [
        { id: "rep001", name: "2024-04-15 血液检查.pdf", type: "pdf", url: "#", uploadDate: "2024-04-15"},
        { id: "rep002", name: "2024-03-10 胸部CT.jpg", type: "image", url: "https://picsum.photos/seed/report_ct/200", uploadDate: "2024-03-10"},
      ]
    },
    { 
      id: "pat002", name: "李四", age: 62, gender: "female", diagnosis: "冠心病", lastVisit: "2024-05-10", contact: "13900139002",
      emergencyContact: { name: "王小明", phone: "13900239003", relationship: "儿子" },
      detailedProfile: { name: "李四", gender: "female", age: 62, chiefComplaint: "胸闷、气短一月" },
      healthDataSummary: "心率稳定，偶有胸闷。",
    },
    { 
      id: "pat003", name: "王五", age: 50, gender: "male", diagnosis: "高血脂", lastVisit: "2024-04-22", contact: "13700137003",
      detailedProfile: { name: "王五", gender: "male", age: 50, chiefComplaint: "体检发现血脂异常" },
      healthDataSummary: "血脂水平持续较高。",
    },
  ];
  return mockPatientsList.find(p => p.id === patientId) || null;
};


export default function DoctorPatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const patientId = params.patientId as string;
  const [patient, setPatient] = useState<DoctorPatient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const details = getPatientDetails(patientId);
      setPatient(details);
      setIsLoading(false);
    }, 500);
  }, [patientId]);

  const handleEditPatientInfo = () => {
    // This would typically navigate to an edit page or open a modal form
    // For now, it's a placeholder matching the image's description
    toast({
      title: "编辑功能提示",
      description: "详细信息编辑功能正在建设中。如需修改，请联系管理员或使用未来的编辑功能。",
      duration: 5000,
    });
    // Example navigation if an edit page exists:
    // router.push(`/doctor/patients/${patientId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-12 w-full mb-4" />
        <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>病人信息未找到</CardTitle>
          </CardHeader>
          <CardContent>
            <p>无法加载ID为 {patientId} 的病人信息。</p>
            <Button asChild variant="link" className="mt-4" onClick={() => router.back()}>
              <>
                <ArrowLeft className="mr-2 h-4 w-4" /> 返回病人列表
              </>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getGenderText = (gender: DoctorPatient['gender']) => {
    const map = { male: '男', female: '女', other: '其他' };
    return map[gender] || '未知';
  };

  return (
    <div className="space-y-4 p-1 md:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <Button variant="outline" onClick={() => router.back()} className="self-start sm:self-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回病人列表
        </Button>
        <h1 className="text-xl md:text-2xl font-semibold text-center sm:text-left flex-grow">
          病人档案: {patient.name}
        </h1>
        <Button onClick={handleEditPatientInfo} className="self-start sm:self-center">
          <Edit3 className="mr-2 h-4 w-4" /> 编辑病人信息
        </Button>
      </div>

      <Tabs defaultValue="basicInfo" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-muted/60">
          <TabsTrigger value="basicInfo"><UserCircle className="mr-2 h-4 w-4"/>基本信息</TabsTrigger>
          <TabsTrigger value="medicalRecords"><FileText className="mr-2 h-4 w-4"/>病历信息</TabsTrigger>
          <TabsTrigger value="healthData"><LineChartIcon className="mr-2 h-4 w-4"/>健康数据</TabsTrigger>
          <TabsTrigger value="examReports"><ClipboardList className="mr-2 h-4 w-4"/>检查报告</TabsTrigger>
        </TabsList>

        <TabsContent value="basicInfo">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-xl">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <p><strong>姓名:</strong> {patient.name}</p>
                <p><strong>年龄:</strong> {patient.age}岁</p>
                <p><strong>性别:</strong> {getGenderText(patient.gender)}</p>
                <p><strong>联系电话:</strong> {patient.contact || "未提供"}</p>
              </div>
              {patient.emergencyContact && (
                <p>
                  <strong>紧急联系人:</strong> {patient.emergencyContact.name} ({patient.emergencyContact.relationship || "未指定关系"}) - {patient.emergencyContact.phone}
                </p>
              )}
              {patient.detailedProfile?.address && (
                 <p><strong>住址:</strong> {patient.detailedProfile.address}</p>
              )}
              <p className="text-xs text-muted-foreground pt-4">
                详细信息编辑功能正在建设中。如需修改，请联系管理员或使用未来的编辑功能。
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicalRecords">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-xl">病历信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><strong>主要诊断:</strong> {patient.diagnosis}</p>
              {patient.detailedProfile?.chiefComplaint && <p><strong>主诉:</strong> {patient.detailedProfile.chiefComplaint}</p>}
              {patient.detailedProfile?.historyOfPresentIllness && <p><strong>现病史:</strong> {patient.detailedProfile.historyOfPresentIllness}</p>}
              {patient.detailedProfile?.pastMedicalHistoryDetails && <p><strong>既往史:</strong> {patient.detailedProfile.pastMedicalHistoryDetails}</p>}
              {patient.detailedProfile?.familyHistory_father && <p><strong>家族史 (父亲):</strong> {patient.detailedProfile.familyHistory_father}</p>}
              <p className="text-xs text-muted-foreground pt-4">此为病历摘要。详细病历编辑和查看功能正在建设中。</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="healthData">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-xl">健康数据</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{patient.healthDataSummary || "暂无健康数据摘要。"}</p>
              <p className="text-xs text-muted-foreground pt-4">详细健康数据图表和分析功能正在建设中。可前往“病情分析”模块查看更多。</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examReports">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-xl">检查报告</CardTitle>
            </CardHeader>
            <CardContent>
              {patient.reports && patient.reports.length > 0 ? (
                <ul className="space-y-2">
                  {patient.reports.map(report => (
                    <li key={report.id} className="text-sm p-2 border rounded-md hover:bg-muted/50 flex justify-between items-center">
                      <span>{report.name} ({report.uploadDate})</span>
                      <Button variant="ghost" size="sm" onClick={() => alert(`查看报告 ${report.name} (功能待实现)`)}>查看</Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>暂无检查报告。</p>
              )}
              <p className="text-xs text-muted-foreground pt-4">检查报告上传和管理功能正在建设中。</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}