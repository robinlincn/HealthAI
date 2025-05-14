
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { DoctorPatient, DetailedPatientProfile, FamilyMedicalHistoryEntry, MedicationEntry, Gender, SASOption, YesNoOption, FrequencyOption, AdherenceBodyOption, AdherenceMindOption, AdherenceComplianceOption, SleepAdequacyOption, ContactPreferenceMethod, ContactPreferenceFrequency, ContactPreferenceTime, ServiceSatisfactionOption } from "@/lib/types"; 
import { DoctorPatientProfileForm } from "@/components/doctor/patient-profile/DoctorPatientProfileForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCog } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns"; 

// Mock data fetching function (consistent with the detail page)
const mockPatientsList: DoctorPatient[] = [
    { 
      id: "pat001", name: "张三", age: 45, gender: "male", diagnosis: "高血压, 2型糖尿病", lastVisit: "2024-05-01",
      contact: "13800138001",
      emergencyContact: { name: "李四", phone: "13900139002", relationship: "配偶" },
      detailedProfile: {
        recordNumber: "MR00123", name: "张三", gender: "male", age: 45, dob: "1979-05-15",
        maritalStatus: "married", occupation: "工程师",
        address: "示例省示例市示例路123号", 
        contactPhone: "13800138001",
        contactEmail: "zhangsan@example.com",
        bloodType: "A",
        educationLevel: "bachelor",
        hadPreviousCheckup: true,
        agreesToIntervention: true,
        admissionDate: "2024-04-01T00:00:00.000Z", 
        recordDate: "2024-04-01T00:00:00.000Z",    
        chiefComplaint: "头晕、乏力一周",
        historyOfPresentIllness: "患者一周前无明显诱因出现头晕，伴乏力，自测血压波动于150-160/90-100mmHg，血糖餐后10-12mmol/L。",
        pastMedicalHistoryDetails: "2010年阑尾炎手术。高血压病史5年，2型糖尿病3年。",
        pastIllnesses: ["hypertension", "diabetes", "高血压", "糖尿病"],
        familyMedicalHistory: [ 
            { relative: "self", conditions: ["高血压", "糖尿病"] },
            { relative: "father", conditions: ["高血压"] },
            { relative: "mother", conditions: ["糖尿病"] },
            { relative: "paternal_grandparents", conditions: [] },
            { relative: "maternal_grandparents", conditions: ["高血脂"] },
        ],
        currentSymptoms: ["心慌", "胸闷", "头晕", "体重下降"], 
        allergies: ["青霉素", "海鲜"],
        operationHistory: ["心脏（含心脏介入）"],
        bloodTransfusionHistory: "2005年因外伤输血200ml",
        medicationCategories: ["降压药", "降糖药"],
        contactHistory: ["油烟", "粉烟尘"],
        
        dietaryHabits_breakfastDays: '7天',
        dietaryHabits_lateSnackDays: '1-2天',
        dietaryHabits_badHabits: ['吃饭过快', '挑食偏食'],
        dietaryHabits_preferences: ['咸', '辣', '生食'],
        dietaryHabits_foodTypePreferences: ['油炸食品', '经常吃快餐'],

        dietaryIntake_staple: '2-4碗',
        dietaryIntake_meat: '1-2两',
        dietaryIntake_fish: '<1两',
        dietaryIntake_eggs: '1-2个',
        dietaryIntake_dairy: '1-2杯',
        dietaryIntake_soy: '0.5-1两',
        dietaryIntake_vegetables: '6-10两',
        dietaryIntake_fruits: '1-4两',
        dietaryIntake_water: '6-9杯',

        exercise_workHours: '≥8小时',
        exercise_sedentaryHours: '5-8小时',
        exercise_weeklyFrequency: '偶尔（1-2次/周）',
        exercise_durationPerSession: '30-60分钟',
        exercise_intensity: '中度运动',

        smoking_status: '吸烟',
        smoking_cigarettesPerDay: '5-15支',
        smoking_years: '10-20年',
        smoking_passiveDays: '1-2天',

        drinking_status: '饮酒',
        drinking_type: '啤酒',
        drinking_amountPerDay: '<2两',
        drinking_years: '5-15年',
        
        mentalHealth_majorEvents: '否' as YesNoOption,
        mentalHealth_impactOnLife: '有一点' as '几乎没有' | '有一点' | '较明显' | '很大',
        mentalHealth_stressLevel: '较明显' as '几乎没有' | '有一点' | '较明显' | '很大',
        mentalHealth_sas_anxiety: "小部分时间有" as SASOption,
        mentalHealth_sas_fear: "没有或很少有时间有" as SASOption,
        mentalHealth_sas_panic: "小部分时间有" as SASOption,
        mentalHealth_sas_goingCrazy: "没有或很少有时间有" as SASOption,
        mentalHealth_sas_misfortune: "没有或很少有时间有" as SASOption,
        mentalHealth_sas_trembling: "小部分时间有" as SASOption,
        mentalHealth_sas_bodyPain: "相当多时间有" as SASOption,
        mentalHealth_sas_fatigue: "相当多时间有" as SASOption,
        mentalHealth_sas_restlessness: "小部分时间有" as SASOption,
        mentalHealth_sas_palpitations: "小部分时间有" as SASOption,
        mentalHealth_sas_dizziness: "相当多时间有" as SASOption,
        mentalHealth_sas_fainting: "没有或很少有时间有" as SASOption,
        mentalHealth_sas_breathingDifficulty: "小部分时间有" as SASOption,
        mentalHealth_sas_paresthesia: "没有或很少有时间有" as SASOption,
        mentalHealth_sas_stomachPain: "小部分时间有" as SASOption,
        mentalHealth_sas_frequentUrination: "没有或很少有时间有" as SASOption,
        mentalHealth_sas_sweating: "小部分时间有" as SASOption,

        adherence_selfAssessmentBody: "满意" as AdherenceBodyOption,
        adherence_selfAssessmentMind: "还算关心" as AdherenceMindOption,
        adherence_priorityProblems: ["控制血糖", "减轻头晕", "改善睡眠"],
        adherence_doctorAdviceCompliance: "执行一部分" as AdherenceComplianceOption,
        adherence_healthPromotionMethods: ["改变饮食习惯", "药物"],
        adherence_otherHealthPromotion: "定期体检",

        sleep_adequacy: "一般" as SleepAdequacyOption,

        otherInfo_medicationsUsed: "拜阿司匹林 100mg qd, 胰岛素 10U qn",
        otherInfo_contactPreference_method: "微信" as ContactPreferenceMethod,
        otherInfo_contactPreference_method_other: "",
        otherInfo_contactPreference_frequency: "每周一次" as ContactPreferenceFrequency,
        otherInfo_contactPreference_frequency_other: "",
        otherInfo_contactPreference_time: "下午" as ContactPreferenceTime,
        otherInfo_contactPreference_time_other: "",
        otherInfo_suggestions: "希望App能提供更详细的食谱推荐。",
        otherInfo_serviceSatisfaction: "较好" as ServiceSatisfactionOption,
      },
      healthDataSummary: "血糖近期偏高，血压控制尚可，需关注。",
      reports: [
        { id: "rep001", name: "2024-04-15 血液检查.pdf", type: "pdf", url: "#", uploadDate: "2024-04-15"},
        { id: "rep002", name: "2024-03-10 胸部CT.jpg", type: "image", url: "https://picsum.photos/seed/report_ct/200", uploadDate: "2024-03-10"},
      ]
    },
    { 
      id: "pat002", name: "李四", age: 62, gender: "female", diagnosis: "冠心病", lastVisit: "2024-05-10", contact: "13900139002",
      emergencyContact: { name: "王小明", phone: "13900239003", relationship: "儿子" },
      detailedProfile: { name: "李四", gender: "female", age: 62, dob: "1962-10-20", chiefComplaint: "胸闷、气短一月", pastIllnesses: ["heart_disease", "心脏病"], bloodType: "O", educationLevel: "senior_high_school" },
      healthDataSummary: "心率稳定，偶有胸闷。",
    },
     { 
      id: "pat003", name: "王五", age: 50, gender: "male", diagnosis: "高血脂", lastVisit: "2024-04-22", contact: "13700137003",
      detailedProfile: { name: "王五", gender: "male", age: 50, dob: "1974-01-01", chiefComplaint: "体检发现血脂异常", bloodType: "B", educationLevel: "college" },
      healthDataSummary: "血脂水平持续较高。",
    },
  ];

