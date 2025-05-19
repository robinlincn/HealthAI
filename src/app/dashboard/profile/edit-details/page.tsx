
'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  UserCircle, HandHeart, Activity, Ban, Drama, Droplets, Pill, Apple, 
  CookingPot, Dumbbell, Cigarette, Wine, Brain, CheckSquare, Bed, Info, 
  MessagesSquare, Lightbulb, ThumbsUp, ChevronLeft, ChevronRight, 
  Wind, MessageCircleQuestion, NotebookText, HelpCircle, Cog, ShieldQuestion, SprayCan, UploadCloud, Loader2, FileQuestion
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

import { BasicInfoForm, type BasicInfoFormValues } from "@/components/profile/BasicInfoForm";
import { FamilyHistoryEditor } from '@/components/profile/FamilyHistoryEditor';
import { CurrentSymptomsForm } from '@/components/profile/CurrentSymptomsForm';
import { AllergyForm } from '@/components/profile/AllergyForm';
import { OperationHistoryForm } from '@/components/profile/OperationHistoryForm';
import { BloodTransfusionForm } from '@/components/profile/BloodTransfusionForm';
import { MedicationCategoryForm } from '@/components/profile/MedicationCategoryForm';
import { ContactHistoryForm } from '@/components/profile/ContactHistoryForm';
import { DietaryHabitsForm, type DietaryHabitsFormValues } from '@/components/profile/DietaryHabitsForm';
import { DietaryIntakeForm, type DietaryIntakeFormValues } from '@/components/profile/DietaryIntakeForm';
import { ExerciseForm, type ExerciseFormValues } from '@/components/profile/ExerciseForm';
import { SmokingStatusForm, type SmokingStatusFormValues } from '@/components/profile/SmokingStatusForm';
import { DrinkingStatusForm, type DrinkingStatusFormValues } from '@/components/profile/DrinkingStatusForm';
import { MentalHealthForm, type MentalHealthFormValues } from '@/components/profile/MentalHealthForm';
import { AdherenceBehaviorForm, type AdherenceBehaviorFormValues } from '@/components/profile/AdherenceBehaviorForm';
import { SleepForm, type SleepFormValues } from '@/components/profile/SleepForm';
import { OtherMedicationsForm, type OtherMedicationsFormValues } from '@/components/profile/OtherMedicationsForm';
import { SuggestionsForm, type SuggestionsFormValues } from '@/components/profile/SuggestionsForm';
import { ServiceSatisfactionForm, type ServiceSatisfactionFormValues } from '@/components/profile/ServiceSatisfactionForm';
import { ContactPreferenceForm, type ContactPreferenceFormValues } from '@/components/profile/ContactPreferenceForm';

import { extractProfileInfoFlow, type ExtractProfileInfoOutput } from "@/ai/flows/extract-profile-info-flow";

import type { 
  UserProfile, 
  FamilyMedicalHistoryEntry, 
  Gender, 
  BloodType, 
  MaritalStatus,
  ReliabilityOption,
  FrequencyOption,
  DietaryIntakeOption,
  ExerciseWorkHoursOption,
  ExerciseWeeklyFrequencyOption,
  ExerciseDurationOption,
  ExerciseIntensityOption,
  SmokingStatusOption,
  DrinkingStatusOption,
  AlcoholTypeOption,
  YesNoOption,
  ImpactLevelOption,
  SASOption,
  AdherenceBodyOption,
  AdherenceMindOption,
  AdherenceComplianceOption,
  SleepAdequacyOption,
  ContactPreferenceMethod,
  ContactPreferenceFrequency,
  ContactPreferenceTime,
  ServiceSatisfactionOption
} from "@/lib/types";
import { isValid, parseISO } from 'date-fns';

