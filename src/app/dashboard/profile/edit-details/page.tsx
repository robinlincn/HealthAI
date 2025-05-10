
"use client";

import { BasicInfoForm } from "@/components/profile/BasicInfoForm";
import { MedicalHistoryForm } from "@/components/profile/MedicalHistoryForm";
import { EmergencyContacts } from "@/components/profile/EmergencyContacts";
import { UserCircle, HeartHandshake, ShieldAlert, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ReportList } from "@/components/reports/ReportList"; // Import ReportList

export default function EditProfileDetailsPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="basicInfo" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 text-xs sm:text-sm h-auto">
          <TabsTrigger value="basicInfo" className="px-1 py-2 sm:px-3">
            <UserCircle className="mr-1 h-4 w-4" /> 基本信息
          </TabsTrigger>
          <TabsTrigger value="medicalHistory" className="px-1 py-2 sm:px-3">
            <HeartHandshake className="mr-1 h-4 w-4" /> 病史与症状
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
              <CardDescription className="text-xs">管理您的姓名、联系方式、家庭住址、血型、婚姻等个人信息。</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <BasicInfoForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicalHistory">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-base">病史与症状</CardTitle>
              <CardDescription className="text-xs">管理您的家族病史、现有症状、既往史、用药史、过敏史等信息。</CardDescription>
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
                    <CardDescription className="text-xs">在此处查看和管理您已上传的检查报告。</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <ReportList /> 
                    <div className="text-center mt-4">
                        <Button asChild variant="outline" size="sm">
                            <Link href="/dashboard/reports">前往报告中心上传新报告</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
