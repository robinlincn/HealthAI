
"use client";

import { BasicInfoForm } from "@/components/profile/BasicInfoForm";
// MedicalHistoryForm is removed as its contents are now split into granular tabs
import { EmergencyContacts } from "@/components/profile/EmergencyContacts";
import { ReportList } from "@/components/reports/ReportList";
import { UserCircle, ShieldAlert, FileText, Users, ClipboardList, Stethoscope, Droplets, Pill, Apple, Utensils, Dumbbell, Cigarette, Wine, Brain, CheckSquare, Bed, Info, MessagesSquare, Lightbulb, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function EditProfileDetailsPage() {
  const renderPlaceholderContent = (title: string) => (
    <Card className="shadow-sm">
      <CardHeader className="p-4">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-xs">此模块用于记录您的 {title.toLowerCase()} 相关信息。</CardDescription>
      </CardHeader>
      <CardContent className="p-4 text-center text-muted-foreground">
        <p className="mb-2 text-sm">"{title}" 功能正在建设中。</p>
        <p className="text-xs">相关的表单字段和交互逻辑将在此处实现。</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basicInfo" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 text-xs sm:text-sm h-auto gap-1">
          <TabsTrigger value="basicInfo" className="px-1 py-2 sm:px-3">
            <UserCircle className="mr-1 h-4 w-4" /> 基本信息
          </TabsTrigger>
          {/* New Tabs Start Here */}
          <TabsTrigger value="familyHistory" className="px-1 py-2 sm:px-3">
            <Users className="mr-1 h-4 w-4" /> 家族病史
          </TabsTrigger>
          <TabsTrigger value="currentSymptoms" className="px-1 py-2 sm:px-3">
            <ClipboardList className="mr-1 h-4 w-4" /> 现有症状
          </TabsTrigger>
          <TabsTrigger value="allergies" className="px-1 py-2 sm:px-3">
            <ShieldAlert className="mr-1 h-4 w-4" /> 过敏史
          </TabsTrigger>
          <TabsTrigger value="operationHistory" className="px-1 py-2 sm:px-3">
            <Stethoscope className="mr-1 h-4 w-4" /> 手术史
          </TabsTrigger>
          <TabsTrigger value="bloodTransfusion" className="px-1 py-2 sm:px-3">
            <Droplets className="mr-1 h-4 w-4" /> 输血史
          </TabsTrigger>
          <TabsTrigger value="medicationHistory" className="px-1 py-2 sm:px-3">
            <Pill className="mr-1 h-4 w-4" /> 用药史
          </TabsTrigger>
          <TabsTrigger value="dietaryHabits" className="px-1 py-2 sm:px-3">
            <Apple className="mr-1 h-4 w-4" /> 饮食习惯
          </TabsTrigger>
          <TabsTrigger value="dietaryIntake" className="px-1 py-2 sm:px-3">
            <Utensils className="mr-1 h-4 w-4" /> 膳食摄入
          </TabsTrigger>
          <TabsTrigger value="exercise" className="px-1 py-2 sm:px-3">
            <Dumbbell className="mr-1 h-4 w-4" /> 运动锻炼
          </TabsTrigger>
          <TabsTrigger value="smokingStatus" className="px-1 py-2 sm:px-3">
            <Cigarette className="mr-1 h-4 w-4" /> 吸烟情况
          </TabsTrigger>
          <TabsTrigger value="drinkingStatus" className="px-1 py-2 sm:px-3">
            <Wine className="mr-1 h-4 w-4" /> 饮酒情况
          </TabsTrigger>
          <TabsTrigger value="mentalHealth" className="px-1 py-2 sm:px-3">
            <Brain className="mr-1 h-4 w-4" /> 心理健康
          </TabsTrigger>
          <TabsTrigger value="adherence" className="px-1 py-2 sm:px-3">
            <CheckSquare className="mr-1 h-4 w-4" /> 遵医行为
          </TabsTrigger>
          <TabsTrigger value="sleep" className="px-1 py-2 sm:px-3">
            <Bed className="mr-1 h-4 w-4" /> 睡眠
          </TabsTrigger>
          <TabsTrigger value="otherInfo" className="px-1 py-2 sm:px-3">
            <Info className="mr-1 h-4 w-4" /> 其他
          </TabsTrigger>
          <TabsTrigger value="communication" className="px-1 py-2 sm:px-3">
            <MessagesSquare className="mr-1 h-4 w-4" /> 沟通进展
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="px-1 py-2 sm:px-3">
            <Lightbulb className="mr-1 h-4 w-4" /> 中心建议
          </TabsTrigger>
          <TabsTrigger value="serviceSatisfaction" className="px-1 py-2 sm:px-3">
            <ThumbsUp className="mr-1 h-4 w-4" /> 服务满意度
          </TabsTrigger>
          {/* End of New Tabs */}
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

        {/* Placeholder content for new tabs */}
        <TabsContent value="familyHistory">{renderPlaceholderContent("家族病史及患病情况")}</TabsContent>
        <TabsContent value="currentSymptoms">{renderPlaceholderContent("现有不适症状")}</TabsContent>
        <TabsContent value="allergies">{renderPlaceholderContent("过敏史")}</TabsContent>
        <TabsContent value="operationHistory">{renderPlaceholderContent("手术史")}</TabsContent>
        <TabsContent value="bloodTransfusion">{renderPlaceholderContent("输血史")}</TabsContent>
        <TabsContent value="medicationHistory">{renderPlaceholderContent("用药史")}</TabsContent>
        <TabsContent value="dietaryHabits">{renderPlaceholderContent("饮食习惯")}</TabsContent>
        <TabsContent value="dietaryIntake">{renderPlaceholderContent("膳食摄入（个人）")}</TabsContent>
        <TabsContent value="exercise">{renderPlaceholderContent("运动锻炼")}</TabsContent>
        <TabsContent value="smokingStatus">{renderPlaceholderContent("吸烟情况")}</TabsContent>
        <TabsContent value="drinkingStatus">{renderPlaceholderContent("饮酒情况")}</TabsContent>
        <TabsContent value="mentalHealth">{renderPlaceholderContent("心理健康")}</TabsContent>
        <TabsContent value="adherence">{renderPlaceholderContent("遵医行为")}</TabsContent>
        <TabsContent value="sleep">{renderPlaceholderContent("睡眠")}</TabsContent>
        <TabsContent value="otherInfo">{renderPlaceholderContent("其他")}</TabsContent>
        <TabsContent value="communication">{renderPlaceholderContent("沟通健康进展")}</TabsContent>
        <TabsContent value="suggestions">{renderPlaceholderContent("您对本中心的建议")}</TabsContent>
        <TabsContent value="serviceSatisfaction">{renderPlaceholderContent("您对我中心的服务")}</TabsContent>
        
        {/* Existing Tabs */}
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