const defaultBasicInfoData: BasicInfoFormValues = {
  name: "", gender: undefined, dob: undefined, address: "",
  hadPreviousCheckup: false, agreesToIntervention: false,
  contactPhone: "", contactEmail: "", bloodType: undefined, maritalStatus: undefined,
  occupation: "", educationLevel: undefined, recordNumber: "", admissionDate: undefined,
  recordDate: undefined, informant: "", reliability: undefined,
};
const defaultFamilyHistoryData: FamilyMedicalHistoryEntry[] = [
  { relative: "self", conditions: [] }, { relative: "father", conditions: [] },
  { relative: "mother", conditions: [] }, { relative: "paternal_grandparents", conditions: [] },
  { relative: "maternal_grandparents", conditions: [] },
];
const defaultMentalHealthData: MentalHealthFormValues = {
    mentalHealth_majorEvents: undefined, mentalHealth_impactOnLife: undefined, mentalHealth_stressLevel: undefined,
    mentalHealth_sas_anxiety: undefined, mentalHealth_sas_fear: undefined, mentalHealth_sas_panic: undefined, mentalHealth_sas_goingCrazy: undefined,
    mentalHealth_sas_misfortune: undefined, mentalHealth_sas_trembling: undefined, mentalHealth_sas_bodyPain: undefined, mentalHealth_sas_fatigue: undefined,
    mentalHealth_sas_restlessness: undefined, mentalHealth_sas_palpitations: undefined, mentalHealth_sas_dizziness: undefined, mentalHealth_sas_fainting: undefined,
    mentalHealth_sas_breathingDifficulty: undefined, mentalHealth_sas_paresthesia: undefined, mentalHealth_sas_stomachPain: undefined, mentalHealth_sas_frequentUrination: undefined,
    mentalHealth_sas_sweating: undefined,
};
const defaultAdherenceData: AdherenceBehaviorFormValues = {
    adherence_selfAssessmentBody: undefined, adherence_selfAssessmentMind: undefined, adherence_priorityProblems: Array(4).fill(''),
    adherence_doctorAdviceCompliance: undefined, adherence_healthPromotionMethods: [], adherence_otherHealthPromotion: '',
};


const tabItems = [
  { value: "basicInfo", label: "基本信息", icon: UserCircle, componentKey: "basicInfo" },
  { value: "familyHistory", label: "家族病史", icon: HandHeart, componentKey: "familyHistory" },
  { value: "currentSymptoms", label: "现有症状", icon: Activity, componentKey: "currentSymptoms" },
  { value: "allergies", label: "过敏史", icon: Ban, componentKey: "allergies" },
  { value: "operationHistory", label: "手术史", icon: Drama, componentKey: "operationHistory" },
  { value: "bloodTransfusion", label: "输血史", icon: Droplets, componentKey: "bloodTransfusion" },
  { value: "medicationHistory", label: "用药史", icon: Pill, componentKey: "medicationHistory" },
  { value: "contactHistory", label: "接触史", icon: Wind, componentKey: "contactHistory" },
  { value: "dietaryHabits", label: "饮食习惯", icon: Apple, componentKey: "dietaryHabits" },
  { value: "dietaryIntake", label: "膳食摄入", icon: CookingPot, componentKey: "dietaryIntake" },
  { value: "exercise", label: "运动锻炼", icon: Dumbbell, componentKey: "exercise" },
  { value: "smokingStatus", label: "吸烟情况", icon: Cigarette, componentKey: "smokingStatus" },
  { value: "drinkingStatus", label: "饮酒情况", icon: Wine, componentKey: "drinkingStatus" },
  { value: "mentalHealth", label: "心理健康", icon: Brain, componentKey: "mentalHealth" },
  { value: "adherence", label: "遵医行为", icon: CheckSquare, componentKey: "adherence" },
  { value: "sleep", label: "睡眠", icon: Bed, componentKey: "sleep" },
  { value: "otherMedications", label: "其他用药", icon: FileQuestion, componentKey: "otherMedications" },
  { value: "communication", label: "沟通偏好", icon: MessagesSquare, componentKey: "communication" },
  { value: "suggestions", label: "您的建议", icon: Lightbulb, componentKey: "suggestions" },
  { value: "serviceSatisfaction", label: "服务满意度", icon: ThumbsUp, componentKey: "serviceSatisfaction" },
];

