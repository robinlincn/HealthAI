
"use client";

import * as React from 'react'; // Added React import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, UserCircle, FileText, LineChart as LineChartIcon, ClipboardList, Edit3, Check, X, Heart, AlertTriangle, TestTube, Stethoscope, Syringe, Wind, Utensils, Dumbbell, Cigarette, Wine, Brain, CheckSquare, Bed, Info, Pill } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { DoctorPatient, DetailedPatientProfile, Gender, MaritalStatus, BloodType, FamilyMedicalHistoryEntry, MedicationEntry, YesNoOption, FrequencyOption, ExerciseIntensityOption, SmokingStatusOption, DrinkingStatusOption, AlcoholTypeOption, SASOption, AdherenceBodyOption, AdherenceMindOption, AdherenceComplianceOption, SleepAdequacyOption, ContactPreferenceMethod, ContactPreferenceFrequency, ContactPreferenceTime, ServiceSatisfactionOption, DietaryIntakeOption } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { format, parseISO, isValid } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock data fetching function (replace with actual data fetching)
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
        pastIllnesses: ["hypertension", "diabetes"],
        familyMedicalHistory: [ 
            { relative: "self", conditions: ["高血压", "糖尿病"] },
            { relative: "father", conditions: ["高血压"] },
            { relative: "mother", conditions: ["糖尿病"] },
            { relative: "paternal_grandparents", conditions: [] },
            { relative: "maternal_grandparents", conditions: ["高血脂"] },
        ],
        currentSymptoms: ["心慌", "胸闷", "头晕"], 
        allergies: ["青霉素", "海鲜"],
        operationHistory: ["心脏（含心脏介入）"],
        bloodTransfusionHistory: "2005年因外伤输血200ml",
        medicationCategories: ["降压药", "降糖药"],
        contactHistory: ["油烟"],
        contactHistory_oy: "是",
        contactHistory_dust: "否",
        contactHistory_toxic: "不详",
        dietaryHabits_breakfastDays: '7天',
        dietaryHabits_lateSnackDays: '1-2天',
        dietaryHabits_badHabits: ['吃饭过快', '吃得过饱'],
        dietaryHabits_preferences: ['咸', '辣'],
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
        mentalHealth_majorEvents: '否',
        mentalHealth_impactOnLife: '有一点',
        mentalHealth_stressLevel: '较明显',
        mentalHealth_sas_anxiety: "小部分时间有",
        mentalHealth_sas_fear: "没有或很少有时间有",
        mentalHealth_sas_panic: "小部分时间有",
        mentalHealth_sas_goingCrazy: "没有或很少有时间有",
        mentalHealth_sas_misfortune: "没有或很少有时间有",
        mentalHealth_sas_trembling: "小部分时间有",
        mentalHealth_sas_bodyPain: "相当多时间有",
        mentalHealth_sas_fatigue: "相当多时间有",
        mentalHealth_sas_restlessness: "小部分时间有",
        mentalHealth_sas_palpitations: "小部分时间有",
        mentalHealth_sas_dizziness: "相当多时间有",
        mentalHealth_sas_fainting: "没有或很少有时间有",
        mentalHealth_sas_breathingDifficulty: "小部分时间有",
        mentalHealth_sas_paresthesia: "没有或很少有时间有",
        mentalHealth_sas_stomachPain: "小部分时间有",
        mentalHealth_sas_frequentUrination: "没有或很少有时间有",
        mentalHealth_sas_sweating: "小部分时间有",
        adherence_selfAssessmentBody: "满意",
        adherence_selfAssessmentMind: "还算关心",
        adherence_priorityProblems: ["控制血糖", "减轻头晕"],
        adherence_doctorAdviceCompliance: "执行一部分",
        adherence_healthPromotionMethods: ["改变饮食习惯", "药物"],
        adherence_otherHealthPromotion: "定期复查",
        sleep_adequacy: "一般",
        otherInfo_medicationsUsed: "拜阿司匹林 100mg qd, 胰岛素 10U qn",
        otherInfo_contactPreference_method: "微信",
        otherInfo_contactPreference_frequency: "每周一次",
        otherInfo_contactPreference_time: "下午",
        otherInfo_suggestions: "希望App能提供更详细的食谱推荐。",
        otherInfo_serviceSatisfaction: "较好",
        operationHistory_text: "2010年阑尾炎切除术", 
        bloodTransfusionHistory_details: "无",
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
      detailedProfile: { name: "李四", gender: "female", age: 62, dob: "1962-10-20", chiefComplaint: "胸闷、气短一月", pastIllnesses: ["heart_disease"], bloodType: "O", educationLevel: "senior_high_school" },
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

