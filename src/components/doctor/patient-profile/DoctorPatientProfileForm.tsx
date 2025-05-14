
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { DoctorPatient, DetailedPatientProfile, Gender, MaritalStatus, BloodType, FamilyMedicalHistoryEntry, MedicationEntry, YesNoOption, FrequencyOption, ExerciseIntensityOption, SmokingStatusOption, DrinkingStatusOption, AlcoholTypeOption, SASOption, AdherenceBodyOption, AdherenceMindOption, AdherenceComplianceOption, SleepAdequacyOption, ContactPreferenceMethod, ContactPreferenceFrequency, ContactPreferenceTime, ServiceSatisfactionOption, DietaryIntakeOption } from "@/lib/types";
import { useEffect, useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2, Activity, Stethoscope, Info, Heart, AlertTriangle, TestTube, Syringe, Wind, Utensils, Dumbbell, Cigarette, Wine, Brain, CheckSquare, Bed, Pill } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const pastIllnessOptions = [
  { id: 'hypertension', label: '高血压' },
  { id: 'diabetes', label: '糖尿病' },
  { id: 'heart_disease', label: '心脏病' },
  { id: 'stroke', label: '脑卒中' },
  { id: 'copd', label: '慢阻肺' },
  { id: 'asthma', label: '哮喘' },
  { id: 'cancer', label: '恶性肿瘤' },
  { id: 'hepatitis', label: '肝炎' },
  { id: 'tuberculosis', label: '结核病' },
];

const familyMedicalHistoryEntrySchema = z.object({
  relative: z.enum(["self", "father", "mother", "paternal_grandparents", "maternal_grandparents"]),
  conditions: z.array(z.string()),
});

const medicationEntrySchema = z.object({
  id: z.string(),
  drugName: z.string().min(1, "药物名称不能为空。"),
  dosage: z.string().min(1, "剂量不能为空。"),
  frequency: z.string().min(1, "使用频次不能为空。"),
  notes: z.string().optional(),
});


