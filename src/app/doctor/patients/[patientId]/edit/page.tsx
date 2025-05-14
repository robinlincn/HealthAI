
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { DoctorPatient, DetailedPatientProfile } from "@/lib/types";
import { DoctorPatientProfileForm } from "@/components/doctor/patient-profile/DoctorPatientProfileForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCog } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Mock data fetching function (consistent with the detail page)
const mockPatientsList: DoctorPatient[] = [
    { 
      id: "pat001", name: "张三", age: 45, gender: "male", diagnosis: "高血压, 2型糖尿病", lastVisit: "2024-05-01",
      contact: "13800138001",
      emergencyContact: { name: "李四", phone: "13900139002", relationship: "配偶" },
      detailedProfile: {
        recordNumber: "MR00123", name: "张三", gender: "male", age: 45, maritalStatus: "married", occupation: "工程师",
        chiefComplaint: "头晕、乏力一周",
        historyOfPresentIllness: "患者一周前无明显诱因出现头晕，伴乏力，自测血压波动于150-160/90-100mmHg，血糖餐后10-12mmol/L。",
        pastMedicalHistoryDetails: "2010年阑尾炎手术。高血压病史5年，2型糖尿病3年。",
        familyHistory_father: "高血压病史", pastIllnesses: ["hypertension", "diabetes"],
      },
      healthDataSummary: "血糖近期偏高，血压控制尚可，需关注。",
      reports: [
        { id: "rep001", name: "2024-04-15 血液检查.pdf", type: "pdf", url: "#", uploadDate: "2024-04-15"},
      ]
    },
    { 
      id: "pat002", name: "李四", age: 62, gender: "female", diagnosis: "冠心病", lastVisit: "2024-05-10", contact: "13900139002",
      emergencyContact: { name: "王小明", phone: "13900239003", relationship: "儿子" },
      detailedProfile: { name: "李四", gender: "female", age: 62, chiefComplaint: "胸闷、气短一月", pastIllnesses: ["heart_disease"] },
      healthDataSummary: "心率稳定，偶有胸闷。",
    },
     { 
      id: "pat003", name: "王五", age: 50, gender: "male", diagnosis: "高血脂", lastVisit: "2024-04-22", contact: "13700137003",
      detailedProfile: { name: "王五", gender: "male", age: 50, chiefComplaint: "体检发现血脂异常" },
      healthDataSummary: "血脂水平持续较高。",
    },
  ];

const getPatientDetails = (patientId: string): DoctorPatient | null => {
  // In a real app, make sure this list is kept in sync or fetched from a central store
  return mockPatientsList.find(p => p.id === patientId) || null;
};

export default function EditPatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const patientId = params.patientId as string;

  const [patient, setPatient] = useState<DoctorPatient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      const details = getPatientDetails(patientId);
      setPatient(details);
      setIsLoading(false);
    }, 500);
  }, [patientId]);

  const handleSaveProfile = (updatedDetailedProfile: DetailedPatientProfile) => {
    if (patient) {
      // Simulate saving: In a real app, this would be an API call
      console.log("Saving updated profile for patient:", patient.id, updatedDetailedProfile);
      
      // Update the mock data store (for demo purposes)
      const patientIndex = mockPatientsList.findIndex(p => p.id === patient.id);
      if (patientIndex !== -1) {
        mockPatientsList[patientIndex] = {
          ...mockPatientsList[patientIndex],
          // Update main patient fields if they are part of DetailedPatientProfile and could be changed
          name: updatedDetailedProfile.name || mockPatientsList[patientIndex].name,
          age: updatedDetailedProfile.age || mockPatientsList[patientIndex].age,
          gender: updatedDetailedProfile.gender || mockPatientsList[patientIndex].gender,
          contact: updatedDetailedProfile.address, // Assuming address in form maps to contact
          detailedProfile: updatedDetailedProfile,
        };
      }
      
      toast({
        title: "病人信息已保存",
        description: `${updatedDetailedProfile.name || patient.name} 的档案已成功更新。`,
      });
      router.push(`/doctor/patients/${patientId}`); // Navigate back to detail page
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-10 w-48 mb-4" />
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/3 ml-auto" />
          </CardContent>
        </Card>
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
            <p>无法加载ID为 {patientId} 的病人编辑信息。</p>
            <Button asChild variant="link" className="mt-4" onClick={() => router.back()}>
              <>
                <ArrowLeft className="mr-2 h-4 w-4" /> 返回
              </>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1 md:p-4 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.push(`/doctor/patients/${patientId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> 取消编辑
        </Button>
        <h1 className="text-xl md:text-2xl font-semibold flex items-center">
          <UserCog className="mr-2 h-6 w-6 md:h-7 md:w-7 text-primary" />
          编辑病人档案: {patient.name}
        </h1>
        <div /> {/* Spacer */}
      </div>
      
      <DoctorPatientProfileForm patient={patient} onSave={handleSaveProfile} />
    </div>
  );
}
