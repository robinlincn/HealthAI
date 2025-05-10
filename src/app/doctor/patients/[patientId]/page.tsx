
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
      pastHistory: "2010年阑尾炎手术, 2005年肺炎",
      familyHistory: "父亲患有高血压, 母亲患有糖尿病",
      allergies: "青霉素, 花生",
      healthDataSummary: "血糖近期偏高 (空腹7.0-8.5 mmol/L, 餐后9.0-11.5 mmol/L)。血压控制尚可 (130-140/80-90 mmHg)。体重75kg, BMI 26。血脂：总胆固醇 5.8 mmol/L, 甘油三酯 2.0 mmol/L。",
      reports: [
        { id: "rep001", name: "2024-04-15 血液检查报告.pdf", type: "pdf", description: "包含血常规、生化全项、糖化血红蛋白等。" },
        { id: "rep002", name: "2024-03-10 胸部CT扫描.jpg", type: "image", description: "CT影像，初步诊断意见。" },
        { id: "rep003", name: "2024-02-20 脊柱X光片.png", type: "image", description: "腰椎正侧位X光片。" },
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
        <Button variant="default" disabled> {/* Edit functionality not implemented */}
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
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <p><strong>姓名:</strong> {patient.name}</p>
                <p><strong>年龄:</strong> {patient.age}岁</p>
                <p><strong>性别:</strong> {patient.gender}</p>
                <p><strong>联系电话:</strong> {patient.contact}</p>
                <p className="md:col-span-2"><strong>紧急联系人:</strong> {patient.emergencyContact.name} ({patient.emergencyContact.relationship || '未指定关系'}) - {patient.emergencyContact.phone}</p>
              </div>
              <p className="text-muted-foreground pt-4 text-xs">详细信息编辑功能正在建设中。如需修改，请联系管理员或使用未来的编辑功能。</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicalHistory">
          <Card>
            <CardHeader>
              <CardTitle>病历信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><strong>主要诊断:</strong> {patient.diagnosis}</p>
              <p><strong>既往病史:</strong> {patient.pastHistory}</p>
              <p><strong>家族病史:</strong> {patient.familyHistory}</p>
              <p><strong>过敏史:</strong> {patient.allergies}</p>
              <p className="text-muted-foreground pt-4 text-xs">详细病历记录编辑与添加功能正在建设中。</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="healthData">
          <Card>
            <CardHeader>
              <CardTitle>健康数据总览</CardTitle>
              <CardDescription className="text-sm">{patient.healthDataSummary}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-4 flex flex-col items-center text-center">
                <BarChart3 className="w-24 h-24 text-primary/30 mb-4" />
                <h3 className="text-xl font-semibold text-foreground/70">详细图表即将推出</h3>
                <p className="text-foreground/50 max-w-md text-sm">
                  血糖、血压、体重、血脂等历史记录的详细趋势图表将在此处展示，支持按时间范围查看和数据标注。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>检查报告列表</CardTitle>
                <CardDescription>查看和管理病人已上传的各类检查报告。</CardDescription>
              </div>
              <Button variant="outline" disabled> {/* Upload functionality not implemented */}
                <Upload className="mr-2 h-4 w-4"/> 上传新报告
              </Button>
            </CardHeader>
            <CardContent>
              {patient.reports.length > 0 ? (
                <ul className="space-y-3">
                  {patient.reports.map(report => (
                    <li key={report.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50">
                      <div className="flex items-center space-x-3">
                        {report.type === "pdf" ? <FileText className="mr-2 h-6 w-6 text-destructive flex-shrink-0" /> : <FileText className="mr-2 h-6 w-6 text-blue-500 flex-shrink-0" /> } {/* Using FileText for image too for simplicity, better to use ImageIcon from lucide if available and desired */}
                        <div>
                            <span className="font-medium text-sm">{report.name}</span>
                            {report.description && <p className="text-xs text-muted-foreground">{report.description}</p>}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" disabled>查看</Button> {/* View functionality not implemented */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-4">暂无检查报告。</p>
              )}
               <p className="text-muted-foreground pt-4 text-xs text-center">报告上传、预览和管理功能正在建设中。</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

