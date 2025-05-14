
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, UserCircle, FileText, LineChart as LineChartIcon, ClipboardList, Edit3, Check, X, Heart, AlertTriangle, TestTube, Stethoscope, Syringe, Wind, Utensils, Pill, Dumbbell, Cigarette, Wine } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { DoctorPatient, DetailedPatientProfile, Gender, MaritalStatus, BloodType, FamilyMedicalHistoryEntry, YesNoOption, FrequencyOption, DietaryIntakeOption, ExerciseIntensityOption, SmokingStatusOption, DrinkingStatusOption, AlcoholTypeOption, SASOption, AdherenceBodyOption, AdherenceMindOption, AdherenceComplianceOption, SleepAdequacyOption, ContactPreferenceMethod, ContactPreferenceFrequency, ContactPreferenceTime, ServiceSatisfactionOption } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { format, parseISO, isValid } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
        otherMedicalInfo: "长期服用降压药。",
        healthGoals: ["控制血糖, 防止并发症"],
        operationHistory_text: "2010年阑尾炎切除术", 
        bloodTransfusionHistory_details: "无",
        contactHistory_oy: "是", 
        mentalHealth_majorEvents: "否",
        mentalHealth_impactOnLife: "有一点",
        mentalHealth_stressLevel: "较明显",
        adherence_selfAssessmentBody: "满意",
        adherence_selfAssessmentMind: "还算关心",
        adherence_priorityProblems: ["控制血糖", "减轻头晕"],
        adherence_doctorAdviceCompliance: "执行一部分",
        adherence_healthPromotionMethods: ["改变饮食习惯", "药物"],
        sleep_adequacy: "一般",
        otherInfo_medicationsUsed: "拜阿司匹林 100mg qd",
        otherInfo_contactPreference_method: "微信",
        otherInfo_contactPreference_frequency: "每周一次",
        otherInfo_contactPreference_time: "下午",
        otherInfo_suggestions: "希望App能提供更详细的食谱推荐。",
        otherInfo_serviceSatisfaction: "较好",
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
    setTimeout(() => {
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
      return <p className="text-muted-foreground text-sm">{emptyText}</p>;
    }
    return (
      <div className="flex flex-wrap gap-1">
        {items.map(item => <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>)}
      </div>
    );
  };

  const renderYesNo = (value?: YesNoOption | boolean) => {
    if (typeof value === 'boolean') {
        return value ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-red-600" />;
    }
    if (value === '是') return <Check className="h-5 w-5 text-green-600" />;
    if (value === '否') return <X className="h-5 w-5 text-red-600" />;
    return <span className="text-muted-foreground text-sm">{value || '未记录'}</span>;
  };

  const renderGridItem = (label: string, value?: string | null, colSpan?: number) => (
    <div className={colSpan ? `md:col-span-${colSpan}` : ""}>
      <strong>{label}:</strong> {value || <span className="text-muted-foreground text-xs">未记录</span>}
    </div>
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
          <TabsTrigger value="medicalRecords"><FileText className="mr-2 h-4 w-4"/>病历信息</TabsTrigger>
          <TabsTrigger value="healthData"><LineChartIcon className="mr-2 h-4 w-4"/>健康数据</TabsTrigger>
          <TabsTrigger value="examReports"><ClipboardList className="mr-2 h-4 w-4"/>检查报告</TabsTrigger>
        </TabsList>

        <TabsContent value="basicInfo">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-xl">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                <div><strong>姓名:</strong> {patient.detailedProfile?.name || patient.name}</div>
                <div><strong>性别:</strong> {getGenderText(patient.detailedProfile?.gender || patient.gender)}</div>
                <div>
                  <strong>生日:</strong> {patient.detailedProfile?.dob && isValid(parseISO(patient.detailedProfile.dob)) ? format(parseISO(patient.detailedProfile.dob), 'yyyy-MM-dd') : (patient.age ? `${patient.age}岁 (推算)` : '未知')}
                </div>
                
                <div className="md:col-span-3"><strong>家庭地址:</strong> {patient.detailedProfile?.address || '未提供'}</div>

                <div className="flex items-center">
                  <strong className="mr-1">以前在本机构体检过:</strong> 
                  {renderYesNo(patient.detailedProfile?.hadPreviousCheckup)}
                </div>
                <div className="flex items-center md:col-span-2">
                  <strong className="mr-1">同意接受健康干预服务:</strong> 
                  {renderYesNo(patient.detailedProfile?.agreesToIntervention)}
                </div>

                <div><strong>手机:</strong> {patient.detailedProfile?.contactPhone || patient.contact || '未提供'}</div>
                <div className="md:col-span-2"><strong>E-mail:</strong> {patient.detailedProfile?.contactEmail || '未提供'}</div>
                
                <div><strong>血型:</strong> {getBloodTypeText(patient.detailedProfile?.bloodType)}</div>
                <div><strong>婚姻:</strong> {getMaritalStatusText(patient.detailedProfile?.maritalStatus)}</div>
                
                <div><strong>职业:</strong> {patient.detailedProfile?.occupation || '未提供'}</div>
                <div className="md:col-span-2"><strong>文化程度:</strong> {getEducationLevelText(patient.detailedProfile?.educationLevel)}</div>
              </div>
              
              {patient.emergencyContact && (
                <p className="pt-2 border-t mt-3">
                  <strong>紧急联系人:</strong> {patient.emergencyContact.name} ({patient.emergencyContact.relationship || "未指定关系"}) - {patient.emergencyContact.phone}
                </p>
              )}
              
              <Separator className="my-4" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Heart className="mr-2 h-4 w-4 text-primary"/>家族病史及患病情况</h3>
                {patient.detailedProfile?.familyMedicalHistory && patient.detailedProfile.familyMedicalHistory.length > 0 ? (
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
                        {patient.detailedProfile.familyMedicalHistory.map(entry => (
                          <tr key={entry.relative}>
                            <td className="p-1 border font-medium">{relativesMap[entry.relative]}</td>
                            {allFamilyConditions.map(disease => (
                              <td key={`${entry.relative}-${disease}`} className="p-1 border text-center">
                                {entry.conditions.includes(disease) ? <Check className="h-3 w-3 text-green-600 mx-auto" /> : <span className="text-muted-foreground">-</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p className="text-muted-foreground">暂无家族病史记录。</p>}
              </div>

              <Separator className="my-4" /> 
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><AlertTriangle className="mr-2 h-4 w-4 text-destructive"/>现有不适症状</h3>
                {renderInfoList(patient.detailedProfile?.currentSymptoms, "无不适症状记录")}
              </div>

              <Separator className="my-4" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><TestTube className="mr-2 h-4 w-4 text-red-500"/>过敏史</h3>
                {renderInfoList(patient.detailedProfile?.allergies, "无过敏史记录")}
              </div>

              <Separator className="my-4" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Stethoscope className="mr-2 h-4 w-4 text-blue-500"/>手术史</h3>
                {renderInfoList(patient.detailedProfile?.operationHistory, "无手术史记录")}
              </div>
              
              <Separator className="my-4" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Syringe className="mr-2 h-4 w-4 text-orange-500"/>输血史</h3>
                <p className="text-muted-foreground text-sm">{patient.detailedProfile?.bloodTransfusionHistory || "无输血史记录"}</p>
              </div>

              <Separator className="my-4" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Pill className="mr-2 h-4 w-4 text-purple-500"/>用药史 (类别)</h3>
                {renderInfoList(patient.detailedProfile?.medicationCategories, "无用药史记录")}
              </div>

              <Separator className="my-4" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Wind className="mr-2 h-4 w-4 text-teal-500"/>接触史</h3>
                {renderInfoList(patient.detailedProfile?.contactHistory, "无特殊接触史记录")}
              </div>
              
              <Separator className="my-4" />
              <div>
                  <h3 className="text-md font-semibold mb-2 flex items-center"><Utensils className="mr-2 h-4 w-4 text-green-600"/>饮食习惯</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                      {renderGridItem("平均每周吃早餐", patient.detailedProfile?.dietaryHabits_breakfastDays)}
                      {renderGridItem("平均每周吃夜宵", patient.detailedProfile?.dietaryHabits_lateSnackDays)}
                      <div className="md:col-span-2"><strong>不良饮食习惯:</strong> {renderInfoList(patient.detailedProfile?.dietaryHabits_badHabits)}</div>
                      <div className="md:col-span-2"><strong>饮食口味偏好:</strong> {renderInfoList(patient.detailedProfile?.dietaryHabits_preferences)}</div>
                      <div className="md:col-span-2"><strong>食物类型偏好:</strong> {renderInfoList(patient.detailedProfile?.dietaryHabits_foodTypePreferences)}</div>
                  </div>
              </div>
              
              <Separator className="my-4" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Utensils className="mr-2 h-4 w-4 text-lime-600"/>膳食摄入 (个人)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1">
                    {renderGridItem("米、面、薯类日均摄入量", patient.detailedProfile?.dietaryIntake_staple)}
                    {renderGridItem("肉类及肉制品日均摄入量", patient.detailedProfile?.dietaryIntake_meat)}
                    {renderGridItem("鱼类及水产品日均摄入量", patient.detailedProfile?.dietaryIntake_fish)}
                    {renderGridItem("蛋类及蛋制品日均摄入量", patient.detailedProfile?.dietaryIntake_eggs)}
                    {renderGridItem("奶类及奶制品日均摄入量", patient.detailedProfile?.dietaryIntake_dairy)}
                    {renderGridItem("大豆及豆制品日均摄入量", patient.detailedProfile?.dietaryIntake_soy)}
                    {renderGridItem("新鲜蔬菜日均摄入量", patient.detailedProfile?.dietaryIntake_vegetables)}
                    {renderGridItem("新鲜水果日均摄入量", patient.detailedProfile?.dietaryIntake_fruits)}
                    {renderGridItem("平均日饮水摄入量", patient.detailedProfile?.dietaryIntake_water)}
                </div>
              </div>

              <Separator className="my-4" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Dumbbell className="mr-2 h-4 w-4 text-indigo-500"/>运动锻炼</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                    {renderGridItem("平均每天的工作时间", patient.detailedProfile?.exercise_workHours)}
                    {renderGridItem("平均每天坐姿(静止)时间", patient.detailedProfile?.exercise_sedentaryHours)}
                    {renderGridItem("平均每周运动锻炼时间", patient.detailedProfile?.exercise_weeklyFrequency)}
                    {renderGridItem("平均每次运动锻炼时间", patient.detailedProfile?.exercise_durationPerSession)}
                    {renderGridItem("一般锻炼的强度", patient.detailedProfile?.exercise_intensity)}
                </div>
              </div>
              
              <Separator className="my-4" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Cigarette className="mr-2 h-4 w-4 text-gray-500"/>吸烟情况</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                    {renderGridItem("当前吸烟情况", patient.detailedProfile?.smoking_status)}
                    {(patient.detailedProfile?.smoking_status === "吸烟" || patient.detailedProfile?.smoking_status === "戒烟") && (
                      <>
                        {renderGridItem("平均每天吸香烟支数", patient.detailedProfile?.smoking_cigarettesPerDay)}
                        {renderGridItem("总共吸烟年数", patient.detailedProfile?.smoking_years)}
                      </>
                    )}
                    {renderGridItem("平均每周被动吸烟情况", patient.detailedProfile?.smoking_passiveDays)}
                </div>
              </div>
              
              <Separator className="my-4" />
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center"><Wine className="mr-2 h-4 w-4 text-red-700"/>饮酒情况</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                    {renderGridItem("当前饮酒情况", patient.detailedProfile?.drinking_status)}
                    {(patient.detailedProfile?.drinking_status === "饮酒" || patient.detailedProfile?.drinking_status === "戒酒") && (
                      <>
                        {renderGridItem("最常饮酒类型", patient.detailedProfile?.drinking_type)}
                        {renderGridItem("平均每天饮酒量", patient.detailedProfile?.drinking_amountPerDay)}
                        {renderGridItem("总共饮酒年数", patient.detailedProfile?.drinking_years)}
                        <p className="text-xs text-muted-foreground md:col-span-2 mt-1">
                            说明: 1瓶啤酒（约600ml）=1杯红酒（约3两）=1两低度白酒或0.5两高度白酒。
                        </p>
                      </>
                    )}
                </div>
              </div>


              <p className="text-xs text-muted-foreground pt-4">
                更详细的信息或修改请点击右上角 "编辑病人信息" 按钮。
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicalRecords">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-xl">病历信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><strong>主要诊断:</strong> {patient.diagnosis}</p>
              {patient.detailedProfile?.chiefComplaint && <p><strong>主诉:</strong> {patient.detailedProfile.chiefComplaint}</p>}
              {patient.detailedProfile?.historyOfPresentIllness && <p><strong>现病史:</strong> {patient.detailedProfile.historyOfPresentIllness}</p>}
              
              <Separator />
              <h4 className="font-semibold pt-2">既往史:</h4>
              {patient.detailedProfile?.pastMedicalHistoryDetails && <p>{patient.detailedProfile.pastMedicalHistoryDetails}</p>}
              {patient.detailedProfile?.operationHistory_text && <p><strong>手术史(文本):</strong> {patient.detailedProfile.operationHistory_text}</p>}
              {patient.detailedProfile?.bloodTransfusionHistory_details && <p><strong>输血史(文本):</strong> {patient.detailedProfile.bloodTransfusionHistory_details}</p>}
              
              {patient.detailedProfile?.medicationHistory && patient.detailedProfile.medicationHistory.length > 0 && (
                <div>
                  <strong>主要用药史(详细):</strong>
                  <ul className="list-disc list-inside ml-4">
                    {patient.detailedProfile.medicationHistory.map(med => (
                      <li key={med.id}>{med.drugName} ({med.dosage}, {med.frequency}) {med.notes && `- ${med.notes}`}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Separator />
              <h4 className="font-semibold pt-2">个人史与生活习惯 (旧版文本录入，新版数据在“基本信息”):</h4>
              {patient.detailedProfile?.contactHistory_oy && <p><strong>油烟接触(旧):</strong> {patient.detailedProfile.contactHistory_oy}</p>}
              {patient.detailedProfile?.personalHistory_smokingHistory && <p><strong>吸烟史(旧):</strong> {patient.detailedProfile.personalHistory_smokingHistory}</p>}
              {patient.detailedProfile?.personalHistory_drinkingHistory && <p><strong>饮酒史(旧):</strong> {patient.detailedProfile.personalHistory_drinkingHistory}</p>}
              
              <Separator />
              <h4 className="font-semibold pt-2">其他信息:</h4>
              {patient.detailedProfile?.otherMedicalInfo && <p><strong>其他医疗信息:</strong> {patient.detailedProfile.otherMedicalInfo}</p>}
              {patient.detailedProfile?.healthGoals && patient.detailedProfile.healthGoals.length > 0 && (
                <p><strong>健康目标:</strong> {patient.detailedProfile.healthGoals.join(', ')}</p>
              )}
               {patient.detailedProfile?.sleep_adequacy && <p><strong>睡眠情况:</strong> {patient.detailedProfile.sleep_adequacy}</p>}
              {patient.detailedProfile?.otherInfo_suggestions && <p><strong>对中心建议:</strong> {patient.detailedProfile.otherInfo_suggestions}</p>}


              <p className="text-xs text-muted-foreground pt-4">详细病历信息请点击 "编辑病人信息" 查看或修改。</p>
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

