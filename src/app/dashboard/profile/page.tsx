
import { BasicInfoForm } from "@/components/profile/BasicInfoForm";
import { MedicalHistoryForm } from "@/components/profile/MedicalHistoryForm";
import { EmergencyContacts } from "@/components/profile/EmergencyContacts";
import { UserCircle, HeartHandshake, ShieldAlert, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="basicInfo" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 text-xs sm:text-sm">
          <TabsTrigger value="basicInfo" className="px-1 py-2 sm:px-3">
            <UserCircle className="mr-1 h-4 w-4" /> 基本信息
          </TabsTrigger>
          <TabsTrigger value="medicalHistory" className="px-1 py-2 sm:px-3">
            <HeartHandshake className="mr-1 h-4 w-4" /> 病历信息
          </TabsTrigger>
          <TabsTrigger value="emergencyContacts" className="px-1 py-2 sm:px-3">
            <ShieldAlert className="mr-1 h-4 w-4" /> 紧急联系
          </TabsTrigger>
          <TabsTrigger value="uploadedReports" className="px-1 py-2 sm:px-3">
            <FileText className="mr-1 h-4 w-4" /> 已上传报告
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basicInfo">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base">基本信息</CardTitle>
              <CardDescription className="text-xs">管理您的姓名、性别、年龄和联系方式。</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <BasicInfoForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicalHistory">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base">病历信息</CardTitle>
              <CardDescription className="text-xs">管理您的疾病诊断、既往病史、家族病史和过敏史。</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <MedicalHistoryForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergencyContacts">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base">紧急联系人</CardTitle>
              <CardDescription className="text-xs">管理您的紧急联系人信息。</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <EmergencyContacts />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uploadedReports">
            <Card className="shadow-sm">
                <CardHeader className="p-4">
                    <CardTitle className="text-base">已上传的检查报告</CardTitle>
                    <CardDescription className="text-xs">您可以在此处快速访问已上传的检查报告。详细管理请前往“健康报告”页面。</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4 text-center">
                    <FileText className="w-16 h-16 text-primary/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">检查报告列表将在此处显示预览。</p>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/dashboard/reports">健康报告中心</Link>
                    </Button>
                     <p className="text-xs text-muted-foreground mt-2">此区域为快捷访问，完整功能请到健康报告页面。</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
