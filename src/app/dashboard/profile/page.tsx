import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoForm } from "@/components/profile/BasicInfoForm";
import { MedicalHistoryForm } from "@/components/profile/MedicalHistoryForm";
import { EmergencyContacts } from "@/components/profile/EmergencyContacts";
import { UserCircle, HeartHandshake, ShieldAlert } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <UserCircle className="mr-3 h-7 w-7 text-primary" />
            个人信息管理
          </CardTitle>
          <CardDescription>
            查看和更新您的个人资料、医疗记录和紧急联系人信息。
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="basicInfo" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="basicInfo">
            <UserCircle className="mr-2 h-4 w-4" /> 基本信息
          </TabsTrigger>
          <TabsTrigger value="medicalHistory">
            <HeartHandshake className="mr-2 h-4 w-4" /> 病历信息
          </TabsTrigger>
          <TabsTrigger value="emergencyContacts">
            <ShieldAlert className="mr-2 h-4 w-4" /> 紧急联系人
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
      </Tabs>
    </div>
  );
}