const mockUserProfileData: Partial<UserProfile> = {
  name: "王小宝", gender: "male", dob: "1980-06-06", address: "示例省 示例市 示例区 示例街道123号",
  contactPhone: "13534000000", contactEmail: "wang.xiaobao@example.com", bloodType: "A", maritalStatus: "married",
  occupation: "软件工程师", educationLevel: "bachelor", recordNumber: "PN00123",
  admissionDate: "2023-01-10", recordDate: "2023-01-10", informant: "本人", reliability: "reliable",
  familyMedicalHistory: [ { relative: "self", conditions: ["高血压"] }, { relative: "father", conditions: ["糖尿病", "高血压"] } ],
  currentSymptoms: ["头晕", "心慌"], allergies: ["青霉素", "其他"], otherAllergyText: "芒果",
  operationHistory: ["心脏（含心脏介入）"], bloodTransfusionHistory: "2005年因车祸输血400ml，无不良反应。",
  medicationCategories: ["降压药", "降糖药"], contactHistory: ["油烟", "粉烟尘"],
  dietaryHabits_breakfastDays: "7天", dietaryHabits_lateSnackDays: "1-2天", dietaryHabits_badHabits: ["吃饭过快"],
  dietaryHabits_preferences: ["咸", "辣"], dietaryHabits_foodTypePreferences: ["油炸食品"],
  dietaryIntake_staple: '2-4碗', dietaryIntake_meat: '1-2两', dietaryIntake_fish: '<1两', dietaryIntake_eggs: '1-2个',
  dietaryIntake_dairy: '1-2杯', dietaryIntake_soy: '0.5-1两', dietaryIntake_vegetables: '6-10两', dietaryIntake_fruits: '1-4两', dietaryIntake_water: '6-9杯',
  exercise_workHours: '≥8小时', exercise_sedentaryHours: '5-8小时', exercise_weeklyFrequency: '偶尔（1-2次/周）',
  exercise_durationPerSession: '30-60分钟', exercise_intensity: '中度运动',
  smoking_status: '吸烟', smoking_cigarettesPerDay: '5-15支', smoking_years: '10-20年', smoking_passiveDays: '1-2天',
  drinking_status: '饮酒', drinking_type: '啤酒', drinking_type_other: '', drinking_amountPerDay: '<2两', drinking_years: '5-15年',
  mentalHealth_majorEvents: "否", mentalHealth_impactOnLife: "有一点", mentalHealth_stressLevel: "较明显",
  mentalHealth_sas_anxiety: "小部分时间有", mentalHealth_sas_fear: "没有或很少有时间有", mentalHealth_sas_panic: "小部分时间有",
  mentalHealth_sas_goingCrazy: "没有或很少有时间有", mentalHealth_sas_misfortune: "没有或很少有时间有", mentalHealth_sas_trembling: "小部分时间有",
  mentalHealth_sas_bodyPain: "相当多时间有", mentalHealth_sas_fatigue: "相当多时间有", mentalHealth_sas_restlessness: "小部分时间有",
  mentalHealth_sas_palpitations: "小部分时间有", mentalHealth_sas_dizziness: "相当多时间有", mentalHealth_sas_fainting: "没有或很少有时间有",
  mentalHealth_sas_breathingDifficulty: "小部分时间有", mentalHealth_sas_paresthesia: "没有或很少有时间有", mentalHealth_sas_stomachPain: "小部分时间有",
  mentalHealth_sas_frequentUrination: "没有或很少有时间有", mentalHealth_sas_sweating: "小部分时间有",
  adherence_selfAssessmentBody: "满意", adherence_selfAssessmentMind: "还算关心",
  adherence_priorityProblems: ["控制血糖", "减轻头晕", "改善睡眠"], adherence_doctorAdviceCompliance: "执行一部分",
  adherence_healthPromotionMethods: ["改变饮食习惯", "药物"], adherence_otherHealthPromotion: "定期体检",
  sleep_adequacy: "一般",
  otherInfo_medicationsUsed: "阿司匹林 100mg QD",
  otherInfo_contactPreference_method: "微信", otherInfo_contactPreference_method_other: "",
  otherInfo_contactPreference_frequency: "每周一次", otherInfo_contactPreference_frequency_other: "",
  otherInfo_contactPreference_time: "下午", otherInfo_contactPreference_time_other: "",
  otherInfo_suggestions: "希望增加更多菜谱推荐。", otherInfo_serviceSatisfaction: "较好",
};