const getPatientDetails = (patientId: string): DoctorPatient | null => {
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
    setTimeout(() => {
      const details = getPatientDetails(patientId);
      setPatient(details);
      setIsLoading(false);
    }, 500);
  }, [patientId]);

  const handleSaveProfile = (updatedDetailedProfile: DetailedPatientProfile) => {
    if (patient) {
      console.log("Saving updated profile for patient:", patient.id, updatedDetailedProfile);
      
      const patientIndex = mockPatientsList.findIndex(p => p.id === patient.id);
      if (patientIndex !== -1) {
        mockPatientsList[patientIndex] = {
          ...mockPatientsList[patientIndex],
          name: updatedDetailedProfile.name || mockPatientsList[patientIndex].name,
          age: updatedDetailedProfile.age || mockPatientsList[patientIndex].age,
          gender: updatedDetailedProfile.gender || mockPatientsList[patientIndex].gender,
          contact: updatedDetailedProfile.contactPhone || mockPatientsList[patientIndex].contact, 
          detailedProfile: updatedDetailedProfile,
        };
      }
      
      toast({
        title: "病人信息已保存",
        description: `${updatedDetailedProfile.name || patient.name} 的档案已成功更新。`,
      });
      router.push(`/doctor/patients/${patientId}`); 
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
        <div /> 
      </div>
      
      <DoctorPatientProfileForm patient={patient} onSave={handleSaveProfile} />
    </div>
  );
}

