
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Mail, Phone, Briefcase, Building, Award, FilePenLine, Edit } from "lucide-react";
import type { DoctorProfileDetails } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { DoctorProfileFormDialog } from "@/components/doctor/profile/DoctorProfileFormDialog";
import { Skeleton } from "@/components/ui/skeleton";

const mockInitialDoctorProfile: DoctorProfileDetails = {
  id: "doc001",
  name: "王医生 (示例)",
  email: "wang.doc@example.com",
  phone: "13812345678",
  specialty: "心血管内科",
  hospitalAffiliation: "AI健康中心医院",
  yearsOfExperience: 15,
  bio: "致力于心血管疾病的预防与治疗，拥有丰富临床经验。擅长高血压、冠心病、心力衰竭等疾病的诊治。",
  avatarUrl: "https://picsum.photos/seed/doctorprof/200/200",
  licenseNumber: "1100000000000001",
  department: "内科门诊 / 心血管专科",
};

export default function DoctorProfilePage() {
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfileDetails | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Simulate fetching data
    setDoctorProfile(mockInitialDoctorProfile);
  }, []);

  const handleProfileUpdate = (updatedProfile: DoctorProfileDetails) => {
    setDoctorProfile(updatedProfile);
    setIsFormOpen(false);
    toast({
      title: "资料更新成功",
      description: "您的个人资料已成功更新。",
    });
  };

  if (!isClient || !doctorProfile) {
    return (
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-7 w-48" />
            </div>
            <Skeleton className="h-4 w-3/4 mt-1" />
          </CardHeader>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle className="text-2xl flex items-center">
              <UserCircle className="mr-3 h-7 w-7 text-primary" />
              医生资料管理
            </CardTitle>
            <CardDescription>
              查看和更新您的个人执业信息、专业背景和账户设置。
            </CardDescription>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="mt-4 sm:mt-0">
            <Edit className="mr-2 h-4 w-4" /> 编辑资料
          </Button>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="items-center text-center border-b pb-6">
            <Avatar className="w-32 h-32 mb-4 border-4 border-primary/20 shadow-lg">
                <AvatarImage src={doctorProfile.avatarUrl} alt={doctorProfile.name} data-ai-hint="doctor professional" />
                <AvatarFallback className="text-4xl bg-muted">
                    {doctorProfile.name.substring(0, 1)}
                </AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl">{doctorProfile.name}</CardTitle>
            {doctorProfile.specialty && <CardDescription className="text-base text-primary">{doctorProfile.specialty}</CardDescription>}
            {doctorProfile.hospitalAffiliation && <p className="text-sm text-muted-foreground">{doctorProfile.hospitalAffiliation}</p>}
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div className="flex items-center">
              <Mail className="mr-3 h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div><strong>邮箱:</strong> {doctorProfile.email}</div>
            </div>
            <div className="flex items-center">
              <Phone className="mr-3 h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div><strong>电话:</strong> {doctorProfile.phone || "未提供"}</div>
            </div>
            <div className="flex items-center">
              <Building className="mr-3 h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div><strong>院内部门:</strong> {doctorProfile.department || "未指定"}</div>
            </div>
             <div className="flex items-center">
              <FilePenLine className="mr-3 h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div><strong>执业医师编号:</strong> {doctorProfile.licenseNumber || "未提供"}</div>
            </div>
            <div className="flex items-center">
              <Award className="mr-3 h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div><strong>执业年限:</strong> {doctorProfile.yearsOfExperience !== undefined ? `${doctorProfile.yearsOfExperience}年` : "未提供"}</div>
            </div>
          </div>
          
          {doctorProfile.bio && (
            <div className="pt-2">
              <h4 className="text-md font-semibold mb-1">简介与擅长:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-md">
                {doctorProfile.bio}
              </p>
            </div>
          )}
          
          <Card className="mt-6 bg-accent/10">
            <CardHeader>
                <CardTitle className="text-base">账户安全与设置 (示例)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Button variant="outline" className="w-full sm:w-auto" disabled>修改密码</Button>
                <Button variant="outline" className="w-full sm:w-auto" disabled>双重认证设置</Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <DoctorProfileFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleProfileUpdate}
        doctorProfile={doctorProfile}
      />
    </div>
  );
}