const allFamilyConditions = ["高血压", "糖尿病", "冠心病", "高血脂", "肥胖", "脑卒中", "骨质疏松", "老年痴呆", "肺癌", "肝癌", "胃肠癌", "前列腺癌", "乳腺癌", "宫颈癌"];
const relativesMap: Record<FamilyMedicalHistoryEntry["relative"], string> = {
  self: "本人",
  father: "父亲",
  mother: "母亲",
  paternal_grandparents: "祖父母",
  maternal_grandparents: "外祖父母",
};


export default function DoctorPatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const patientId = params.patientId as string;
  const [patient, setPatient] = useState<DoctorPatient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => { // Simulate API call
      const details = getPatientDetails(patientId);
      setPatient(details);
      setIsLoading(false);
    }, 500);
  }, [patientId]);

  const getGenderText = (gender?: Gender) => {
    if (!gender) return '未知';
    const map = { male: '男', female: '女', other: '其他' };
    return map[gender] || '未知';
  };

  const getMaritalStatusText = (status?: MaritalStatus) => {
    if (!status) return '未知';
    const map = { unmarried: '未婚', married: '已婚', divorced: '离异', widowed: '丧偶', other: '其他' };
    return map[status] || '未知';
  };
  
  const getBloodTypeText = (type?: BloodType) => {
    if (!type || type === 'unknown') return '未知';
    return `${type.toUpperCase()}型`;
  };

  const getEducationLevelText = (level?: string) => {
    if (!level) return '未知';
    const map: { [key: string]: string } = {
      primary_school: '小学',
      junior_high_school: '初中',
      senior_high_school: '高中/中专',
      college: '大专',
      bachelor: '本科',
      master: '硕士',
      doctorate: '博士',
      other: '其他',
    };
    return map[level] || level;
  };

  const renderInfoList = (items?: string[], emptyText: string = "无记录") => {
    if (!items || items.length === 0) {
      return <span className="text-muted-foreground text-sm">{emptyText}</span>;
    }
    return (
      <div className="flex flex-wrap gap-1">
        {items.map(item => <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>)}
      </div>
    );
  };

  const renderYesNo = (value?: YesNoOption | boolean) => {
    let displayValue: React.ReactNode;
    if (typeof value === 'boolean') {
        displayValue = value ? <Check className="h-5 w-5 text-green-600 inline-block ml-1" /> : <X className="h-5 w-5 text-red-600 inline-block ml-1" />;
    } else if (value === '是') {
        displayValue = <Check className="h-5 w-5 text-green-600 inline-block ml-1" />;
    } else if (value === '否') {
        displayValue = <X className="h-5 w-5 text-red-600 inline-block ml-1" />;
    } else {
        displayValue = <span className="text-muted-foreground text-sm ml-1">{value || '未记录'}</span>;
    }
    return displayValue;
  };
  
  const renderGridItem = (label: string, value?: string | React.ReactNode | null, colSpan?: number, customClassName?: string) => {
    let displayValue: React.ReactNode;
    if (Array.isArray(value)) {
      displayValue = renderInfoList(value);
    } else if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
      displayValue = <span className="text-muted-foreground text-xs">未记录</span>;
    } else {
      // If it's a ReactNode (like the output of renderYesNo), render directly. Otherwise, wrap in span.
      displayValue = (React.isValidElement(value) && typeof value.type !== 'string') 
        ? value 
        : <span className="text-sm text-foreground/80">{String(value)}</span>;
    }

    return (
      <div className={cn("py-1 flex flex-wrap items-baseline", colSpan ? `md:col-span-${colSpan}` : "", customClassName || "")}>
        <strong className="text-sm mr-1 shrink-0">{label}:</strong>
        {displayValue}
      </div>
    );
  };
  
  const renderSASQuestion = (label: string, value?: SASOption) => (
     <div className="text-sm py-0.5"><strong>{label}:</strong> <span className="text-foreground/80">{value || <span className="text-muted-foreground text-xs">未记录</span>}</span></div>
  );


  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-12 w-full mb-4" />
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
              <>
                <ArrowLeft className="mr-2 h-4 w-4" /> 返回病人列表
              </>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dp = patient.detailedProfile; 

  const adherenceHealthPromotionDisplay = (
    <>
      {renderInfoList(dp?.adherence_healthPromotionMethods)}
      {dp?.adherence_otherHealthPromotion && (<span className="ml-1 text-xs text-muted-foreground">(其他: {dp.adherence_otherHealthPromotion})</span>)}
    </>
  );

  return (
    <div className="space-y-4 p-1 md:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <Button variant="outline" onClick={() => router.back()} className="self-start sm:self-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回病人列表
        </Button>
        <h1 className="text-xl md:text-2xl font-semibold text-center sm:text-left flex-grow">
          病人档案: {patient.name}
        </h1>
        <Button asChild className="self-start sm:self-center">
          <Link href={`/doctor/patients/${patientId}/edit`}>
            <Edit3 className="mr-2 h-4 w-4" /> 编辑病人信息
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="basicInfo" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-muted/60">
          <TabsTrigger value="basicInfo"><UserCircle className="mr-2 h-4 w-4"/>基本信息</TabsTrigger>
          <TabsTrigger value="medicalHistory"><FileText className="mr-2 h-4 w-4"/>病历摘要</TabsTrigger>
          <TabsTrigger value="healthData"><LineChartIcon className="mr-2 h-4 w-4"/>健康数据</TabsTrigger>
          <TabsTrigger value="examReports"><ClipboardList className="mr-2 h-4 w-4"/>检查报告</TabsTrigger>
        </TabsList>

        <TabsContent value="basicInfo">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                {renderGridItem("姓名", dp?.name || patient.name)}
                {renderGridItem("性别", getGenderText(dp?.gender || patient.gender))}
                {renderGridItem("生日", dp?.dob && isValid(parseISO(dp.dob)) ? format(parseISO(dp.dob), 'yyyy-MM-dd') : (patient.age ? `${patient.age}岁 (约)` : '未知'))}
                {renderGridItem("家庭地址", dp?.address || '未提供', 3)}
                {renderGridItem("手机", dp?.contactPhone || patient.contact || '未提供')}
                {renderGridItem("E-mail", dp?.contactEmail || '未提供', 2)}
                {renderGridItem("血型", getBloodTypeText(dp?.bloodType))}
                {renderGridItem("婚姻", getMaritalStatusText(dp?.maritalStatus))}
                {renderGridItem("职业", dp?.occupation || '未提供')}
                {renderGridItem("文化程度", getEducationLevelText(dp?.educationLevel))}
                <div className="flex items-center md:col-span-3 gap-4">
                  <div><strong>以前在本机构体检过:</strong>{renderYesNo(dp?.hadPreviousCheckup)}</div>
                  <div><strong>同意接受健康干预服务:</strong>{renderYesNo(dp?.agreesToIntervention)}</div>
                </div>
              </div>
              {patient.emergencyContact && (
                <div className="pt-2 border-t mt-3"> 
                  <strong>紧急联系人:</strong> {patient.emergencyContact.name} ({patient.emergencyContact.relationship || "未指定关系"}) - {patient.emergencyContact.phone}
                </div>
              )}
              
              <Separator className="my-3" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Heart className="mr-2 h-4 w-4 text-primary"/>家族病史及患病情况</h3>
                {dp?.familyMedicalHistory && dp.familyMedicalHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="p-1 border text-left">亲属</th>
                          {allFamilyConditions.map(disease => (
                            <th key={disease} className="p-1 border text-center min-w-[50px]">{disease.substring(0,2)}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dp.familyMedicalHistory.map(entry => (
                          <tr key={entry.relative}>
                            <td className="p-1 border font-medium">{relativesMap[entry.relative]}</td>
                            {allFamilyConditions.map(disease => (
                              <td key={`${entry.relative}-${disease}`} className="p-1 border text-center">
                                {entry.conditions && entry.conditions.includes(disease) ? <Check className="h-3 w-3 text-green-600 mx-auto" /> : <span className="text-muted-foreground">-</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p className="text-muted-foreground text-sm">暂无家族病史记录。</p>}
              </div>

              <Separator className="my-3" /> 
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><AlertTriangle className="mr-2 h-4 w-4 text-destructive"/>现有不适症状</h3>
                 {renderGridItem("", renderInfoList(dp?.currentSymptoms, "无不适症状记录"), 3)}
              </div>

              <Separator className="my-3" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><TestTube className="mr-2 h-4 w-4 text-red-500"/>过敏史</h3>
                {renderGridItem("",renderInfoList(dp?.allergies, "无过敏史记录"), 3)}
              </div>

              <Separator className="my-3" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Stethoscope className="mr-2 h-4 w-4 text-blue-500"/>手术史</h3>
                {renderGridItem("",renderInfoList(dp?.operationHistory, "无手术史记录"), 3)}
                {dp?.operationHistory_text && <p className="text-sm text-foreground/80 mt-1">详情: {dp.operationHistory_text}</p>}
              </div>
              
              <Separator className="my-3" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Syringe className="mr-2 h-4 w-4 text-orange-500"/>输血史</h3>
                {renderGridItem("",dp?.bloodTransfusionHistory || "无输血史记录", 3)}
                {dp?.bloodTransfusionHistory_details && <p className="text-sm text-foreground/80 mt-1">详情: {dp.bloodTransfusionHistory_details}</p>}
              </div>

              <Separator className="my-3" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Pill className="mr-2 h-4 w-4 text-purple-500"/>用药史 (类别)</h3>
                 {renderGridItem("",renderInfoList(dp?.medicationCategories, "无用药史记录"), 3)}
                 {dp?.otherInfo_medicationsUsed && <p className="text-sm text-foreground/80 mt-1">具体用药: {dp.otherInfo_medicationsUsed}</p>}
              </div>

              <Separator className="my-3" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Wind className="mr-2 h-4 w-4 text-teal-500"/>接触史</h3>
                 {renderGridItem("",renderInfoList(dp?.contactHistory, "无特殊接触史记录"), 3)}
              </div>
              
              <Separator className="my-3" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Utensils className="mr-2 h-4 w-4 text-green-600"/>饮食习惯</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    {renderGridItem("平均每周吃早餐", dp?.dietaryHabits_breakfastDays)}
                    {renderGridItem("平均每周吃夜宵", dp?.dietaryHabits_lateSnackDays)}
                    {renderGridItem("不良饮食习惯", renderInfoList(dp?.dietaryHabits_badHabits), 2)}
                    {renderGridItem("饮食口味偏好", renderInfoList(dp?.dietaryHabits_preferences), 2)}
                    {renderGridItem("食物类型偏好", renderInfoList(dp?.dietaryHabits_foodTypePreferences), 2)}
                </div>
              </div>
              
              <Separator className="my-3" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Utensils className="mr-2 h-4 w-4 text-lime-600"/>膳食摄入 (个人)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 text-sm">
                    {renderGridItem("米、面、薯类", dp?.dietaryIntake_staple)}
                    {renderGridItem("肉类及肉制品", dp?.dietaryIntake_meat)}
                    {renderGridItem("鱼类及水产品", dp?.dietaryIntake_fish)}
                    {renderGridItem("蛋类及蛋制品", dp?.dietaryIntake_eggs)}
                    {renderGridItem("奶类及奶制品", dp?.dietaryIntake_dairy)}
                    {renderGridItem("大豆及豆制品", dp?.dietaryIntake_soy)}
                    {renderGridItem("新鲜蔬菜", dp?.dietaryIntake_vegetables)}
                    {renderGridItem("新鲜水果", dp?.dietaryIntake_fruits)}
                    {renderGridItem("平均日饮水", dp?.dietaryIntake_water)}
                </div>
              </div>
              
              <Separator className="my-3" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Dumbbell className="mr-2 h-4 w-4 text-indigo-500"/>运动锻炼</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    {renderGridItem("平均每天的工作时间", dp?.exercise_workHours)}
                    {renderGridItem("平均每天坐姿(静止)时间", dp?.exercise_sedentaryHours)}
                    {renderGridItem("平均每周运动锻炼频率", dp?.exercise_weeklyFrequency)}
                    {renderGridItem("平均每次运动锻炼时长", dp?.exercise_durationPerSession)}
                    {renderGridItem("一般锻炼强度", dp?.exercise_intensity)}
                </div>
              </div>
              
              <Separator className="my-3" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Cigarette className="mr-2 h-4 w-4 text-gray-500"/>吸烟情况</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    {renderGridItem("当前吸烟情况", dp?.smoking_status)}
                    {(dp?.smoking_status === "吸烟" || dp?.smoking_status === "戒烟") && (
                      <>
                        {renderGridItem("平均每天吸香烟支数", dp?.smoking_cigarettesPerDay)}
                        {renderGridItem("总共吸烟年数", dp?.smoking_years)}
                      </>
                    )}
                    {renderGridItem("平均每周被动吸烟情况", dp?.smoking_passiveDays)}
                </div>
              </div>
              
              <Separator className="my-3" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Wine className="mr-2 h-4 w-4 text-red-700"/>饮酒情况</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    {renderGridItem("当前饮酒情况", dp?.drinking_status)}
                    {(dp?.drinking_status === "饮酒" || dp?.drinking_status === "戒酒") && (
                      <>
                        {renderGridItem("最常饮酒类型", dp?.drinking_type)}
                        {renderGridItem("平均每天饮酒量", dp?.drinking_amountPerDay)}
                        {renderGridItem("总共饮酒年数", dp?.drinking_years)}
                      </>
                    )}
                </div>
                 {(dp?.drinking_status === "饮酒" || dp?.drinking_status === "戒酒") && (
                  <p className="text-xs text-muted-foreground md:col-span-2 mt-1">
                      说明: 1瓶啤酒（约600ml）=1杯红酒（约3两）=1两低度白酒或0.5两高度白酒。
                  </p>
                )}
              </div>

              <Separator className="my-3" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Brain className="mr-2 h-4 w-4 text-purple-500"/>心理健康</h3>
                <div className="space-y-2 text-sm">
                    {renderGridItem("正受一些重大意外困扰", renderYesNo(dp?.mentalHealth_majorEvents))}
                    {renderGridItem("情绪对工作或生活的影响", dp?.mentalHealth_impactOnLife)}
                    {renderGridItem("感觉到自己的精神压力", dp?.mentalHealth_stressLevel)}
                    <p className="text-xs text-muted-foreground pt-1">最近一周焦虑自评 (SAS):</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5 pl-2 text-xs">
                        {renderSASQuestion("容易紧张和着急(焦虑)", dp?.mentalHealth_sas_anxiety)}
                        {renderSASQuestion("无故感到害怕(害怕)", dp?.mentalHealth_sas_fear)}
                        {renderSASQuestion("容易心里烦乱或惊恐(惊恐)", dp?.mentalHealth_sas_panic)}
                        {renderSASQuestion("可能将要发疯(发疯感)", dp?.mentalHealth_sas_goingCrazy)}
                        {renderSASQuestion("一切都很好，不会不幸(不幸预感)", dp?.mentalHealth_sas_misfortune)}
                        {renderSASQuestion("手脚发抖打颤(手足颇抖)", dp?.mentalHealth_sas_trembling)}
                        {renderSASQuestion("头痛颈痛背痛困扰(躯体疼痛)", dp?.mentalHealth_sas_bodyPain)}
                        {renderSASQuestion("易衰弱和疲乏(乏力)", dp?.mentalHealth_sas_fatigue)}
                        {renderSASQuestion("心平气和，易安静坐着(静坐不能)", dp?.mentalHealth_sas_restlessness)}
                        {renderSASQuestion("心跳很快(心悸)", dp?.mentalHealth_sas_palpitations)}
                        {renderSASQuestion("一阵阵头晕困扰(头昏)", dp?.mentalHealth_sas_dizziness)}
                        {renderSASQuestion("晕倒发作或觉得要晕倒(晕厥感)", dp?.mentalHealth_sas_fainting)}
                        {renderSASQuestion("呼气吸气很容易(呼吸困难)", dp?.mentalHealth_sas_breathingDifficulty)}
                        {renderSASQuestion("手脚麻木和刺痛(手足刺痛)", dp?.mentalHealth_sas_paresthesia)}
                        {renderSASQuestion("胃痛和消化不良困扰(胃痛)", dp?.mentalHealth_sas_stomachPain)}
                        {renderSASQuestion("常常要小便(尿意频数)", dp?.mentalHealth_sas_frequentUrination)}
                        {renderSASQuestion("手常常干燥温暖(多汗)", dp?.mentalHealth_sas_sweating)}
                    </div>
                </div>
              </div>

              <Separator className="my-3" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><CheckSquare className="mr-2 h-4 w-4 text-blue-600"/>遵医行为</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>自我健康评价:</strong></p>
                  <ul className="list-disc list-inside ml-4 text-xs">
                    <li>身体感觉: {dp?.adherence_selfAssessmentBody || "未记录"}</li>
                    <li>心理态度: {dp?.adherence_selfAssessmentMind || "未记录"}</li>
                  </ul>
                  <div><strong>最希望解决的问题:</strong> {renderInfoList(dp?.adherence_priorityProblems)}</div>
                  {renderGridItem("医嘱依从度", dp?.adherence_doctorAdviceCompliance)}
                  <div>
                    <strong>希望促进健康方式:</strong>
                    {adherenceHealthPromotionDisplay}
                  </div>
                </div>
              </div>

              <Separator className="my-3" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Bed className="mr-2 h-4 w-4 text-indigo-600"/>睡眠</h3>
                {renderGridItem("睡眠充足情况", dp?.sleep_adequacy)}
              </div>

              <Separator className="my-3" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Info className="mr-2 h-4 w-4 text-gray-600"/>其他</h3>
                <div className="space-y-1 text-sm">
                  {dp?.otherInfo_medicationsUsed && <p><strong>当前使用药物:</strong> {dp.otherInfo_medicationsUsed}</p>}
                  <p className="font-medium">希望联系方式:</p>
                  <ul className="list-disc list-inside ml-4 text-xs">
                    <li>方式: {dp?.otherInfo_contactPreference_method === '其他' ? dp.otherInfo_contactPreference_method_other : dp?.otherInfo_contactPreference_method || "未记录"}</li>
                    <li>频率: {dp?.otherInfo_contactPreference_frequency === '其他' ? dp.otherInfo_contactPreference_frequency_other : dp?.otherInfo_contactPreference_frequency || "未记录"}</li>
                    <li>时间: {dp?.otherInfo_contactPreference_time === '其他' ? dp.otherInfo_contactPreference_time_other : dp?.otherInfo_contactPreference_time || "未记录"}</li>
                  </ul>
                  {dp?.otherInfo_suggestions && <p><strong>对中心建议:</strong> {dp.otherInfo_suggestions}</p>}
                  {renderGridItem("服务满意度", dp?.otherInfo_serviceSatisfaction)}
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground pt-4">
                更详细的信息或修改请点击右上角 "编辑病人信息" 按钮。
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicalHistory">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-xl">病历摘要</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><strong>主要诊断:</strong> {patient.diagnosis}</p>
              {dp?.chiefComplaint && <p><strong>主诉:</strong> {dp.chiefComplaint}</p>}
              {dp?.historyOfPresentIllness && <p><strong>现病史:</strong> {dp.historyOfPresentIllness}</p>}
              
              <Separator />
              <h4 className="font-semibold pt-2">既往史 (文本):</h4>
              {dp?.pastMedicalHistoryDetails && <p>{dp.pastMedicalHistoryDetails}</p>}
              {dp?.operationHistory_text && <p><strong>手术史(文本):</strong> {dp.operationHistory_text}</p>}
              {dp?.bloodTransfusionHistory_details && <p><strong>输血史(文本):</strong> {dp.bloodTransfusionHistory_details}</p>}
              
              {dp?.medicationHistory && dp.medicationHistory.length > 0 && (
                <div>
                  <strong>主要用药史(详细):</strong>
                  <ul className="list-disc list-inside ml-4">
                    {dp.medicationHistory.map(med => (
                      <li key={med.id}>{med.drugName} ({med.dosage}, {med.frequency}) {med.notes && `- ${med.notes}`}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Separator />
              <h4 className="font-semibold pt-2">个人史与生活习惯 (旧版文本录入):</h4>
              {dp?.personalHistory_smokingHistory && <p><strong>吸烟史(旧):</strong> {dp.personalHistory_smokingHistory}</p>}
              {dp?.personalHistory_drinkingHistory && <p><strong>饮酒史(旧):</strong> {dp.personalHistory_drinkingHistory}</p>}
              
              <Separator />
              <h4 className="font-semibold pt-2">其他信息:</h4>
              {dp?.otherMedicalInfo && <p><strong>其他医疗信息:</strong> {dp.otherMedicalInfo}</p>}
              {dp?.healthGoals && dp.healthGoals.length > 0 && (
                <p><strong>健康目标:</strong> {dp.healthGoals.join(', ')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="healthData">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-xl">健康数据</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{patient.healthDataSummary || "暂无健康数据摘要。"}</p>
              <Button asChild variant="link" className="mt-2 p-0 h-auto">
                 <Link href={`/doctor/analytics/detail/${patient.id}`}>查看详细数据分析 &rarr;</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examReports">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-xl">检查报告</CardTitle>
            </CardHeader>
            <CardContent>
              {patient.reports && patient.reports.length > 0 ? (
                <ul className="space-y-2">
                  {patient.reports.map(report => (
                    <li key={report.id} className="text-sm p-2 border rounded-md hover:bg-muted/50 flex justify-between items-center">
                      <span>{report.name} ({report.uploadDate})</span>
                      <Button variant="ghost" size="sm" onClick={() => toast({title: "提示", description: `查看报告 ${report.name} (功能待实现)`})}>查看</Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>暂无检查报告。</p>
              )}
              <p className="text-xs text-muted-foreground pt-4">检查报告上传和管理功能正在建设中。</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
    

