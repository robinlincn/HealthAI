
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, Search, Filter, FileUp, FileDown, Eye, BriefcaseMedical, CalendarDays, UploadCloud, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { DoctorPatient, DetailedPatientProfile, Gender } from "@/lib/types";
import { AddNewPatientDialog, type NewPatientFormValues } from "@/components/doctor/patient-profile/AddNewPatientDialog";
import { format, differenceInYears, parseISO } from "date-fns";

import { extractProfileInfoFlow, type ExtractProfileInfoOutput } from "@/ai/flows/extract-profile-info-flow";
import { mapAiOutputToDetailedProfile } from "@/lib/ai-profile-mapper";

// Mock patient data
const initialMockPatients: DoctorPatient[] = [
  { 
    id: "pat001", name: "张三", age: 45, gender: "male", diagnosis: "高血压, 2型糖尿病", lastVisit: "2024-05-01",
    contact: "13800138001",
    emergencyContact: { name: "李四", phone: "13900139002", relationship: "配偶" },
    detailedProfile: {
      name: "张三", gender: "male", age: 45, dob: "1979-05-15", contactPhone: "13800138001",
      recordNumber: "MRN001", maritalStatus: 'married', occupation: '工程师',
      address: '示例省示例市示例路1号', contactEmail: 'zhangsan@example.com',
      bloodType: 'A', educationLevel: 'bachelor', hadPreviousCheckup: true, agreesToIntervention: true,
      admissionDate: "2024-04-01", recordDate: "2024-04-01", informant:"本人", reliability:"reliable",
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
      allergies: ["青霉素", "海鲜"], otherAllergyText: "",
      operationHistory: ["心脏（含心脏介入）"],
      bloodTransfusionHistory: "2005年因外伤输血200ml",
      medicationCategories: ["降压药", "降糖药"],
      contactHistory: ["油烟", "粉烟尘"],
      
      dietaryHabits_breakfastDays: '7天',
      dietaryHabits_lateSnackDays: '1-2天',
      dietaryHabits_badHabits: ['吃饭过快', '挑食偏食'],
      dietaryHabits_preferences: ['咸', '辣', '生食'],
      dietaryHabits_foodTypePreferences: ['油炸食品', '经常吃快餐'],

      dietaryIntake_staple: '2-4碗', dietaryIntake_meat: '1-2两', dietaryIntake_fish: '<1两',
      dietaryIntake_eggs: '1-2个', dietaryIntake_dairy: '1-2杯', dietaryIntake_soy: '0.5-1两',
      dietaryIntake_vegetables: '6-10两', dietaryIntake_fruits: '1-4两', dietaryIntake_water: '6-9杯',

      exercise_workHours: '≥8小时', exercise_sedentaryHours: '5-8小时',
      exercise_weeklyFrequency: '偶尔（1-2次/周）', exercise_durationPerSession: '30-60分钟', exercise_intensity: '中度运动',

      smoking_status: '吸烟', smoking_cigarettesPerDay: '5-15支', smoking_years: '10-20年', smoking_passiveDays: '1-2天',

      drinking_status: '饮酒', drinking_type: '啤酒', drinking_amountPerDay: '<2两', drinking_years: '5-15年',
      
      mentalHealth_majorEvents: '否', mentalHealth_impactOnLife: '有一点', mentalHealth_stressLevel: '较明显',
      mentalHealth_sas_anxiety: "小部分时间有", mentalHealth_sas_fear: "没有或很少有时间有", mentalHealth_sas_panic: "小部分时间有",
      mentalHealth_sas_goingCrazy: "没有或很少有时间有", mentalHealth_sas_misfortune: "没有或很少有时间有", mentalHealth_sas_trembling: "小部分时间有",
      mentalHealth_sas_bodyPain: "相当多时间有", mentalHealth_sas_fatigue: "相当多时间有", mentalHealth_sas_restlessness: "小部分时间有",
      mentalHealth_sas_palpitations: "小部分时间有", mentalHealth_sas_dizziness: "相当多时间有", mentalHealth_sas_fainting: "没有或很少有时间有",
      mentalHealth_sas_breathingDifficulty: "小部分时间有", mentalHealth_sas_paresthesia: "没有或很少有时间有",
      mentalHealth_sas_stomachPain: "小部分时间有", mentalHealth_sas_frequentUrination: "没有或很少有时间有", mentalHealth_sas_sweating: "小部分时间有",

      adherence_selfAssessmentBody: "满意", adherence_selfAssessmentMind: "还算关心",
      adherence_priorityProblems: ["控制血糖", "减轻头晕", "改善睡眠",""],
      adherence_doctorAdviceCompliance: "执行一部分",
      adherence_healthPromotionMethods: ["改变饮食习惯", "药物"], adherence_otherHealthPromotion: "定期体检",

      sleep_adequacy: "一般",

      otherInfo_medicationsUsed: "拜阿司匹林 100mg qd, 胰岛素 10U qn",
      otherInfo_contactPreference_method: "微信", otherInfo_contactPreference_method_other: "",
      otherInfo_contactPreference_frequency: "每周一次", otherInfo_contactPreference_frequency_other: "",
      otherInfo_contactPreference_time: "下午", otherInfo_contactPreference_time_other: "",
      otherInfo_suggestions: "希望App能提供更详细的食谱推荐。", otherInfo_serviceSatisfaction: "较好",
    },
    healthDataSummary: "血糖近期偏高，血压控制尚可，需关注。",
    reports: [
      { id: "rep001", name: "2024-04-15 血液检查.pdf", type: "pdf", url: "#", uploadDate: "2024-04-15"},
    ]
  },
  { id: "pat002", name: "李四", age: 62, gender: "female", diagnosis: "冠心病", lastVisit: "2024-05-10", contact: "13900139002", detailedProfile: { name: "李四", gender: "female", age: 62, dob: "1962-10-20", familyMedicalHistory: [], currentSymptoms: [], allergies: [], operationHistory: [], medicationCategories: [], contactHistory: [], medicationHistory: [], adherence_priorityProblems: [], adherence_healthPromotionMethods: [] } },
  { id: "pat003", name: "王五", age: 50, gender: "male", diagnosis: "高血脂", lastVisit: "2024-04-22", contact: "13700137003", detailedProfile: { name: "王五", gender: "male", age: 50, dob: "1974-01-01", familyMedicalHistory: [], currentSymptoms: [], allergies: [], operationHistory: [], medicationCategories: [], contactHistory: [], medicationHistory: [], adherence_priorityProblems: [], adherence_healthPromotionMethods: [] } },
];

