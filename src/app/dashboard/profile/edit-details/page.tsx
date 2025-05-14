
"use client";

import { BasicInfoForm } from "@/components/profile/BasicInfoForm";
import { EmergencyContacts } from "@/components/profile/EmergencyContacts";
import { ReportList } from "@/components/reports/ReportList";
import { UserCircle, ShieldAlert, FileText, Users, ClipboardList, Stethoscope, Droplets, Pill, Apple, Utensils, Dumbbell, Cigarette, Wine, Brain, CheckSquare, Bed, Info, MessagesSquare, Lightbulb, ThumbsUp, CalendarHeart, Activity, ShieldQuestion, Syringe, SprayCan, CookingPot } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Import ScrollArea

export default function EditProfileDetailsPage() {
  const renderPlaceholderContent = (title: string) => (
    <Card className="shadow-sm mt-4"> {/* Added mt-4 for spacing under tabs */}
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

  const tabItems = [
    { value: "basicInfo", label: "基本信息", icon: UserCircle },
    { value: "familyHistory", label: "家族病史", icon: Users },
    { value: "currentSymptoms", label: "现有症状", icon: Activity },
    { value: "allergies", label: "过敏史", icon: ShieldQuestion },
    { value: "operationHistory", label: "手术史", icon: Stethoscope },
    { value: "bloodTransfusion", label: "输血史", icon: Syringe },
    { value: "medicationHistory", label: "用药史", icon: Pill },
    { value: "contactHistory", label: "接触史", icon: SprayCan },
    { value: "dietaryHabits", label: "饮食习惯", icon: Apple },
    { value: "dietaryIntake", label: "膳食摄入", icon: CookingPot },
    { value: "exercise", label: "运动锻炼", icon: Dumbbell },
    { value: "smokingStatus", label: "吸烟情况", icon: Cigarette },
    { value: "drinkingStatus", label: "饮酒情况", icon: Wine },
    { value: "mentalHealth", label: "心理健康", icon: Brain },
    { value: "adherence", label: "遵医行为", icon: CheckSquare },
    { value: "sleep", label: "睡眠", icon: Bed },
    { value: "otherInfo", label: "其他信息", icon: Info },
    { value: "communication", label: "沟通进展", icon: MessagesSquare },
    { value: "suggestions", label: "您的建议", icon: Lightbulb },
    { value: "serviceSatisfaction", label: "服务满意度", icon: ThumbsUp },
    { value: "emergencyContacts", label: "紧急联系", icon: ShieldAlert },
    { value: "uploadedReports", label: "已上传报告", icon: FileText },
  ];


  return (
    <div className="space-y-6">
      <Tabs defaultValue="basicInfo" className="w-full">
        <ScrollArea className="w-full whitespace-nowrap pb-2.5">
          <TabsList className="inline-flex h-auto items-center justify-start rounded-md bg-muted p-1 text-muted-foreground space-x-1">
            {tabItems.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="px-3 py-1.5 text-xs sm:text-sm flex items-center gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="basicInfo">
          <Card className="shadow-sm mt-4"> {/* Added mt-4 for spacing under tabs */}
            <CardHeader className="p-4">
              <CardTitle className="text-base">基本信息</CardTitle>
              <CardDescription className="text-xs">管理您的姓名、联系方式、家庭住址、血型、婚姻等个人信息。</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <BasicInfoForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="familyHistory">{renderPlaceholderContent("家族病史及患病情况")}</TabsContent>
        <TabsContent value="currentSymptoms">{renderPlaceholderContent("现有不适症状")}</TabsContent>
        <TabsContent value="allergies">{renderPlaceholderContent("过敏史")}</TabsContent>
        <TabsContent value="operationHistory">{renderPlaceholderContent("手术史")}</TabsContent>
        <TabsContent value="bloodTransfusion">{renderPlaceholderContent("输血史")}</TabsContent>
        <TabsContent value="medicationHistory">{renderPlaceholderContent("用药史")}</TabsContent>
        <TabsContent value="contactHistory">{renderPlaceholderContent("接触史")}</TabsContent>
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
        
        <TabsContent value="emergencyContacts">
           <Card className="shadow-sm mt-4"> {/* Added mt-4 */}
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
            <Card className="shadow-sm mt-4"> {/* Added mt-4 */}
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