const patientProfileSchema = z.object({
  recordNumber: z.string().optional(),
  name: z.string().min(1, "姓名不能为空"),
  gender: z.enum(['male', 'female', 'other'] as [Gender, ...Gender[]]).optional(),
  dob: z.string().optional().refine(val => !val || isValid(parseISO(val)), { message: "出生日期格式无效" }),
  age: z.coerce.number().positive("年龄必须为正数").optional(),
  maritalStatus: z.enum(['unmarried', 'married', 'divorced', 'widowed', 'other'] as [MaritalStatus, ...MaritalStatus[]]).optional(),
  occupation: z.string().optional(),
  nationality: z.string().optional(),
  birthplace: z.string().optional(),
  address: z.string().optional(),
  contactPhone: z.string().regex(/^1[3-9]\d{9}$/, "请输入有效的中国大陆手机号码.").or(z.literal("")).optional(),
  contactEmail: z.string().email("请输入有效的邮箱地址.").or(z.literal("")).optional(),
  bloodType: z.enum(['A', 'B', 'O', 'AB', 'unknown'] as [BloodType, ...BloodType[]]).optional(),
  educationLevel: z.string().optional(),
  hadPreviousCheckup: z.boolean().default(false).optional(),
  agreesToIntervention: z.boolean().default(false).optional(),

  admissionDate: z.string().optional().refine(val => !val || isValid(parseISO(val)), { message: "入院日期格式无效" }),
  recordDate: z.string().optional().refine(val => !val || isValid(parseISO(val)), { message: "记录日期格式无效" }),
  informant: z.string().optional(),
  reliability: z.enum(['reliable', 'unreliable', 'partially_reliable']).optional(),
  chiefComplaint: z.string().optional(),
  historyOfPresentIllness: z.string().optional(),

  pastMedicalHistoryDetails: z.string().optional(),
  pastIllnesses: z.array(z.string()).optional(),
  infectiousDiseases: z.array(z.string()).optional(),
  vaccinationHistory: z.string().optional(),

  traumaHistory: z.string().optional(),

  personalHistory_birthPlaceAndResidence: z.string().optional(),
  personalHistory_livingConditions: z.string().optional(),
  personalHistory_smokingHistory: z.string().optional(),
  personalHistory_drinkingHistory: z.string().optional(),
  personalHistory_drugAbuseHistory: z.string().optional(),
  personalHistory_menstrualAndObstetric: z.string().optional(),

  familyMedicalHistory: z.array(familyMedicalHistoryEntrySchema).optional(),

  physicalExam_temperature: z.string().optional(),
  physicalExam_pulseRate: z.string().optional(),
  physicalExam_respiratoryRate: z.string().optional(),
  physicalExam_bloodPressure: z.string().optional(),
  physicalExam_height: z.string().optional(),
  physicalExam_weight: z.string().optional(),
  physicalExam_generalAppearance: z.string().optional(),
  physicalExam_skinAndMucosa: z.string().optional(),

  labAuxiliaryExams: z.string().optional(),
  initialDiagnosis: z.string().optional(),
  treatmentPlanOpinion: z.string().optional(),

  attendingPhysician: z.string().optional(),
  chiefPhysician: z.string().optional(),
  recordingPhysician: z.string().optional(),

  currentSymptoms: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  operationHistory: z.array(z.string()).optional(),
  bloodTransfusionHistory: z.string().optional(),
  medicationCategories: z.array(z.string()).optional(),
  contactHistory: z.array(z.string()).optional(),
  medicationHistory: z.array(medicationEntrySchema).optional(),
  otherMedicalInfo: z.string().optional(),
  healthGoals: z.array(z.string()).optional(),

  contactHistory_oy: z.string().optional() as z.ZodType<YesNoOption | undefined>,
  contactHistory_dust: z.string().optional() as z.ZodType<YesNoOption | undefined>,
  contactHistory_toxic: z.string().optional() as z.ZodType<YesNoOption | undefined>,
  contactHistory_highTemp: z.string().optional() as z.ZodType<YesNoOption | undefined>,
  contactHistory_lowTemp: z.string().optional() as z.ZodType<YesNoOption | undefined>,
  contactHistory_noise: z.string().optional() as z.ZodType<YesNoOption | undefined>,
  contactHistory_radiation: z.string().optional() as z.ZodType<YesNoOption | undefined>,

  dietaryHabits_breakfastDays: z.string().optional() as z.ZodType<FrequencyOption | undefined>,
  dietaryHabits_lateSnackDays: z.string().optional() as z.ZodType<FrequencyOption | undefined>,
  dietaryHabits_badHabits: z.array(z.string()).optional(),
  dietaryHabits_preferences: z.array(z.string()).optional(),
  dietaryHabits_foodTypePreferences: z.array(z.string()).optional(),

  dietaryIntake_staple: z.string().optional() as z.ZodType<DietaryIntakeOption | undefined>,
  dietaryIntake_meat: z.string().optional() as z.ZodType<DietaryIntakeOption | undefined>,
  dietaryIntake_fish: z.string().optional() as z.ZodType<DietaryIntakeOption | undefined>,
  dietaryIntake_eggs: z.string().optional() as z.ZodType<DietaryIntakeOption | undefined>,
  dietaryIntake_dairy: z.string().optional() as z.ZodType<DietaryIntakeOption | undefined>,
  dietaryIntake_soy: z.string().optional() as z.ZodType<DietaryIntakeOption | undefined>,
  dietaryIntake_vegetables: z.string().optional() as z.ZodType<DietaryIntakeOption | undefined>,
  dietaryIntake_fruits: z.string().optional() as z.ZodType<DietaryIntakeOption | undefined>,
  dietaryIntake_water: z.string().optional() as z.ZodType<DietaryIntakeOption | undefined>,

  exercise_workHours: z.string().optional() as z.ZodType<FrequencyOption | undefined>,
  exercise_sedentaryHours: z.string().optional() as z.ZodType<FrequencyOption | undefined>,
  exercise_weeklyFrequency: z.string().optional() as z.ZodType<FrequencyOption | undefined>,
  exercise_durationPerSession: z.string().optional() as z.ZodType<FrequencyOption | undefined>,
  exercise_intensity: z.string().optional() as z.ZodType<ExerciseIntensityOption | undefined>,

  smoking_status: z.string().optional() as z.ZodType<SmokingStatusOption | undefined>,
  smoking_cigarettesPerDay: z.string().optional(),
  smoking_years: z.string().optional(),
  smoking_passiveDays: z.string().optional() as z.ZodType<FrequencyOption | undefined>,

  drinking_status: z.string().optional() as z.ZodType<DrinkingStatusOption | undefined>,
  drinking_type: z.string().optional() as z.ZodType<AlcoholTypeOption | undefined>,
  drinking_amountPerDay: z.string().optional(),
  drinking_years: z.string().optional(),

  mentalHealth_majorEvents: z.string().optional() as z.ZodType<YesNoOption | undefined>,
  mentalHealth_impactOnLife: z.enum(['几乎没有', '有一点', '较明显', '很大']).optional(),
  mentalHealth_stressLevel: z.enum(['几乎没有', '有一点', '较明显', '很大']).optional(),
  mentalHealth_sas_anxiety: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_fear: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_panic: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_goingCrazy: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_misfortune: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_trembling: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_bodyPain: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_fatigue: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_restlessness: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_palpitations: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_dizziness: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_fainting: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_breathingDifficulty: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_paresthesia: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_stomachPain: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_frequentUrination: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_sweating: z.string().optional() as z.ZodType<SASOption | undefined>,

  adherence_selfAssessmentBody: z.string().optional() as z.ZodType<AdherenceBodyOption | undefined>,
  adherence_selfAssessmentMind: z.string().optional() as z.ZodType<AdherenceMindOption | undefined>,
  adherence_priorityProblems: z.array(z.string()).optional(),
  adherence_doctorAdviceCompliance: z.string().optional() as z.ZodType<AdherenceComplianceOption | undefined>,
  adherence_healthPromotionMethods: z.array(z.string()).optional(),
  adherence_otherHealthPromotion: z.string().optional(),

  sleep_adequacy: z.string().optional() as z.ZodType<SleepAdequacyOption | undefined>,

  otherInfo_medicationsUsed: z.string().optional(),
  otherInfo_contactPreference_method: z.string().optional() as z.ZodType<ContactPreferenceMethod | string | undefined>,
  otherInfo_contactPreference_method_other: z.string().optional(),
  otherInfo_contactPreference_frequency: z.string().optional() as z.ZodType<ContactPreferenceFrequency | string | undefined>,
  otherInfo_contactPreference_frequency_other: z.string().optional(),
  otherInfo_contactPreference_time: z.string().optional() as z.ZodType<ContactPreferenceTime | string | undefined>,
  otherInfo_contactPreference_time_other: z.string().optional(),
  otherInfo_suggestions: z.string().optional(),
  otherInfo_serviceSatisfaction: z.string().optional() as z.ZodType<ServiceSatisfactionOption | undefined>,
});

type PatientProfileFormValues = z.infer<typeof patientProfileSchema>;

interface DoctorPatientProfileFormProps {
  patient: DoctorPatient;
  onSave: (data: DetailedPatientProfile) => void;
}

const allFamilyConditions = ["高血压", "糖尿病", "冠心病", "高血脂", "肥胖", "脑卒中", "骨质疏松", "老年痴呆", "肺癌", "肝癌", "胃肠癌", "前列腺癌", "乳腺癌", "宫颈癌"];
const relativesMap: Record<FamilyMedicalHistoryEntry["relative"], string> = {
  self: "本人",
  father: "父亲",
  mother: "母亲",
  paternal_grandparents: "祖父母",
  maternal_grandparents: "外祖父母",
};
const defaultFamilyHistory: FamilyMedicalHistoryEntry[] = [
  { relative: "self", conditions: [] },
  { relative: "father", conditions: [] },
  { relative: "mother", conditions: [] },
  { relative: "paternal_grandparents", conditions: [] },
  { relative: "maternal_grandparents", conditions: [] },
];