export default function DoctorPatientsPage() {
  const [mockPatients, setMockPatients] = useState<DoctorPatient[]>(initialMockPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDisease, setFilterDisease] = useState("all");
  const [filterAge, setFilterAge] = useState("all");
  const { toast } = useToast();
  const [isAddPatientDialogOpen, setIsAddPatientDialogOpen] = useState(false);

  // State for AI file fill
  const [selectedFileForAiFill, setSelectedFileForAiFill] = useState<File | null>(null);
  const [isAiProcessingGlobal, setIsAiProcessingGlobal] = useState(false);
  const [aiExtractedProfileData, setAiExtractedProfileData] = useState<Partial<DetailedPatientProfile> | null>(null);

  useEffect(() => {
    // This effect can be used if we need to react to mockPatients changes,
    // for example, re-filtering if data source changes.
    // For now, filtering is handled by useMemo.
  }, [mockPatients]);

  const handleFileChangeForAiFill = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFileForAiFill(event.target.files[0]);
      setAiExtractedProfileData(null); // Clear previous AI data if a new file is selected
    } else {
      setSelectedFileForAiFill(null);
    }
  };

  const handleAiRecognizeAndPrefillData = async () => {
    if (!selectedFileForAiFill) {
      toast({ title: "未选择文件", description: "请先选择一个图片或PDF文件进行识别。", variant: "destructive" });
      return;
    }
    setIsAiProcessingGlobal(true);
    setAiExtractedProfileData(null); 
    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFileForAiFill);
      reader.onloadend = async () => {
        const fileDataUri = reader.result as string;
        const aiResponse = await extractProfileInfoFlow({ fileDataUri });
        
        if (aiResponse) {
          const mappedData = mapAiOutputToDetailedProfile(aiResponse);
          setAiExtractedProfileData(mappedData);
          toast({
            title: "AI识别完成",
            description: `已提取档案信息。点击“添加新病人”以使用此信息预填充表单。`,
            duration: 7000,
          });
        } else {
          toast({ title: "AI识别失败", description: "未能从文件中提取有效信息，请检查文件或稍后再试。", variant: "destructive" });
        }
      };
      reader.onerror = () => {
        toast({ title: "文件读取失败", description: "无法读取您选择的文件。", variant: "destructive" });
      };
    } catch (error) {
      console.error("Error in AI recognition (patients page):", error);
      toast({ title: "AI处理出错", description: "处理您的文件时发生错误。", variant: "destructive" });
    } finally {
      setIsAiProcessingGlobal(false);
      // Do not clear selectedFileForAiFill here, user might want to retry or use it.
      // It will be cleared when the dialog is closed.
    }
  };

  const handleAddNewPatient = () => {
    // aiExtractedProfileData will be passed to the dialog
    setIsAddPatientDialogOpen(true);
  };
  
  const handleSaveNewPatient = (data: DetailedPatientProfile) => { // Changed from NewPatientFormValues
    const newPatientId = `pat${Date.now().toString().slice(-3)}${Math.floor(Math.random()*100)}`;
    const age = data.dob ? differenceInYears(new Date(), parseISO(data.dob as string)) : (data.age || 0);
    
    const newPatient: DoctorPatient = {
      id: newPatientId,
      name: data.name,
      age: age,
      gender: data.gender as Gender, // Schema ensures it's Gender or undefined
      diagnosis: data.chiefComplaint || "暂未填写主要诊断", // Example: use chiefComplaint as primary diagnosis
      lastVisit: format(new Date(), "yyyy-MM-dd"),
      contact: data.contactPhone,
      detailedProfile: data, // The full detailed profile from the form
      healthDataSummary: "新病人，档案已录入。",
    };

    setMockPatients(prev => [newPatient, ...prev]);
    setIsAddPatientDialogOpen(false);
    setAiExtractedProfileData(null); // Clear AI data after use
    setSelectedFileForAiFill(null); // Clear selected file
    const fileInput = document.getElementById('aiProfileUploadPatientsPage') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';

    toast({
      title: "病人添加成功",
      description: `病人 ${newPatient.name} 已成功添加到列表。`,
    });
  };

  const filteredPatients = useMemo(() => {
    return mockPatients.filter(patient => {
      const nameMatch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
      const diseaseMatch = filterDisease === "all" || patient.diagnosis.toLowerCase().includes(filterDisease.toLowerCase());
      const ageMatch = filterAge === "all" || 
                       (filterAge === "under50" && patient.age < 50) ||
                       (filterAge === "50to70" && patient.age >= 50 && patient.age <= 70) ||
                       (filterAge === "over70" && patient.age > 70);
      return nameMatch && diseaseMatch && ageMatch;
    });
  } , [mockPatients, searchTerm, filterDisease, filterAge]);

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Users className="mr-3 h-7 w-7 text-primary" />
            病人管理
          </CardTitle>
          <CardDescription>
            查看、搜索、筛选和管理您的患者列表、病历及治疗进展。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* AI File Fill Section */}
          <Card className="mb-6 border-dashed border-primary/50 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary"/> AI智能填充新病人档案 (可选)
              </CardTitle>
              <CardDescription className="text-sm">
                上传病人的健康报告或体检单 (图片/PDF)，AI将尝试自动识别并预填充新病人表单。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-grow">
                  <Label htmlFor="aiProfileUploadPatientsPage" className="text-xs font-medium">选择文件</Label>
                  <Input 
                    id="aiProfileUploadPatientsPage"
                    type="file" 
                    accept="image/*,.pdf" 
                    onChange={handleFileChangeForAiFill} 
                    className="text-xs h-9 mt-1"
                    disabled={isAiProcessingGlobal}
                  />
                </div>
                <Button 
                  onClick={handleAiRecognizeAndPrefillData} 
                  disabled={!selectedFileForAiFill || isAiProcessingGlobal} 
                  className="w-full sm:w-auto h-9"
                >
                  {isAiProcessingGlobal ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                  {isAiProcessingGlobal ? "识别中..." : "上传并AI识别"}
                </Button>
              </div>
              {selectedFileForAiFill && (
                <p className="text-xs text-muted-foreground">
                  已选文件: {selectedFileForAiFill.name} 
                  {aiExtractedProfileData && <span className="text-green-600 ml-2">(数据已提取，可添加新病人)</span>}
                </p>
              )}
            </CardContent>
          </Card>
          
          {/* Filter and Action Buttons Section */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="按姓名、病历号搜索病人..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4 flex-col sm:flex-row">
                <Select value={filterDisease} onValueChange={setFilterDisease}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="筛选疾病类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有疾病</SelectItem>
                    <SelectItem value="高血压">高血压</SelectItem>
                    <SelectItem value="2型糖尿病">2型糖尿病</SelectItem>
                    <SelectItem value="冠心病">冠心病</SelectItem>
                    <SelectItem value="高血脂">高血脂</SelectItem>
                     <SelectItem value="哮喘">哮喘</SelectItem>
                    <SelectItem value="痛风">痛风</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterAge} onValueChange={setFilterAge}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                     <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="筛选年龄范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有年龄</SelectItem>
                    <SelectItem value="under50">&lt; 50岁</SelectItem>
                    <SelectItem value="50to70">50-70岁</SelectItem>
                    <SelectItem value="over70">&gt; 70岁</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => toast({ title: "提示", description: "批量导入功能开发中。"})} >
                  <FileUp className="mr-2 h-4 w-4" /> 批量导入
                </Button>
                <Button variant="outline" onClick={() => toast({ title: "提示", description: "批量导出功能开发中。"})} >
                  <FileDown className="mr-2 h-4 w-4" /> 批量导出
                </Button>
              </div>
              <Button onClick={handleAddNewPatient}>
                <UserPlus className="mr-2 h-4 w-4" /> 添加新病人
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="flex flex-col hover:shadow-lg transition-shadow duration-200 ease-in-out rounded-xl overflow-hidden">
              <CardHeader className="items-center text-center p-4 bg-muted/30">
                <Avatar className="w-24 h-24 mb-3 border-2 border-primary/20 shadow-sm">
                  <AvatarImage src={`https://picsum.photos/seed/${patient.id}/120/120`} alt={patient.name} data-ai-hint="patient avatar" />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary font-semibold">{patient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{patient.name}</CardTitle>
                <CardDescription>{patient.age}岁 / {patient.gender}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3 p-4 text-sm">
                <div className="flex items-start">
                  <BriefcaseMedical className="mr-2 h-4 w-4 text-primary/80 flex-shrink-0 mt-1" />
                  <span className="text-muted-foreground"><strong className="font-medium text-foreground/90">诊断:</strong> {patient.diagnosis}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-primary/80 flex-shrink-0" />
                  <span className="text-muted-foreground"><strong className="font-medium text-foreground/90">最近就诊:</strong> {patient.lastVisit}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t">
                <Button asChild variant="outline" className="w-full hover:bg-primary/10 hover:text-primary">
                  <Link href={`/doctor/patients/${patient.id}`}>
                    <Eye className="mr-2 h-4 w-4" /> 查看详情
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="py-16">
                <div className="flex flex-col items-center text-center">
                    <Users className="w-24 h-24 text-primary/20 mb-6" />
                    <h3 className="text-2xl font-semibold text-foreground/80 mb-2">未找到匹配的病人</h3>
                    <p className="text-muted-foreground max-w-md">
                        请尝试调整您的搜索或筛选条件，或点击“添加新病人”按钮来创建新的病人档案。
                    </p>
                </div>
            </CardContent>
        </Card>
      )}
       <AddNewPatientDialog 
        isOpen={isAddPatientDialogOpen}
        onClose={() => {
            setIsAddPatientDialogOpen(false);
            setAiExtractedProfileData(null); // Clear AI data when dialog closes
            setSelectedFileForAiFill(null);
            const fileInput = document.getElementById('aiProfileUploadPatientsPage') as HTMLInputElement | null;
            if (fileInput) fileInput.value = '';
        }}
        onSave={handleSaveNewPatient}
        initialDataFromAI={aiExtractedProfileData} // Pass AI data here
      />
    </div>
  );
}

    