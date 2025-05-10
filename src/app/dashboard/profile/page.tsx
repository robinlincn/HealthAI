
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoForm } from "@/components/profile/BasicInfoForm";
import { MedicalHistoryForm } from "@/components/profile/MedicalHistoryForm";
import { EmergencyContacts } from "@/components/profile/EmergencyContacts";
import { UserCircle, HeartHandshake, ShieldAlert, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <UserCircle className="mr-3 h-7 w-7 text-primary" />
            病历记录与个人档案
          </CardTitle>
          <CardDescription>
            管理您的个人基本信息、详细病历资料、紧急联系人以及查看已上传的检查报告。
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="basicInfo" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4">
          <TabsTrigger value="basicInfo">
            <UserCircle className="mr-2 h-4 w-4" /> 基本信息
          </TabsTrigger>
          <TabsTrigger value="medicalHistory">
            <HeartHandshake className="mr-2 h-4 w-4" /> 病历信息
          </TabsTrigger>
          <TabsTrigger value="emergencyContacts">
            <ShieldAlert className="mr-2 h-4 w-4" /> 紧急联系人
          </TabsTrigger>
          <TabsTrigger value="uploadedReports">
            <FileText className="mr-2 h-4 w-4" /> 已上传报告
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basicInfo">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>管理您的姓名、性别、年龄和联系方式。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <BasicInfoForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicalHistory">
          <Card>
            <CardHeader>
              <CardTitle>病历信息</CardTitle>
              <CardDescription>管理您的疾病诊断、既往病史、家族病史和过敏史。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MedicalHistoryForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergencyContacts">
          <Card>
            <CardHeader>
              <CardTitle>紧急联系人</CardTitle>
              <CardDescription>管理您的紧急联系人信息。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <EmergencyContacts />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uploadedReports">
            <Card>
                <CardHeader>
                    <CardTitle>已上传的检查报告</CardTitle>
                    <CardDescription>您可以在此处快速访问已上传的检查报告。详细管理请前往“健康报告”页面。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <FileText className="w-20 h-20 text-primary/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">检查报告列表将在此处显示预览。</p>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/reports">前往健康报告中心查看和上传</Link>
                    </Button>
                     <p className="text-xs text-muted-foreground mt-2">此区域为快捷访问，完整功能请到健康报告页面。</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
