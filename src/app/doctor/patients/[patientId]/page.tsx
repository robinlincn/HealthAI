"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle } from "lucide-react"; // Removed Edit3 as editing is handled by the form
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { DoctorPatient, DetailedPatientProfile } from "@/lib/types";
import { DoctorPatientProfileForm } from "@/components/doctor/patient-profile/DoctorPatientProfileForm";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data fetching function (replace with actual data fetching)
const getPatientDetails = (patientId: string): DoctorPatient | null => {
  const mockPatientsList: DoctorPatient[] = [
    { 
      id: "pat001", name: "张三", age: 45, gender: "male", diagnosis: "高血压, 2型糖尿病", lastVisit: "2024-05-01",
      contact: "13800138001",
      detailedProfile: {
        recordNumber: "MR00123",
        name: "张三", // Ensure name is part of detailedProfile if form expects it
        gender: "male",
        age: 45,
        maritalStatus: "married",
        occupation: "工程师",
        nationality: "汉族",
        birthplace: "北京",
        address: "北京市朝阳区幸福路123号", // Ensure address is part of detailedProfile
        admissionDate: "2024-04-20T00:00:00.000Z",
        recordDate: "2024-04-20T00:00:00.000Z",
        informant: "患者本人",
        reliability: 'reliable',
        chiefComplaint: "头晕、乏力一周",
        historyOfPresentIllness: "患者一周前无明显诱因出现头晕，伴乏力，自测血压波动于150-160/90-100mmHg，血糖餐后10-12mmol/L。",
        pastMedicalHistoryDetails: "2010年阑尾炎手术。否认肝炎、结核等传染病史。",
        pastIllnesses: ["hypertension", "diabetes"],
        vaccinationHistory: "已按计划完成免疫接种。",
        familyHistory_father: "高血压病史",
        physicalExam_temperature: "36.8℃",
        physicalExam_pulseRate: "78次/分",
        physicalExam_respiratoryRate: "18次/分",
        physicalExam_bloodPressure: "155/95mmHg",
        initialDiagnosis: "1. 原发性高血压 2级 (很高危)\n2. 2型糖尿病",
        treatmentPlanOpinion: "1. 继续口服降压药物，监测血压变化。\n2. 调整降糖药物，控制饮食，加强运动。\n3. 完善相关检查。",
        attendingPhysician: "李医生",
        chiefPhysician: "王主任",
      }
    },
    { 
      id: "pat002", name: "李四", age: 62, gender: "female", diagnosis: "冠心病", lastVisit: "2024-05-10", contact: "13900139002", 
      detailedProfile: { 
        name: "李四", gender: "female", age: 62, address: "上海市浦东新区健康路789号",
        chiefComplaint: "胸闷、气短一月" 
      } 
    },
    { 
      id: "pat003", name: "王五", age: 50, gender: "male", diagnosis: "高血脂", lastVisit: "2024-04-22", contact: "13700137003", 
      detailedProfile: { 
        name: "王五", gender: "male", age: 50, address: "广东省深圳市南山区科技园路101号",
        chiefComplaint: "体检发现血脂异常" 
      } 
    },
  ];
  return mockPatientsList.find(p => p.id === patientId) || null;
};


export default function DoctorPatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;
  const [patient, setPatient] = useState<DoctorPatient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const details = getPatientDetails(patientId);
      setPatient(details);
      setIsLoading(false);
    }, 500);
  }, [patientId]);

  const handleSaveProfile = (updatedProfileData: DetailedPatientProfile) => {
    if (patient) {
      const updatedPatientData: DoctorPatient = {
        ...patient, // Spread existing patient data
        name: updatedProfileData.name || patient.name, 
        gender: updatedProfileData.gender || patient.gender,
        age: updatedProfileData.age !== undefined ? updatedProfileData.age : patient.age, // Ensure age is updated correctly
        contact: updatedProfileData.address || patient.contact, // Assuming form's address maps to patient's contact
        // Update other top-level patient fields if they are part of the form
        detailedProfile: {
          ...patient.detailedProfile, // Spread existing detailed profile
          ...updatedProfileData, // Override with new data
        },
      };
      setPatient(updatedPatientData);
      // Here you would also send the data to your backend API
      console.log("Updated patient data:", updatedPatientData);
      // Add toast notification for successful save
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
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
            <p>无法加载ID为 {patientId} 的病人信息。</p>
            <Button asChild variant="link" className="mt-4" onClick={() => router.back()}>
              <span><ArrowLeft className="mr-2 h-4 w-4" /> 返回病人列表</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1 md:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <Button variant="outline" onClick={() => router.back()} className="self-start sm:self-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回病人列表
        </Button>
        <h1 className="text-xl md:text-2xl font-semibold flex items-center text-center sm:text-left flex-grow justify-center sm:justify-start">
          <UserCircle className="mr-2 h-6 w-6 md:h-7 md:w-7 text-primary flex-shrink-0" />
          病人档案: {patient.name}
        </h1>
        {/* Edit button is now part of the DoctorPatientProfileForm logic */}
      </div>

      <DoctorPatientProfileForm patient={patient} onSave={handleSaveProfile} />
      
    </div>
  );
}
