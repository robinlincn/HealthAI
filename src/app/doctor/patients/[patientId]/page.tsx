
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, UserCircle, ClipboardList, FileText, BarChart3, Edit3, Upload } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock data fetching function (replace with actual data fetching)
const getPatientDetails = (patientId: string) => {
  // In a real app, fetch patient data from a DB or API
  if (patientId === "pat001") {
    return {
      id: "pat001",
      name: "张三",
      age: 45,
      gender: "男",
      contact: "13800138001",
      emergencyContact: { name: "李四 (配偶)", phone: "13900139002" },
      diagnosis: "高血压, 2型糖尿病",
      pastHistory: "2010年阑尾炎手术",
      familyHistory: "父亲患有高血压",
      allergies: "青霉素",
      healthDataSummary: "血糖近期偏高，血压控制尚可。",
      reports: [
        { id: "rep001", name: "2024-04-15 血液检查.pdf", type: "pdf" },
        { id: "rep002", name: "2024-03-10 胸部CT.jpg", type: "image" },
      ],
    };
  }
  return null; // Or a default patient structure
};


export default function DoctorPatientDetailPage() {
  const params = useParams();
  const patientId = params.patientId as string;
  const patient = getPatientDetails(patientId);

  if (!patient) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>病人信息未找到</CardTitle>
          </CardHeader>
          <CardContent>
            <p>无法加载ID为 {patientId} 的病人信息。</p>
            <Button asChild variant="link" className="mt-4">
              <Link href="/doctor/patients"><ArrowLeft className="mr-2 h-4 w-4" /> 返回病人列表</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button asChild variant="outline">
          <Link href="/doctor/patients"><ArrowLeft className="mr-2 h-4 w-4" /> 返回病人列表</Link>
        </Button>
        <h1 className="text-2xl font-semibold">病人档案: {patient.name}</h1>
        <Button variant="default">
          <Edit3 className="mr-2 h-4 w-4" /> 编辑病人信息
        </Button>
      </div>

      <Tabs defaultValue="basicInfo" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="basicInfo"><UserCircle className="mr-2 h-4 w-4" />基本信息</TabsTrigger>
          <TabsTrigger value="medicalHistory"><ClipboardList className="mr-2 h-4 w-4" />病历信息</TabsTrigger>
          <TabsTrigger value="healthData"><BarChart3 className="mr-2 h-4 w-4" />健康数据</TabsTrigger>
          <TabsTrigger value="reports"><FileText className="mr-2 h-4 w-4" />检查报告</TabsTrigger>
        </TabsList>

        <TabsContent value="basicInfo">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong>姓名:</strong> {patient.name}</p>
              <p><strong>年龄:</strong> {patient.age}</p>
              <p><strong>性别:</strong> {patient.gender}</p>
              <p><strong>联系方式:</strong> {patient.contact}</p>
              <p><strong>紧急联系人:</strong> {patient.emergencyContact.name} ({patient.emergencyContact.phone})</p>
              <p className="text-muted-foreground pt-4">此区域内容正在建设中，将包含更详细可编辑的表单。</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicalHistory">
          <Card>
            <CardHeader>
              <CardTitle>病历信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong>主要诊断:</strong> {patient.diagnosis}</p>
              <p><strong>既往病史:</strong> {patient.pastHistory}</p>
              <p><strong>家族病史:</strong> {patient.familyHistory}</p>
              <p><strong>过敏史:</strong> {patient.allergies}</p>
              <p className="text-muted-foreground pt-4">此区域内容正在建设中，将包含更详细可编辑的病历条目。</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="healthData">
          <Card>
            <CardHeader>
              <CardTitle>健康数据总览</CardTitle>
              <CardDescription>{patient.healthDataSummary}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-4 flex flex-col items-center text-center">
                <BarChart3 className="w-24 h-24 text-primary/30 mb-4" />
                <h3 className="text-xl font-semibold text-foreground/70">详细图表即将推出</h3>
                <p className="text-foreground/50 max-w-md">
                  血糖、血压、体重、血脂等历史记录的详细图表将在此处展示。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>检查报告</CardTitle>
                <CardDescription>查看病人已上传的检查报告。</CardDescription>
              </div>
              <Button variant="outline"><Upload className="mr-2 h-4 w-4"/> 上传新报告</Button>
            </CardHeader>
            <CardContent>
              {patient.reports.length > 0 ? (
                <ul className="space-y-2">
                  {patient.reports.map(report => (
                    <li key={report.id} className="flex justify-between items-center p-2 border rounded-md">
                      <div className="flex items-center">
                        {report.type === "pdf" ? <FileText className="mr-2 h-5 w-5 text-destructive" /> : <FileText className="mr-2 h-5 w-5 text-blue-500" /> } {/* Using FileText for image too for simplicity */}
                        <span>{report.name}</span>
                      </div>
                      <Button variant="ghost" size="sm">查看</Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">暂无检查报告。</p>
              )}
               <p className="text-muted-foreground pt-4">报告查看和管理功能正在建设中。</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