export default function EditProfileDetailsPage() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const SCROLL_AMOUNT = 200;
  const { toast } = useToast();

  // AI File Processing State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // State for each form section
  const [basicInfoData, setBasicInfoData] = useState<BasicInfoFormValues | null>(mockUserProfileData as BasicInfoFormValues);
  const [familyHistoryData, setFamilyHistoryData] = useState<FamilyMedicalHistoryEntry[]>(mockUserProfileData.familyMedicalHistory || defaultFamilyHistoryData);
  const [currentSymptomsData, setCurrentSymptomsData] = useState<string[]>(mockUserProfileData.currentSymptoms || []);
  const [allergiesData, setAllergiesData] = useState<string[]>(mockUserProfileData.allergies || []);
  const [otherAllergyTextData, setOtherAllergyTextData] = useState<string>(mockUserProfileData.otherAllergyText || "");
  const [operationHistoryData, setOperationHistoryData] = useState<string[]>(mockUserProfileData.operationHistory || []);
  const [bloodTransfusionHistoryData, setBloodTransfusionHistoryData] = useState<string>(mockUserProfileData.bloodTransfusionHistory || "");
  const [medicationCategoriesData, setMedicationCategoriesData] = useState<string[]>(mockUserProfileData.medicationCategories || []);
  const [contactHistoryData, setContactHistoryData] = useState<string[]>(mockUserProfileData.contactHistory || []);
  
  const [dietaryHabitsData, setDietaryHabitsData] = useState<DietaryHabitsFormValues>(mockUserProfileData as DietaryHabitsFormValues);
  const [dietaryIntakeData, setDietaryIntakeData] = useState<DietaryIntakeFormValues>(mockUserProfileData as DietaryIntakeFormValues);
  const [exerciseData, setExerciseData] = useState<ExerciseFormValues>(mockUserProfileData as ExerciseFormValues);
  const [smokingStatusData, setSmokingStatusData] = useState<SmokingStatusFormValues>(mockUserProfileData as SmokingStatusFormValues);
  const [drinkingStatusData, setDrinkingStatusData] = useState<DrinkingStatusFormValues>(mockUserProfileData as DrinkingStatusFormValues);
  const [mentalHealthData, setMentalHealthData] = useState<MentalHealthFormValues>(mockUserProfileData as MentalHealthFormValues || defaultMentalHealthData);
  const [adherenceData, setAdherenceData] = useState<AdherenceBehaviorFormValues>(mockUserProfileData as AdherenceBehaviorFormValues || defaultAdherenceData);
  const [sleepData, setSleepData] = useState<SleepFormValues>(mockUserProfileData as SleepFormValues);
  const [otherMedicationsData, setOtherMedicationsData] = useState<OtherMedicationsFormValues>({otherInfo_medicationsUsed: mockUserProfileData.otherInfo_medicationsUsed || ""});
  const [contactPreferenceData, setContactPreferenceData] = useState<ContactPreferenceFormValues>({
    otherInfo_contactPreference_method: mockUserProfileData.otherInfo_contactPreference_method,
    otherInfo_contactPreference_method_other: mockUserProfileData.otherInfo_contactPreference_method_other,
    otherInfo_contactPreference_frequency: mockUserProfileData.otherInfo_contactPreference_frequency,
    otherInfo_contactPreference_frequency_other: mockUserProfileData.otherInfo_contactPreference_frequency_other,
    otherInfo_contactPreference_time: mockUserProfileData.otherInfo_contactPreference_time,
    otherInfo_contactPreference_time_other: mockUserProfileData.otherInfo_contactPreference_time_other,
  });
  const [suggestionsData, setSuggestionsData] = useState<SuggestionsFormValues>({otherInfo_suggestions: mockUserProfileData.otherInfo_suggestions || ""});
  const [serviceSatisfactionData, setServiceSatisfactionData] = useState<ServiceSatisfactionFormValues>({otherInfo_serviceSatisfaction: mockUserProfileData.otherInfo_serviceSatisfaction});


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleAiRecognizeAndFillForms = async () => {
    if (!selectedFile) {
      toast({ title: "未选择文件", description: "请先选择一个图片或PDF文件。", variant: "destructive" });
      return;
    }
    setIsAiProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const fileDataUri = reader.result as string;
        const aiResponse = await extractProfileInfoFlow({ fileDataUri });

        if (aiResponse && aiResponse.output) {
          const aiData = aiResponse.output;
          let updatedFieldsCount = 0;

          // Helper to safely parse date and update count
          const parseAndSetDate = (dateStr: string | undefined | null): Date | undefined => {
            if (!dateStr) return undefined;
            try {
              const parsed = parseISO(dateStr);
              if (isValid(parsed)) {
                updatedFieldsCount++;
                return parsed;
              }
            } catch (e) { console.warn("AI returned invalid date:", dateStr, e); }
            return undefined;
          };
          
          // Helper to update state and count
          const updateField = <T,>(setter: React.Dispatch<React.SetStateAction<T | null>>, value: T | undefined | null, defaultValue?: T) => {
            if (value !== undefined && value !== null) {
              setter(value);
              updatedFieldsCount++;
            } else if (defaultValue !== undefined) {
              setter(defaultValue);
            }
          };
          const updateArrayField = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, value: T[] | undefined | null, defaultValue: T[] = []) => {
            if (value && Array.isArray(value) && value.length > 0) {
                setter(value.filter(item => typeof item === 'string' && item.trim() !== '')); // Ensure items are strings
                updatedFieldsCount++;
            } else {
                setter(defaultValue);
            }
          };


          // Basic Info
          const basicUpdate: Partial<BasicInfoFormValues> = {};
          if (aiData.name) basicUpdate.name = aiData.name;
          if (aiData.gender) basicUpdate.gender = aiData.gender as Gender;
          if (aiData.dob) basicUpdate.dob = parseAndSetDate(aiData.dob);
          if (aiData.address) basicUpdate.address = aiData.address;
          if (typeof aiData.hadPreviousCheckup === 'boolean') basicUpdate.hadPreviousCheckup = aiData.hadPreviousCheckup;
          if (typeof aiData.agreesToIntervention === 'boolean') basicUpdate.agreesToIntervention = aiData.agreesToIntervention;
          if (aiData.contactPhone) basicUpdate.contactPhone = aiData.contactPhone;
          if (aiData.contactEmail) basicUpdate.contactEmail = aiData.contactEmail;
          if (aiData.bloodType) basicUpdate.bloodType = aiData.bloodType as BloodType;
          if (aiData.maritalStatus) basicUpdate.maritalStatus = aiData.maritalStatus as MaritalStatus;
          if (aiData.occupation) basicUpdate.occupation = aiData.occupation;
          if (aiData.educationLevel) basicUpdate.educationLevel = aiData.educationLevel;
          if (aiData.recordNumber) basicUpdate.recordNumber = aiData.recordNumber;
          if (aiData.admissionDate) basicUpdate.admissionDate = parseAndSetDate(aiData.admissionDate);
          if (aiData.recordDate) basicUpdate.recordDate = parseAndSetDate(aiData.recordDate);
          if (aiData.informant) basicUpdate.informant = aiData.informant;
          if (aiData.reliability) basicUpdate.reliability = aiData.reliability as ReliabilityOption;
          setBasicInfoData(prev => ({ ...(prev || defaultBasicInfoData), ...basicUpdate }));
          if(Object.keys(basicUpdate).length > 0) updatedFieldsCount += Object.keys(basicUpdate).filter(k => basicUpdate[k as keyof typeof basicUpdate] !== undefined).length;


          // Family History
          if (aiData.familyMedicalHistory && Array.isArray(aiData.familyMedicalHistory)) {
            const processedFamilyHistory = aiData.familyMedicalHistory.map(entry => ({
              relative: entry.relative || 'self',
              conditions: Array.isArray(entry.conditions) ? entry.conditions.filter(c => typeof c === 'string') : [],
            })).filter(entry => defaultFamilyHistoryData.some(dfh => dfh.relative === entry.relative));
            const mergedFamilyHistory = defaultFamilyHistoryData.map(defaultEntry => {
                const aiEntry = processedFamilyHistory.find(ae => ae.relative === defaultEntry.relative);
                if (aiEntry && aiEntry.conditions.length > 0) updatedFieldsCount++;
                return aiEntry ? { ...defaultEntry, conditions: aiEntry.conditions } : defaultEntry;
            });
            setFamilyHistoryData(mergedFamilyHistory);
          }

          updateArrayField(setCurrentSymptomsData, aiData.currentSymptoms);
          updateArrayField(setAllergiesData, aiData.allergies);
          updateField(setOtherAllergyTextData, aiData.otherAllergyText);
            if(aiData.otherAllergyText && aiData.allergies && !aiData.allergies.includes("其他")) {
                setAllergiesData(prev => [...prev, "其他"]);
            }
          updateArrayField(setOperationHistoryData, aiData.operationHistory);
          updateField(setBloodTransfusionHistoryData, aiData.bloodTransfusionHistory);
          updateArrayField(setMedicationCategoriesData, aiData.medicationCategories);
          updateArrayField(setContactHistoryData, aiData.contactHistory);

          // Lifestyle and other sections
          updateField(setDietaryHabitsData, aiData.dietaryHabits as DietaryHabitsFormValues | undefined);
          updateField(setDietaryIntakeData, aiData.dietaryIntake as DietaryIntakeFormValues | undefined);
          updateField(setExerciseData, aiData.exercise as ExerciseFormValues | undefined);
          updateField(setSmokingStatusData, aiData.smokingStatus as SmokingStatusFormValues | undefined);
          updateField(setDrinkingStatusData, aiData.drinkingStatus as DrinkingStatusFormValues | undefined);
          
          // Mental Health - more complex, merge carefully
           if (aiData.mentalHealth) {
            setMentalHealthData(prev => ({ ...(prev || defaultMentalHealthData), ...(aiData.mentalHealth as MentalHealthFormValues)}));
            updatedFieldsCount += Object.keys(aiData.mentalHealth).length; // Approximate
          }

          // Adherence - also merge carefully
          if (aiData.adherence) {
            const adherenceUpdate = { ...aiData.adherence } as AdherenceBehaviorFormValues;
            if (adherenceUpdate.adherence_priorityProblems && Array.isArray(adherenceUpdate.adherence_priorityProblems)) {
              const problems = adherenceUpdate.adherence_priorityProblems.filter(s => typeof s === 'string').slice(0, 4);
              adherenceUpdate.adherence_priorityProblems = [...problems, ...Array(Math.max(0, 4 - problems.length)).fill('')];
            } else {
              adherenceUpdate.adherence_priorityProblems = Array(4).fill('');
            }
            setAdherenceData(prev => ({...(prev || defaultAdherenceData), ...adherenceUpdate }));
            updatedFieldsCount += Object.keys(adherenceUpdate).length;
          }
          
          updateField(setSleepData, aiData.sleep as SleepFormValues | undefined);
          updateField(setOtherMedicationsData, aiData.otherInfo_medicationsUsed ? { otherInfo_medicationsUsed: aiData.otherInfo_medicationsUsed } : undefined);
          updateField(setContactPreferenceData, aiData.contactPreference as ContactPreferenceFormValues | undefined);
          updateField(setSuggestionsData, aiData.otherInfo_suggestions ? { otherInfo_suggestions: aiData.otherInfo_suggestions } : undefined);
          updateField(setServiceSatisfactionData, aiData.otherInfo_serviceSatisfaction ? { otherInfo_serviceSatisfaction: aiData.otherInfo_serviceSatisfaction as ServiceSatisfactionOption } : undefined);
          
          toast({
            title: "AI识别完成",
            description: updatedFieldsCount > 0 ? `已尝试填充 ${updatedFieldsCount} 个字段，请检查并确认。` : "AI未能从文件中识别出可填充的信息。",
            duration: 7000,
          });
        } else {
          toast({ title: "AI识别失败", description: "AI未能返回有效数据，请检查文件或稍后再试。", variant: "destructive" });
        }
      };
      reader.onerror = () => {
        toast({ title: "文件读取失败", description: "无法读取您选择的文件。", variant: "destructive" });
        setIsAiProcessing(false);
      };
    } catch (error) {
      console.error("Error in AI recognition:", error);
      toast({ title: "AI处理出错", description: "处理您的文件时发生错误，请稍后再试。", variant: "destructive" });
    } finally {
      setIsAiProcessing(false);
      setSelectedFile(null); // Clear the file input after processing
      const fileInput = document.getElementById('aiProfileUpload') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';
    }
  };


  const checkScrollability = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 5); 
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollability(); 
      container.addEventListener('scroll', checkScrollability, { passive: true });
      window.addEventListener('resize', checkScrollability);
      
      const observer = new MutationObserver(checkScrollability);
      observer.observe(container, { childList: true, subtree: true, characterData: true });

      return () => {
        container.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
        observer.disconnect();
      };
    }
  }, [checkScrollability]);

  const handleScrollClick = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-sm sticky top-[60px] z-10 bg-background/90 backdrop-blur-sm">
        <CardHeader className="p-3">
          <CardTitle className="text-base flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-primary"/> AI智能填充档案
          </CardTitle>
          <CardDescription className="text-xs">
            上传您的健康报告、体检单或身份证图片/PDF，AI将尝试自动识别并填充下方档案信息。
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-2">
          <Input 
            id="aiProfileUpload"
            type="file" 
            accept="image/*,.pdf" 
            onChange={handleFileChange} 
            className="text-xs h-9"
            disabled={isAiProcessing}
          />
          <Button 
            onClick={handleAiRecognizeAndFillForms} 
            disabled={!selectedFile || isAiProcessing} 
            className="w-full h-9 text-sm"
          >
            {isAiProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
            {isAiProcessing ? "识别中..." : "上传并AI识别"}
          </Button>
          {selectedFile && !isAiProcessing && (
            <p className="text-xs text-muted-foreground text-center">已选择: {selectedFile.name}</p>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="basicInfo" className="w-full">
        <div className="relative flex items-center group">
           <Button
            variant="ghost"
            size="icon"
            onClick={() => handleScrollClick('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/70 p-0 shadow-md hover:bg-muted transition-opacity duration-200 
              ${canScrollLeft ? 'opacity-75 hover:opacity-100 group-hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-label="Scroll left"
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div
            ref={scrollContainerRef}
            className="flex-grow overflow-x-auto whitespace-nowrap py-1 scroll-smooth no-scrollbar px-10" 
          >
            <style jsx global>{`
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            <TabsList className="inline-flex h-auto items-center justify-start rounded-md bg-muted p-1 text-muted-foreground space-x-1">
              {tabItems.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="px-3 py-1.5 text-xs sm:text-sm flex items-center gap-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm shrink-0"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
           <Button
            variant="ghost"
            size="icon"
            onClick={() => handleScrollClick('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/70 p-0 shadow-md hover:bg-muted transition-opacity duration-200 
              ${canScrollRight ? 'opacity-75 hover:opacity-100 group-hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-label="Scroll right"
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <TabsContent value="basicInfo">
          <BasicInfoForm initialData={basicInfoData} onSave={setBasicInfoData} />
        </TabsContent>
        
        <TabsContent value="familyHistory">
           <FamilyHistoryEditor initialData={familyHistoryData} onSave={setFamilyHistoryData} />
        </TabsContent>

        <TabsContent value="currentSymptoms">
          <CurrentSymptomsForm initialSymptoms={currentSymptomsData} onSave={setCurrentSymptomsData} />
        </TabsContent>

        <TabsContent value="allergies">
          <AllergyForm 
            initialAllergies={allergiesData} 
            initialOtherAllergyText={otherAllergyTextData}
            onSave={(data) => {
              setAllergiesData(data.allergies || []);
              setOtherAllergyTextData(data.otherAllergyText || "");
            }} 
          />
        </TabsContent>
        
        <TabsContent value="operationHistory">
          <OperationHistoryForm 
            initialOperationHistory={operationHistoryData} 
            onSave={setOperationHistoryData} 
          />
        </TabsContent>

        <TabsContent value="bloodTransfusion">
          <BloodTransfusionForm 
            initialHistoryText={bloodTransfusionHistoryData}
            onSave={setBloodTransfusionHistoryData}
          />
        </TabsContent>

        <TabsContent value="medicationHistory">
          <MedicationCategoryForm 
            initialMedicationCategories={medicationCategoriesData}
            onSave={setMedicationCategoriesData}
          />
        </TabsContent>
        
        <TabsContent value="contactHistory">
          <ContactHistoryForm 
            initialContactHistory={contactHistoryData}
            onSave={setContactHistoryData}
          />
        </TabsContent>
        
        <TabsContent value="dietaryHabits">
          <DietaryHabitsForm 
            initialData={dietaryHabitsData as DietaryHabitsFormValues}
            onSave={setDietaryHabitsData}
          />
        </TabsContent>

        <TabsContent value="dietaryIntake">
          <DietaryIntakeForm 
            initialData={dietaryIntakeData as DietaryIntakeFormValues}
            onSave={setDietaryIntakeData}
          />
        </TabsContent>

        <TabsContent value="exercise">
          <ExerciseForm 
            initialData={exerciseData as ExerciseFormValues}
            onSave={setExerciseData}
          />
        </TabsContent>
        
        <TabsContent value="smokingStatus">
          <SmokingStatusForm
            initialData={smokingStatusData as SmokingStatusFormValues}
            onSave={setSmokingStatusData}
          />
        </TabsContent>
        
        <TabsContent value="drinkingStatus">
          <DrinkingStatusForm
            initialData={drinkingStatusData as DrinkingStatusFormValues}
            onSave={setDrinkingStatusData}
          />
        </TabsContent>
        
        <TabsContent value="mentalHealth">
          <MentalHealthForm
            initialData={mentalHealthData as MentalHealthFormValues | undefined}
            onSave={setMentalHealthData}
          />
        </TabsContent>
        
        <TabsContent value="adherence">
           <AdherenceBehaviorForm 
            initialData={adherenceData as AdherenceBehaviorFormValues | undefined} 
            onSave={setAdherenceData} />
        </TabsContent>

        <TabsContent value="sleep">
          <SleepForm 
            initialData={sleepData as SleepFormValues | undefined} 
            onSave={setSleepData} />
        </TabsContent>

        <TabsContent value="otherMedications">
          <OtherMedicationsForm 
            initialData={otherMedicationsData} 
            onSave={setOtherMedicationsData} />
        </TabsContent>
        
        <TabsContent value="communication">
          <ContactPreferenceForm 
            initialData={contactPreferenceData as ContactPreferenceFormValues | undefined} 
            onSave={setContactPreferenceData} />
        </TabsContent>
        
        <TabsContent value="suggestions">
          <SuggestionsForm 
            initialData={suggestionsData} 
            onSave={setSuggestionsData} />
        </TabsContent>

        <TabsContent value="serviceSatisfaction">
          <ServiceSatisfactionForm 
            initialData={serviceSatisfactionData as ServiceSatisfactionFormValues | undefined} 
            onSave={setServiceSatisfactionData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
  