const currentSymptomsOptions = ["心情烦躁", "情绪低落", "体重下降", "严重失眠", "健忘", "经常头痛", "头晕", "皮肤瘙痒", "视力下降", "耳鸣", "经常鼻出血", "鼻涕带血", "声音嘶哑", "气喘", "经常干咳", "咳痰带血", "心慌", "胸闷", "胸痛", "吞咽不适或梗塞感", "食欲减退", "反酸", "嗳气", "腹胀", "腹痛", "腹部包块", "便秘", "腹泻", "便血", "大便变细", "尿频", "血尿", "肢体麻痛", "无力", "腰背痛", "女性血性白带", "接触性出血"];
const allergyOptions = ["青霉素", "头孢类", "海鲜", "牛奶", "花粉或尘螨", "洗洁剂", "化妆品", "磺胺类", "链黄素", "鸡蛋", "粉尘"];
const operationOptions = ["头颅（含脑）", "眼耳鼻咽喉", "颌面部及口腔", "颈部或甲状腺胸部（含肺部）", "心脏（含心脏介入）", "外周血管", "胃肠", "肝胆", "肾脏", "脊柱", "四肢及关节", "膀胱", "妇科", "乳腺", "前列腺"];
const medicationCategoryOptions = ["降压药", "降糖药", "降脂药", "降尿酸药", "抗心律失常药", "缓解哮喘药物", "强的松类药物", "解热镇痛药（如布洛芬等）", "雌激素类药物", "利尿剂", "镇静剂或安眠药", "中草药", "避孕药", "抗抑郁药物"];
const contactHistoryOptions = ["油烟", "粉烟尘", "毒、致癌物", "高温", "低温", "噪音", "辐射"];
const yesNoUnknownOptions: YesNoOption[] = ["是", "否", "不详"];

const frequencyOptions: FrequencyOption[] = ['没有', '1-2天', '3-4天', '5-6天', '7天'];
const breakfastLateSnackFrequencyOptions: FrequencyOption[] = ['没有', '1-2天', '3-4天', '5-6天', '7天'];
const dietaryHabitsBadHabitsOptions = ["吃饭时喝水", "吃饭过快", "吃得过饱", "挑食偏食"];
const dietaryHabitsPreferencesOptions = ["咸", "甜", "生", "冷", "硬", "热烫", "高油脂", "腌熏", "辛辣"];
const dietaryHabitsFoodTypePreferencesOptions = ["油炸食品", "甜点吃零食(适量坚果除外)", "经常吃快餐", "喝粥（>1次/天）"];

const dietaryIntakeStapleOptions: DietaryIntakeOption[] = ['<1碗', '1-2碗', '2-4碗', '4-6碗', '≥6碗'];
const dietaryIntakeMeatFishSoyOptions: DietaryIntakeOption[] = ['不吃', '<1两', '1-2两', '2-5两', '≥5两'];
const dietaryIntakeEggOptions: DietaryIntakeOption[] = ['不吃', '<1个', '1-2个', '2-3个', '≥3个'];
const dietaryIntakeDairyOptions: DietaryIntakeOption[] = ['不吃', '<1杯', '1-2杯', '2-3杯', '≥3杯'];
const dietaryIntakeVegetableOptions: DietaryIntakeOption[] = ['<2两', '2-6两', '6-10两', '10-15两', '≥15两'];
const dietaryIntakeFruitOptions: DietaryIntakeOption[] = ['<1两', '1-4两', '4-8两', '8-12两', '≥12两'];
const dietaryIntakeWaterOptions: DietaryIntakeOption[] = ['<3杯', '3-6杯', '6-9杯', '9-12杯', '≥12杯'];

const exerciseWorkSedentaryHoursOptions: FrequencyOption[] = ['没有', '1-2小时', '2-5小时', '5-8小时', '≥8小时'];
const exerciseWeeklyFrequencyOptions: FrequencyOption[] = ['从不', '偶尔（1-2次/周）', '经常（3-5次/周）', '总是（>5次/周）'];
const exerciseDurationPerSessionOptions: FrequencyOption[] = ['<10分钟', '10-30分钟', '30-60分钟', '1-2小时'];
const exerciseIntensityOptions: ExerciseIntensityOption[] = ['不锻炼', '极轻度运动', '轻度运动', '中度运动', '重度运动'];

const smokingStatusOptions: SmokingStatusOption[] = ['从不', '偶尔', '戒烟', '吸烟'];
const smokingCigarettesPerDayOptions = ['<5支', '5-15支', '15-25支', '25-40支', '≥40支'];
const smokingYearsOptions = ['<1年', '1-5年', '5-10年', '10-20年', '≥20年'];
const smokingPassiveDaysOptions: FrequencyOption[] = ['没有', '1-2天', '3-4天', '5-6天', '7天'];

const drinkingStatusOptions: DrinkingStatusOption[] = ['从不', '偶尔', '戒酒', '饮酒'];
const drinkingTypeOptions: AlcoholTypeOption[] = ['白酒', '黄酒', '红酒', '啤酒', '其他'];
const drinkingAmountPerDayOptions = ['<2两', '2-4两', '4-6两', '6-8两', '≥8两'];
const drinkingYearsOptions = ['<5年', '5-15年', '15-25年', '25-40年', '≥40年'];

const mentalHealthImpactStressOptions: ('几乎没有' | '有一点' | '较明显' | '很大')[] = ['几乎没有', '有一点', '较明显', '很大'];
const sasOptions: SASOption[] = ['没有或很少有时间有', '小部分时间有', '相当多时间有', '绝大部分或全部时间都有'];

const adherenceBodyOptions: AdherenceBodyOption[] = ['很满意', '满意', '尚可', '不太好', '很糟糕'];
const adherenceMindOptions: AdherenceMindOption[] = ['很重视', '还算关心', '不太在意', '无所谓'];
const adherenceComplianceOptions: AdherenceComplianceOption[] = ['完全执行', '执行一部分', '完全不执行'];
const adherenceHealthPromotionMethodsOptions = ["改变生活形态", "改变饮食习惯", "营养辅助品", "药物"];

const sleepAdequacyOptions: SleepAdequacyOption[] = ['充足', '一般', '不足', '严重不足'];

const contactPreferenceMethodOptions: ContactPreferenceMethod[] = ['电话', '微信', '短信', '邮件'];
const contactPreferenceFrequencyOptions: ContactPreferenceFrequency[] = ['每周两次', '每周一次', '两周一次', '根据实际情况需要'];
const contactPreferenceTimeOptions: ContactPreferenceTime[] = ['上午', '下午', '晚上7点后'];
const serviceSatisfactionOptions: ServiceSatisfactionOption[] = ['满意', '较好', '一般', '不满意'];


export function DoctorPatientProfileForm({ patient, onSave }: DoctorPatientProfileFormProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(true);

  const initialDetailedProfile = patient.detailedProfile || {};

  const form = useForm<PatientProfileFormValues>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: {
      name: initialDetailedProfile.name || patient.name,
      gender: initialDetailedProfile.gender || patient.gender,
      age: initialDetailedProfile.age || patient.age,
      dob: initialDetailedProfile.dob ? format(parseISO(initialDetailedProfile.dob), 'yyyy-MM-dd') : undefined,
      address: initialDetailedProfile.address || patient.contact,
      contactPhone: initialDetailedProfile.contactPhone || patient.contact,
      contactEmail: initialDetailedProfile.contactEmail,
      bloodType: initialDetailedProfile.bloodType,
      educationLevel: initialDetailedProfile.educationLevel,
      hadPreviousCheckup: initialDetailedProfile.hadPreviousCheckup || false,
      agreesToIntervention: initialDetailedProfile.agreesToIntervention || false,
      ...initialDetailedProfile,
      admissionDate: initialDetailedProfile.admissionDate ? format(parseISO(initialDetailedProfile.admissionDate), 'yyyy-MM-dd') : undefined,
      recordDate: initialDetailedProfile.recordDate ? format(parseISO(initialDetailedProfile.recordDate), 'yyyy-MM-dd') : undefined,
      pastIllnesses: initialDetailedProfile.pastIllnesses || [],
      infectiousDiseases: initialDetailedProfile.infectiousDiseases || [],
      familyMedicalHistory: initialDetailedProfile.familyMedicalHistory && initialDetailedProfile.familyMedicalHistory.length > 0
        ? initialDetailedProfile.familyMedicalHistory
        : defaultFamilyHistory,
      currentSymptoms: initialDetailedProfile.currentSymptoms || [],
      allergies: initialDetailedProfile.allergies || [],
      operationHistory: initialDetailedProfile.operationHistory || [],
      bloodTransfusionHistory: initialDetailedProfile.bloodTransfusionHistory || "",
      medicationCategories: initialDetailedProfile.medicationCategories || [],
      contactHistory: initialDetailedProfile.contactHistory || [],
      medicationHistory: initialDetailedProfile.medicationHistory || [],
      adherence_priorityProblems: initialDetailedProfile.adherence_priorityProblems || Array(4).fill(''), // Initialize with 4 empty strings
      adherence_healthPromotionMethods: initialDetailedProfile.adherence_healthPromotionMethods || [],
    },
  });

  useEffect(() => {
    const currentDetailedProfile = patient.detailedProfile || {};
    form.reset({
      name: currentDetailedProfile.name || patient.name,
      gender: currentDetailedProfile.gender || patient.gender,
      age: currentDetailedProfile.age || patient.age,
      dob: currentDetailedProfile.dob ? format(parseISO(currentDetailedProfile.dob), 'yyyy-MM-dd') : undefined,
      address: currentDetailedProfile.address || patient.contact,
      contactPhone: currentDetailedProfile.contactPhone || patient.contact,
      contactEmail: currentDetailedProfile.contactEmail,
      bloodType: currentDetailedProfile.bloodType,
      educationLevel: currentDetailedProfile.educationLevel,
      hadPreviousCheckup: currentDetailedProfile.hadPreviousCheckup || false,
      agreesToIntervention: currentDetailedProfile.agreesToIntervention || false,
      ...currentDetailedProfile,
      admissionDate: currentDetailedProfile.admissionDate ? format(parseISO(currentDetailedProfile.admissionDate), 'yyyy-MM-dd') : undefined,
      recordDate: currentDetailedProfile.recordDate ? format(parseISO(currentDetailedProfile.recordDate), 'yyyy-MM-dd') : undefined,
      pastIllnesses: currentDetailedProfile.pastIllnesses || [],
      infectiousDiseases: currentDetailedProfile.infectiousDiseases || [],
      familyMedicalHistory: currentDetailedProfile.familyMedicalHistory && currentDetailedProfile.familyMedicalHistory.length > 0
        ? currentDetailedProfile.familyMedicalHistory
        : defaultFamilyHistory,
      currentSymptoms: currentDetailedProfile.currentSymptoms || [],
      allergies: currentDetailedProfile.allergies || [],
      operationHistory: currentDetailedProfile.operationHistory || [],
      bloodTransfusionHistory: currentDetailedProfile.bloodTransfusionHistory || "",
      medicationCategories: currentDetailedProfile.medicationCategories || [],
      contactHistory: currentDetailedProfile.contactHistory || [],
      medicationHistory: currentDetailedProfile.medicationHistory || [],
      adherence_priorityProblems: currentDetailedProfile.adherence_priorityProblems?.slice(0,4) || Array(4).fill(''),
      adherence_healthPromotionMethods: currentDetailedProfile.adherence_healthPromotionMethods || [],
    });
  }, [patient, form]);

  function onSubmit(data: PatientProfileFormValues) {
    console.log("Patient profile data submitted:", data);
    const detailedData: DetailedPatientProfile = {
      ...data,
      dob: data.dob ? parseISO(data.dob).toISOString() : undefined,
      admissionDate: data.admissionDate ? parseISO(data.admissionDate).toISOString() : undefined,
      recordDate: data.recordDate ? parseISO(data.recordDate).toISOString() : undefined,
      familyMedicalHistory: data.familyMedicalHistory?.map(entry => ({
        ...entry,
        conditions: entry.conditions.filter(c => c)
      })),
      adherence_priorityProblems: (data.adherence_priorityProblems || []).filter(p => p.trim() !== '').slice(0, 4),
    };
    onSave(detailedData);
    toast({
      title: "病人信息已更新",
      description: `${data.name} 的病历信息已成功保存。`,
    });
  }

  const renderSection = (title: string, icon?: React.ElementType, children: React.ReactNode) => {
    const IconComponent = icon;
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            {IconComponent && <IconComponent className="mr-2 h-5 w-5 text-primary" />}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    );
  };
  
  const renderCheckboxArrayField = (
    name: keyof PatientProfileFormValues,
    label: string,
    options: readonly { id: string; label: string }[] | readonly string[],
    otherOptionLabel?: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2 border rounded-md">
            {options.map((option) => {
              const optionValue = typeof option === 'string' ? option : option.id;
              const optionLabel = typeof option === 'string' ? option : option.label;
              return (
                <FormItem key={optionValue} className="flex flex-row items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={(field.value || []).includes(optionValue)}
                      disabled={!isEditing}
                      onCheckedChange={(checked) => {
                        const currentArrayValue = field.value || [];
                        return checked
                          ? field.onChange([...currentArrayValue, optionValue])
                          : field.onChange(currentArrayValue.filter((value: string) => value !== optionValue));
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-xs font-normal leading-tight">{optionLabel}</FormLabel>
                </FormItem>
              );
            })}
            {otherOptionLabel && (
              <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                 <FormControl>
                  <Checkbox
                    checked={(field.value || []).includes("其他")}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => {
                        const currentArrayValue = field.value || [];
                        return checked
                        ? field.onChange([...currentArrayValue, "其他"])
                        : field.onChange(currentArrayValue.filter((value: string) => value !== "其他"));
                    }}
                  />
                </FormControl>
                <FormLabel className="text-xs font-normal leading-tight">{otherOptionLabel}</FormLabel>
                {/* Add an input for "other" text if needed, perhaps conditionally rendered */}
              </FormItem>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderRadioGroupField = (
    name: keyof PatientProfileFormValues,
    label: string,
    options: readonly string[] | readonly {value: string, label: string}[],
    description?: string
  ) => (
    <FormField
        control={form.control}
        name={name as any}
        render={({ field }) => (
            <FormItem className="space-y-1">
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-x-4 gap-y-2"
                        disabled={!isEditing}
                    >
                        {options.map((option) => {
                            const value = typeof option === 'string' ? option : option.value;
                            const labelText = typeof option === 'string' ? option : option.label;
                            return (
                                <FormItem key={value} className="flex items-center space-x-1.5">
                                    <FormControl><RadioGroupItem value={value} /></FormControl>
                                    <FormLabel className="font-normal text-xs leading-tight">{labelText}</FormLabel>
                                </FormItem>
                            );
                        })}
                    </RadioGroup>
                </FormControl>
                {description && <FormDescription className="text-xs">{description}</FormDescription>}
                <FormMessage />
            </FormItem>
        )}
    />
  );

  const educationLevelOptions = [
    { value: 'primary_school', label: '小学' },
    { value: 'junior_high_school', label: '初中' },
    { value: 'senior_high_school', label: '高中/中专' },
    { value: 'college', label: '大专' },
    { value: 'bachelor', label: '本科' },
    { value: 'master', label: '硕士' },
    { value: 'doctorate', label: '博士' },
    { value: 'other', label: '其他' },
  ];
  
  const { fields: medicationFields, append: appendMedication, remove: removeMedication } = useFieldArray({
    control: form.control,
    name: "medicationHistory",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {renderSection("基本资料", Info, (
          <>
            {/* ... existing basic info fields ... */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>姓名</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>性别</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger><SelectValue placeholder="选择性别" /></SelectTrigger></FormControl><SelectContent><SelectItem value="male">男</SelectItem><SelectItem value="female">女</SelectItem><SelectItem value="other">其他</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="dob" render={({ field }) => (<FormItem><FormLabel>生日</FormLabel><FormControl><Input type="date" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <FormField control={form.control} name="address" className="md:col-span-2" render={({ field }) => (<FormItem><FormLabel>家庭地址</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <div className="space-y-2 pt-1 md:pt-7"> 
              <FormField control={form.control} name="hadPreviousCheckup" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={!isEditing} /></FormControl><FormLabel className="font-normal">以前在本机构体检过</FormLabel><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="agreesToIntervention" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={!isEditing} /></FormControl><FormLabel className="font-normal">同意接受健康干预服务</FormLabel><FormMessage /></FormItem>)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="contactPhone" render={({ field }) => (<FormItem><FormLabel>手机</FormLabel><FormControl><Input type="tel" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="contactEmail" render={({ field }) => (<FormItem><FormLabel>E-mail</FormLabel><FormControl><Input type="email" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="bloodType" render={({ field }) => (<FormItem><FormLabel>血型</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger><SelectValue placeholder="选择血型" /></SelectTrigger></FormControl><SelectContent><SelectItem value="A">A型</SelectItem><SelectItem value="B">B型</SelectItem><SelectItem value="O">O型</SelectItem><SelectItem value="AB">AB型</SelectItem><SelectItem value="unknown">未知</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="maritalStatus" render={({ field }) => (<FormItem><FormLabel>婚姻</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger><SelectValue placeholder="选择婚姻状况" /></SelectTrigger></FormControl><SelectContent><SelectItem value="unmarried">未婚</SelectItem><SelectItem value="married">已婚</SelectItem><SelectItem value="divorced">离异</SelectItem><SelectItem value="widowed">丧偶</SelectItem><SelectItem value="other">其他</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="occupation" render={({ field }) => (<FormItem><FormLabel>职业</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="educationLevel" render={({ field }) => (<FormItem><FormLabel>文化程度</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger><SelectValue placeholder="选择文化程度" /></SelectTrigger></FormControl><SelectContent>{educationLevelOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="recordNumber" render={({ field }) => (<FormItem><FormLabel>病案号</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="admissionDate" render={({ field }) => (<FormItem><FormLabel>入院日期</FormLabel><FormControl><Input type="date" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="recordDate" render={({ field }) => (<FormItem><FormLabel>病史记录日期</FormLabel><FormControl><Input type="date" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="informant" render={({ field }) => (<FormItem><FormLabel>病史陈述者</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="reliability" render={({ field }) => (<FormItem><FormLabel>可靠程度</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!isEditing}><FormControl><SelectTrigger><SelectValue placeholder="选择可靠程度" /></SelectTrigger></FormControl><SelectContent><SelectItem value="reliable">可靠</SelectItem><SelectItem value="partially_reliable">部分可靠</SelectItem><SelectItem value="unreliable">不可靠</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
          </div>
          </>
        ))}

        {renderSection("家族病史及患病情况", Heart, ( /* ... existing family history UI ... */ <FormField control={form.control} name="familyMedicalHistory" render={() => ( <FormItem><Tabs defaultValue="self" className="w-full"><TabsList className="grid w-full grid-cols-3 md:grid-cols-5 h-auto">{(form.getValues('familyMedicalHistory') || []).map((relativeEntry) => (<TabsTrigger key={relativeEntry.relative} value={relativeEntry.relative} className="text-xs px-1 py-1.5 h-full" disabled={!isEditing}>{relativesMap[relativeEntry.relative]}</TabsTrigger>))}</TabsList>{(form.getValues('familyMedicalHistory') || []).map((_relativeEntry, relativeIndex) => (<TabsContent key={form.getValues(`familyMedicalHistory.${relativeIndex}.relative`)} value={form.getValues(`familyMedicalHistory.${relativeIndex}.relative`)}><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 p-2 border rounded-md mt-2">{allFamilyConditions.map((condition) => (<FormField key={`${form.getValues(`familyMedicalHistory.${relativeIndex}.relative`)}-${condition}`} control={form.control} name={`familyMedicalHistory.${relativeIndex}.conditions`} render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2 space-y-0"><FormControl><Checkbox checked={field.value?.includes(condition)} disabled={!isEditing} onCheckedChange={(checked) => { const currentConditions = field.value || []; return checked ? field.onChange([...currentConditions, condition]) : field.onChange(currentConditions.filter((value: string) => value !== condition));}}/></FormControl><FormLabel className="text-xs font-normal leading-tight">{condition}</FormLabel></FormItem>)}/>))}</div></TabsContent>))}</Tabs><FormMessage /></FormItem>)}/>))}
        {renderSection("现有不适症状", AlertTriangle, renderCheckboxArrayField("currentSymptoms", "选择症状", currentSymptomsOptions))}
        {renderSection("过敏史、手术史与输血史", TestTube, (
          <>
            {renderCheckboxArrayField("allergies", "选择过敏原", allergyOptions, "其他过敏原")}
            <Separator className="my-4" />
            {renderCheckboxArrayField("operationHistory", "选择手术史", operationOptions, "其他手术")}
            <Separator className="my-4" />
            <FormField control={form.control} name="bloodTransfusionHistory" render={({ field }) => (<FormItem><FormLabel>输血史详情</FormLabel><FormControl><Textarea rows={2} placeholder="请描述输血时间及输血原因" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </>
        ))}
        {renderSection("用药史（类别）", Pill, renderCheckboxArrayField("medicationCategories", "选择用药类别", medicationCategoryOptions, "其他药物类别"))}
        {renderSection("接触史", Wind, renderCheckboxArrayField("contactHistory", "选择接触史", contactHistoryOptions))}

        {/* Lifestyle Section */}
        {renderSection("生活方式调查", Activity, (
          <>
            <Tabs defaultValue="diet" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
                <TabsTrigger value="diet">饮食习惯</TabsTrigger>
                <TabsTrigger value="intake">膳食摄入</TabsTrigger>
                <TabsTrigger value="exercise">运动锻炼</TabsTrigger>
                <TabsTrigger value="smoking">吸烟情况</TabsTrigger>
                <TabsTrigger value="drinking">饮酒情况</TabsTrigger>
              </TabsList>
              <TabsContent value="diet" className="pt-4 space-y-4">
                {renderRadioGroupField("dietaryHabits_breakfastDays", "1. 您平均每周吃早餐的天数：", breakfastLateSnackFrequencyOptions)}
                {renderRadioGroupField("dietaryHabits_lateSnackDays", "2. 您平均每周吃夜宵的天数：", breakfastLateSnackFrequencyOptions)}
                {renderCheckboxArrayField("dietaryHabits_badHabits", "3. 您目前饮食的不良习惯：", dietaryHabitsBadHabitsOptions)}
                {renderCheckboxArrayField("dietaryHabits_preferences", "4. 您目前饮食方面的喜好（多选）：", dietaryHabitsPreferencesOptions)}
                {renderCheckboxArrayField("dietaryHabits_foodTypePreferences", "5. 您的饮食偏好：（多选）：", dietaryHabitsFoodTypePreferencesOptions)}
              </TabsContent>
              <TabsContent value="intake" className="pt-4 space-y-4">
                {renderRadioGroupField("dietaryIntake_staple", "1. 米、面、薯类日均摄入量：", dietaryIntakeStapleOptions, "一碗指2两")}
                {renderRadioGroupField("dietaryIntake_meat", "2. 肉类及肉制品日均摄入量：", dietaryIntakeMeatFishSoyOptions)}
                {renderRadioGroupField("dietaryIntake_fish", "3. 鱼类及水产品日均摄入量：", dietaryIntakeMeatFishSoyOptions)}
                {renderRadioGroupField("dietaryIntake_eggs", "4. 蛋类及蛋制品日均摄入量：", dietaryIntakeEggOptions, "一个指50g")}
                {renderRadioGroupField("dietaryIntake_dairy", "5. 奶类及奶制品日均摄入量：", dietaryIntakeDairyOptions, "一杯指200ml")}
                {renderRadioGroupField("dietaryIntake_soy", "6. 大豆及豆制品日均摄入量：", dietaryIntakeMeatFishSoyOptions)}
                {renderRadioGroupField("dietaryIntake_vegetables", "7. 新鲜蔬菜日均摄入量：", dietaryIntakeVegetableOptions)}
                {renderRadioGroupField("dietaryIntake_fruits", "8. 新鲜水果日均摄入量：", dietaryIntakeFruitOptions)}
                {renderRadioGroupField("dietaryIntake_water", "9. 平均日饮水摄入量：", dietaryIntakeWaterOptions, "一杯指200ml")}
              </TabsContent>
              <TabsContent value="exercise" className="pt-4 space-y-4">
                {renderRadioGroupField("exercise_workHours", "1. 您平均每天的工作时间是：", exerciseWorkSedentaryHoursOptions)}
                {renderRadioGroupField("exercise_sedentaryHours", "2. 平均每天坐姿(静止)时间：", exerciseWorkSedentaryHoursOptions)}
                {renderRadioGroupField("exercise_weeklyFrequency", "3. 您平均每周运动锻炼时间：", exerciseWeeklyFrequencyOptions)}
                {renderRadioGroupField("exercise_durationPerSession", "4. 您平均每次运动锻炼时间：", exerciseDurationPerSessionOptions)}
                {renderRadioGroupField("exercise_intensity", "5. 您一般锻炼的强度是什么：", exerciseIntensityOptions)}
              </TabsContent>
              <TabsContent value="smoking" className="pt-4 space-y-4">
                {renderRadioGroupField("smoking_status", "1. 您当前吸烟情况的描述：", smokingStatusOptions, "若“从不”则不需填下两题")}
                { (form.watch("smoking_status") === "吸烟" || form.watch("smoking_status") === "戒烟") && (
                  <>
                    {renderRadioGroupField("smoking_cigarettesPerDay", "2. 平均每天吸香烟的支数是：", smokingCigarettesPerDayOptions, "折算成香烟")}
                    {renderRadioGroupField("smoking_years", "3. 您总共吸烟的年数是：", smokingYearsOptions)}
                  </>
                )}
                {renderRadioGroupField("smoking_passiveDays", "4. 平均每周被动吸烟情况：", smokingPassiveDaysOptions, "指“二手烟”")}
              </TabsContent>
              <TabsContent value="drinking" className="pt-4 space-y-4">
                {renderRadioGroupField("drinking_status", "1. 您当前饮酒情况的描述是：", drinkingStatusOptions, "若“从不”则不需填下三题")}
                { (form.watch("drinking_status") === "饮酒" || form.watch("drinking_status") === "戒酒") && (
                  <>
                    {renderRadioGroupField("drinking_type", "2. 您最常饮酒的类型是：", drinkingTypeOptions)}
                    {renderRadioGroupField("drinking_amountPerDay", "3. 平均每天饮酒的量是：", drinkingAmountPerDayOptions, "1瓶啤酒（约600ml）=1杯红酒（约3两）=1两低度白酒或0.5两高度白酒。")}
                    {renderRadioGroupField("drinking_years", "4. 您总共饮酒的年数是：", drinkingYearsOptions)}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </>
        ))}

        {renderSection("心理健康、遵医行为与睡眠", Brain, (
          <>
            <Tabs defaultValue="mental_general" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                <TabsTrigger value="mental_general">一般心理</TabsTrigger>
                <TabsTrigger value="mental_sas">SAS焦虑自评</TabsTrigger>
                <TabsTrigger value="adherence">遵医行为</TabsTrigger>
                <TabsTrigger value="sleep">睡眠</TabsTrigger>
              </TabsList>
              <TabsContent value="mental_general" className="pt-4 space-y-4">
                  {renderRadioGroupField("mentalHealth_majorEvents", "1. 您正受一些重大意外困扰：", yesNoUnknownOptions, "如重大经济损失、亲属亡故或自然灾害等")}
                  {renderRadioGroupField("mentalHealth_impactOnLife", "2. 情绪对工作或生活的影响：", mentalHealthImpactStressOptions)}
                  {renderRadioGroupField("mentalHealth_stressLevel", "3. 您感觉到自己的精神压力：", mentalHealthImpactStressOptions)}
              </TabsContent>
              <TabsContent value="mental_sas" className="pt-4 space-y-3">
                <p className="text-xs text-muted-foreground">根据您最近一周的实际情况，在下面适当的方格里划一勾（√），请您不要漏评某一项目，也不要在相同一个项目里打两个勾（即不要重复评定）。</p>
                {renderRadioGroupField("mentalHealth_sas_anxiety", "4. 我觉得比平常容易紧张和着急（焦虑）", sasOptions)}
                {renderRadioGroupField("mentalHealth_sas_fear", "5. 我无缘无故地感到害怕（害怕）", sasOptions)}
                {renderRadioGroupField("mentalHealth_sas_panic", "6. 我容易心里烦乱或觉得惊恐（惊恐）", sasOptions)}
                {renderRadioGroupField("mentalHealth_sas_goingCrazy", "7. 我觉得我可能将要发疯（发疯感）", sasOptions)}
                {renderRadioGroupField("mentalHealth_sas_misfortune", "8. 我觉得一切都很好，也不会发生什么不幸（不幸预感）", sasOptions)}
                {renderRadioGroupField("mentalHealth_sas_trembling", "9. 我手脚发抖打颤（手足颇抖）", sasOptions)}
                {renderRadioGroupField("mentalHealth_sas_bodyPain", "10. 我因为头痛，颈痛和背痛而苦恼（躯体疼痛）", sasOptions)}
                {renderRadioGroupField("mentalHealth_sas_fatigue", "11. 我感觉容易衰弱和疲乏（乏力）", sasOptions)}
                {renderRadioGroupField("mentalHealth_sas_restlessness", "12. 我觉得心平气和，并且容易安静坐着（静坐不能）", sasOptions)}
                {renderRadioGroupField("mentalHealth_sas_palpitations", "13. 我觉得心跳很快（心悸）", sasOptions)}
                {renderRadioGroupField("mentalHealth_sas_dizziness", "14. 我因为一阵阵头晕而苦恼（头昏）", sasOptions)}
                {renderRadioGroupField("mentalHealth_sas_fainting", "15. 我有晕倒发作或觉得要晕倒似的（晕厥感）", sasOptions)}
                {renderRadioGroupField("mentalHealth_sas_breathingDifficulty", "16. 我呼气吸气都感到很容易（呼吸困难）", sasOptions)}
                {renderRadioGroupField("mentalHealth_sas_paresthesia", "17. 我手脚麻木和刺痛（手足刺痛）", sasOptions)}
                {renderRadioGroupField("mentalHealth_sas_stomachPain", "18. 我因为胃痛和消化不良而苦恼（胃痛或消化不良）", sasOptions)}
                {renderRadioGroupField("mentalHealth_sas_frequentUrination", "19. 我常常要小便（尿意频数）", sasOptions)}
                {renderRadioGroupField("mentalHealth_sas_sweating", "20. 我的手常常是干燥温暖的（多汗）", sasOptions)}
              </TabsContent>
              <TabsContent value="adherence" className="pt-4 space-y-4">
                {renderRadioGroupField("adherence_selfAssessmentBody", "1. A.身体感觉：", adherenceBodyOptions)}
                {renderRadioGroupField("adherence_selfAssessmentMind", "1. B.心理态度：", adherenceMindOptions)}
                <FormLabel className="text-sm font-medium">2. 您最希望被解决的健康问题 （请依据优先级）</FormLabel>
                <div className="space-y-2">
                  {['第一', '第二', '第三', '第四'].map((priority, index) => (
                     <FormField
                        key={index}
                        control={form.control}
                        name={`adherence_priorityProblems.${index}` as any} // Type assertion for indexed access
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">{priority}：</FormLabel>
                            <FormControl><Input {...field} placeholder={`问题 ${index + 1}`} disabled={!isEditing} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  ))}
                </div>
                {renderRadioGroupField("adherence_doctorAdviceCompliance", "3. 对医嘱及专业人员建议的依从度", adherenceComplianceOptions)}
                {renderCheckboxArrayField("adherence_healthPromotionMethods", "4.您希望以何种方式促进健康", adherenceHealthPromotionMethodsOptions)}
                 <FormField
                    control={form.control}
                    name="adherence_otherHealthPromotion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">其他促进健康方式：</FormLabel>
                            <FormControl><Input {...field} placeholder="填写其他方式" disabled={!form.watch("adherence_healthPromotionMethods")?.includes("其他")} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
              </TabsContent>
              <TabsContent value="sleep" className="pt-4 space-y-4">
                {renderRadioGroupField("sleep_adequacy", "您感觉自己的睡眠充足吗：", sleepAdequacyOptions)}
              </TabsContent>
            </Tabs>
          </>
        ))}
        
        {renderSection("其他信息", Info, (
            <>
                <FormField control={form.control} name="otherInfo_medicationsUsed" render={({ field }) => (<FormItem><FormLabel>您有使用何种药物？</FormLabel><FormControl><Textarea rows={2} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
                <p className="text-sm font-medium">我们的医务人员会在您个性化调理过程中支持与沟通健康进展，您希望什么样的方式来联系您？</p>
                {renderRadioGroupField("otherInfo_contactPreference_method", "方式：", [...contactPreferenceMethodOptions, "其他"])}
                <FormField control={form.control} name="otherInfo_contactPreference_method_other" render={({ field }) => (<FormItem className={form.watch("otherInfo_contactPreference_method") === "其他" ? "" : "hidden"}><FormLabel className="text-xs">其他联系方式：</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
                
                {renderRadioGroupField("otherInfo_contactPreference_frequency", "频率：", [...contactPreferenceFrequencyOptions, "其他"])}
                <FormField control={form.control} name="otherInfo_contactPreference_frequency_other" render={({ field }) => (<FormItem className={form.watch("otherInfo_contactPreference_frequency") === "其他" ? "" : "hidden"}><FormLabel className="text-xs">其他联系频率：</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />

                {renderRadioGroupField("otherInfo_contactPreference_time", "时间：", [...contactPreferenceTimeOptions, "其他"])}
                 <FormField control={form.control} name="otherInfo_contactPreference_time_other" render={({ field }) => (<FormItem className={form.watch("otherInfo_contactPreference_time") === "其他" ? "" : "hidden"}><FormLabel className="text-xs">其他联系时间：</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />

                <FormField control={form.control} name="otherInfo_suggestions" render={({ field }) => (<FormItem><FormLabel>您对本中心的建议：</FormLabel><FormControl><Textarea rows={3} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
                {renderRadioGroupField("otherInfo_serviceSatisfaction", "您对我中心的服务：", serviceSatisfactionOptions)}
            </>
        ))}


        {renderSection("主诉、现病史、既往史等（旧版文本录入）", Activity, (
          <>
            <FormField control={form.control} name="chiefComplaint" render={({ field }) => (<FormItem><FormLabel>主诉</FormLabel><FormControl><Textarea rows={2} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="historyOfPresentIllness" render={({ field }) => (<FormItem><FormLabel>现病史</FormLabel><FormControl><Textarea rows={4} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            {renderCheckboxArrayField("pastIllnesses", "主要既往疾病 (旧版)", pastIllnessOptions.map(o => o.label))}
            <FormField control={form.control} name="pastMedicalHistoryDetails" render={({ field }) => (<FormItem><FormLabel>其他既往史详情 (旧版)</FormLabel><FormControl><Textarea rows={3} placeholder="其他重要疾病、手术、外伤、输血史等" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="vaccinationHistory" render={({ field }) => (<FormItem><FormLabel>预防接种史</FormLabel><FormControl><Textarea rows={2} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </>
        ))}
        
        {renderSection("个人史与家族史（旧版文字描述，备用）", Activity, (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="personalHistory_smokingHistory" render={({ field }) => (<FormItem><FormLabel>吸烟史</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="personalHistory_drinkingHistory" render={({ field }) => (<FormItem><FormLabel>饮酒史</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </div>
        ))}

        {renderSection("体格检查 (简要)", Activity, (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <FormField control={form.control} name="physicalExam_temperature" render={({ field }) => (<FormItem><FormLabel>体温 (T)</FormLabel><FormControl><Input placeholder="℃" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="physicalExam_pulseRate" render={({ field }) => (<FormItem><FormLabel>脉搏 (P)</FormLabel><FormControl><Input placeholder="次/分" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="physicalExam_respiratoryRate" render={({ field }) => (<FormItem><FormLabel>呼吸 (R)</FormLabel><FormControl><Input placeholder="次/分" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="physicalExam_bloodPressure" render={({ field }) => (<FormItem><FormLabel>血压 (BP)</FormLabel><FormControl><Input placeholder="mmHg" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="physicalExam_height" render={({ field }) => (<FormItem><FormLabel>身高</FormLabel><FormControl><Input placeholder="cm" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="physicalExam_weight" render={({ field }) => (<FormItem><FormLabel>体重</FormLabel><FormControl><Input placeholder="kg" {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="physicalExam_generalAppearance" className="col-span-2 md:col-span-3 lg:col-span-4" render={({ field }) => (<FormItem><FormLabel>一般状况及皮肤黏膜等</FormLabel><FormControl><Textarea rows={2} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </div>
        ))}
        
        {renderSection("辅助检查、诊断与治疗", Stethoscope, (
          <>
            <FormField control={form.control} name="labAuxiliaryExams" render={({ field }) => (<FormItem><FormLabel>实验室及辅助检查</FormLabel><FormControl><Textarea rows={3} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="initialDiagnosis" render={({ field }) => (<FormItem><FormLabel>初步诊断</FormLabel><FormControl><Textarea rows={2} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="treatmentPlanOpinion" render={({ field }) => (<FormItem><FormLabel>治疗意见</FormLabel><FormControl><Textarea rows={3} {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </>
        ))}

        {renderSection("医师签名", Info, (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="attendingPhysician" render={({ field }) => (<FormItem><FormLabel>住院医师</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="chiefPhysician" render={({ field }) => (<FormItem><FormLabel>主治医师</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="recordingPhysician" render={({ field }) => (<FormItem><FormLabel>记录/进修医师</FormLabel><FormControl><Input {...field} disabled={!isEditing} /></FormControl><FormMessage /></FormItem>)} />
          </div>
        ))}
        
        {isEditing && (
          <div className="flex justify-end mt-8">
            <Button type="submit">保存更改</Button>
          </div>
        )}
      </form>
    </Form>
  );
}

