
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

// Import all form components
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

import { extractProfileInfoFlow, type ExtractProfileInfoOutput, type ExtractProfileInfoInput } from "@/ai/flows/extract-profile-info-flow";

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


// Define default empty states for each form section
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
const defaultCurrentSymptomsData: string[] = [];
const defaultAllergiesData: string[] = [];
const defaultOtherAllergyTextData: string = "";
const defaultOperationHistoryData: string[] = [];
const defaultBloodTransfusionHistoryData: string = "";
const defaultMedicationCategoriesData: string[] = [];
const defaultContactHistoryData: string[] = [];
const defaultDietaryHabitsData: DietaryHabitsFormValues = {};
const defaultDietaryIntakeData: DietaryIntakeFormValues = {};
const defaultExerciseData: ExerciseFormValues = {};
const defaultSmokingStatusData: SmokingStatusFormValues = {};
const defaultDrinkingStatusData: DrinkingStatusFormValues = {};
const defaultMentalHealthData: MentalHealthFormValues = { /* SAS fields can be undefined */ };
const defaultAdherenceData: AdherenceBehaviorFormValues = { adherence_priorityProblems: Array(4).fill('') };
const defaultSleepData: SleepFormValues = {};
const defaultOtherMedicationsData: OtherMedicationsFormValues = { otherInfo_medicationsUsed: "" };
const defaultContactPreferenceData: ContactPreferenceFormValues = {};
const defaultSuggestionsData: SuggestionsFormValues = { otherInfo_suggestions: "" };
const defaultServiceSatisfactionData: ServiceSatisfactionFormValues = {};

const tabItems = [
  { value: "basicInfo", label: "基本信息", icon: UserCircle, component: BasicInfoForm },
  { value: "familyHistory", label: "家族病史", icon: HandHeart, component: FamilyHistoryEditor },
  { value: "currentSymptoms", label: "现有症状", icon: Activity, component: CurrentSymptomsForm },
  { value: "allergies", label: "过敏史", icon: Ban, component: AllergyForm },
  { value: "operationHistory", label: "手术史", icon: Drama, component: OperationHistoryForm },
  { value: "bloodTransfusion", label: "输血史", icon: Droplets, component: BloodTransfusionForm },
  { value: "medicationHistory", label: "用药史", icon: Pill, component: MedicationCategoryForm },
  { value: "contactHistory", label: "接触史", icon: Wind, component: ContactHistoryForm },
  { value: "dietaryHabits", label: "饮食习惯", icon: Apple, component: DietaryHabitsForm },
  { value: "dietaryIntake", label: "膳食摄入", icon: CookingPot, component: DietaryIntakeForm },
  { value: "exercise", label: "运动锻炼", icon: Dumbbell, component: ExerciseForm },
  { value: "smokingStatus", label: "吸烟情况", icon: Cigarette, component: SmokingStatusForm },
  { value: "drinkingStatus", label: "饮酒情况", icon: Wine, component: DrinkingStatusForm },
  { value: "mentalHealth", label: "心理健康", icon: Brain, component: MentalHealthForm },
  { value: "adherence", label: "遵医行为", icon: CheckSquare, component: AdherenceBehaviorForm },
  { value: "sleep", label: "睡眠", icon: Bed, component: SleepForm },
  { value: "otherInfo", label: "其他", icon: FileQuestion, component: OtherMedicationsForm }, // Using OtherMedicationsForm as a placeholder for "Other" tab's content
  { value: "communication", label: "沟通偏好", icon: MessagesSquare, component: ContactPreferenceForm },
  { value: "suggestions", label: "您的建议", icon: Lightbulb, component: SuggestionsForm },
  { value: "serviceSatisfaction", label: "服务满意度", icon: ThumbsUp, component: ServiceSatisfactionForm },
];

const renderPlaceholderContent = (title: string, Icon?: LucideIcon) => (
    <Card className="shadow-sm mt-4">
      <CardHeader className="p-4">
        <CardTitle className="text-base flex items-center">
          {Icon && <Icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          编辑{title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 text-center text-muted-foreground">
        <p className="text-sm">此模块的表单正在建设中，敬请期待。</p>
        <p className="text-xs mt-1">AI识别功能会尝试填充此部分，请在对应表单完成后检查。</p>
      </CardContent>
    </Card>
);

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
  const [basicInfoData, setBasicInfoData] = useState<BasicInfoFormValues | null>(defaultBasicInfoData);
  const [familyHistoryData, setFamilyHistoryData] = useState<FamilyMedicalHistoryEntry[]>(defaultFamilyHistoryData);
  const [currentSymptomsData, setCurrentSymptomsData] = useState<string[]>(defaultCurrentSymptomsData);
  const [allergiesData, setAllergiesData] = useState<string[]>(defaultAllergiesData);
  const [otherAllergyTextData, setOtherAllergyTextData] = useState<string>(defaultOtherAllergyTextData);
  const [operationHistoryData, setOperationHistoryData] = useState<string[]>(defaultOperationHistoryData);
  const [bloodTransfusionHistoryData, setBloodTransfusionHistoryData] = useState<string>(defaultBloodTransfusionHistoryData);
  const [medicationCategoriesData, setMedicationCategoriesData] = useState<string[]>(defaultMedicationCategoriesData);
  const [contactHistoryData, setContactHistoryData] = useState<string[]>(defaultContactHistoryData);
  const [dietaryHabitsData, setDietaryHabitsData] = useState<DietaryHabitsFormValues>(defaultDietaryHabitsData);
  const [dietaryIntakeData, setDietaryIntakeData] = useState<DietaryIntakeFormValues>(defaultDietaryIntakeData);
  const [exerciseData, setExerciseData] = useState<ExerciseFormValues>(defaultExerciseData);
  const [smokingStatusData, setSmokingStatusData] = useState<SmokingStatusFormValues>(defaultSmokingStatusData);
  const [drinkingStatusData, setDrinkingStatusData] = useState<DrinkingStatusFormValues>(defaultDrinkingStatusData);
  const [mentalHealthData, setMentalHealthData] = useState<MentalHealthFormValues | null>(defaultMentalHealthData);
  const [adherenceData, setAdherenceData] = useState<AdherenceBehaviorFormValues | null>(defaultAdherenceData);
  const [sleepData, setSleepData] = useState<SleepFormValues | null>(defaultSleepData);
  const [otherMedicationsData, setOtherMedicationsData] = useState<OtherMedicationsFormValues>(defaultOtherMedicationsData);
  const [contactPreferenceData, setContactPreferenceData] = useState<ContactPreferenceFormValues | null>(defaultContactPreferenceData);
  const [suggestionsData, setSuggestionsData] = useState<SuggestionsFormValues>(defaultSuggestionsData);
  const [serviceSatisfactionData, setServiceSatisfactionData] = useState<ServiceSatisfactionFormValues | null>(defaultServiceSatisfactionData);


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
        
        if (aiResponse) { // No .output needed, aiResponse is ExtractProfileInfoOutput
          const aiData = aiResponse; // Use aiResponse directly
          let updatedFieldsCount = 0;

          // Basic Info
          const basicUpdate: Partial<BasicInfoFormValues> = {};
          if (aiData.name) { basicUpdate.name = aiData.name; updatedFieldsCount++; }
          if (aiData.gender) { basicUpdate.gender = aiData.gender as Gender; updatedFieldsCount++; }
          if (aiData.dob) { try { const d = parseISO(aiData.dob); if(isValid(d)) basicUpdate.dob = d; updatedFieldsCount++; } catch(e){ console.warn("Invalid DOB from AI", e); } }
          if (aiData.address) { basicUpdate.address = aiData.address; updatedFieldsCount++; }
          if (typeof aiData.hadPreviousCheckup === 'boolean') { basicUpdate.hadPreviousCheckup = aiData.hadPreviousCheckup; updatedFieldsCount++; }
          if (typeof aiData.agreesToIntervention === 'boolean') { basicUpdate.agreesToIntervention = aiData.agreesToIntervention; updatedFieldsCount++; }
          if (aiData.contactPhone) { basicUpdate.contactPhone = aiData.contactPhone; updatedFieldsCount++; }
          if (aiData.contactEmail) { basicUpdate.contactEmail = aiData.contactEmail; updatedFieldsCount++; }
          if (aiData.bloodType) { basicUpdate.bloodType = aiData.bloodType as BloodType; updatedFieldsCount++; }
          if (aiData.maritalStatus) { basicUpdate.maritalStatus = aiData.maritalStatus as MaritalStatus; updatedFieldsCount++; }
          if (aiData.occupation) { basicUpdate.occupation = aiData.occupation; updatedFieldsCount++; }
          if (aiData.educationLevel) { basicUpdate.educationLevel = aiData.educationLevel; updatedFieldsCount++; }
          if (aiData.recordNumber) { basicUpdate.recordNumber = aiData.recordNumber; updatedFieldsCount++; }
          if (aiData.admissionDate) { try { const d = parseISO(aiData.admissionDate); if(isValid(d)) basicUpdate.admissionDate = d; updatedFieldsCount++; } catch(e){} }
          if (aiData.recordDate) { try { const d = parseISO(aiData.recordDate); if(isValid(d)) basicUpdate.recordDate = d; updatedFieldsCount++; } catch(e){} }
          if (aiData.informant) { basicUpdate.informant = aiData.informant; updatedFieldsCount++; }
          if (aiData.reliability) { basicUpdate.reliability = aiData.reliability as ReliabilityOption; updatedFieldsCount++; }
          if (Object.keys(basicUpdate).length > 0) setBasicInfoData(prev => ({ ...(prev || defaultBasicInfoData), ...basicUpdate }));
          
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

          // Current Symptoms
          if (aiData.currentSymptoms && Array.isArray(aiData.currentSymptoms)) {
            const validSymptoms = aiData.currentSymptoms.filter(s => typeof s === 'string');
            if (validSymptoms.length > 0) updatedFieldsCount++;
            setCurrentSymptomsData(validSymptoms);
          }
          // Allergies
          if (aiData.allergies && Array.isArray(aiData.allergies)) {
            const validAllergies = aiData.allergies.filter(a => typeof a === 'string');
            if (validAllergies.length > 0) updatedFieldsCount++;
            setAllergiesData(validAllergies);
             if (typeof aiData.otherAllergyText === 'string' && aiData.otherAllergyText.trim() !== "") {
              setOtherAllergyTextData(aiData.otherAllergyText);
              if (!validAllergies.includes("其他")) { setAllergiesData(prev => [...prev, "其他"]); }
              updatedFieldsCount++;
            }
          }
          // Operation History
          if (aiData.operationHistory && Array.isArray(aiData.operationHistory)) {
            const validOps = aiData.operationHistory.filter(op => typeof op === 'string');
            if (validOps.length > 0) updatedFieldsCount++;
            setOperationHistoryData(validOps);
          }
          // Blood Transfusion
          if (typeof aiData.bloodTransfusionHistory === 'string') {
            setBloodTransfusionHistoryData(aiData.bloodTransfusionHistory);
            if(aiData.bloodTransfusionHistory.trim() !== "") updatedFieldsCount++;
          }
          // Medication Categories
          if (aiData.medicationCategories && Array.isArray(aiData.medicationCategories)) {
            const validMedCats = aiData.medicationCategories.filter(mc => typeof mc === 'string');
            if (validMedCats.length > 0) updatedFieldsCount++;
            setMedicationCategoriesData(validMedCats);
          }
          // Contact History
          if (aiData.contactHistory && Array.isArray(aiData.contactHistory)) {
            const validContacts = aiData.contactHistory.filter(ch => typeof ch === 'string');
            if (validContacts.length > 0) updatedFieldsCount++;
            setContactHistoryData(validContacts);
          }
          // Dietary Habits
          const dhUpdate: Partial<DietaryHabitsFormValues> = {};
          if (aiData.dietaryHabits_breakfastDays) { dhUpdate.dietaryHabits_breakfastDays = aiData.dietaryHabits_breakfastDays as FrequencyOption; updatedFieldsCount++; }
          if (aiData.dietaryHabits_lateSnackDays) { dhUpdate.dietaryHabits_lateSnackDays = aiData.dietaryHabits_lateSnackDays as FrequencyOption; updatedFieldsCount++; }
          if (aiData.dietaryHabits_badHabits) { dhUpdate.dietaryHabits_badHabits = aiData.dietaryHabits_badHabits.filter(s=>typeof s === 'string'); if(dhUpdate.dietaryHabits_badHabits.length > 0) updatedFieldsCount++;}
          if (aiData.dietaryHabits_preferences) { dhUpdate.dietaryHabits_preferences = aiData.dietaryHabits_preferences.filter(s=>typeof s === 'string'); if(dhUpdate.dietaryHabits_preferences.length > 0) updatedFieldsCount++;}
          if (aiData.dietaryHabits_foodTypePreferences) { dhUpdate.dietaryHabits_foodTypePreferences = aiData.dietaryHabits_foodTypePreferences.filter(s=>typeof s === 'string'); if(dhUpdate.dietaryHabits_foodTypePreferences.length > 0) updatedFieldsCount++;}
          if(Object.keys(dhUpdate).length > 0) setDietaryHabitsData(prev => ({...(prev || defaultDietaryHabitsData), ...dhUpdate}));
          
          // Dietary Intake
          const diUpdate: Partial<DietaryIntakeFormValues> = {};
          if(aiData.dietaryIntake_staple) {diUpdate.dietaryIntake_staple = aiData.dietaryIntake_staple as DietaryIntakeOption; updatedFieldsCount++;}
          if(aiData.dietaryIntake_meat) {diUpdate.dietaryIntake_meat = aiData.dietaryIntake_meat as DietaryIntakeOption; updatedFieldsCount++;}
          if(aiData.dietaryIntake_fish) {diUpdate.dietaryIntake_fish = aiData.dietaryIntake_fish as DietaryIntakeOption; updatedFieldsCount++;}
          if(aiData.dietaryIntake_eggs) {diUpdate.dietaryIntake_eggs = aiData.dietaryIntake_eggs as DietaryIntakeOption; updatedFieldsCount++;}
          if(aiData.dietaryIntake_dairy) {diUpdate.dietaryIntake_dairy = aiData.dietaryIntake_dairy as DietaryIntakeOption; updatedFieldsCount++;}
          if(aiData.dietaryIntake_soy) {diUpdate.dietaryIntake_soy = aiData.dietaryIntake_soy as DietaryIntakeOption; updatedFieldsCount++;}
          if(aiData.dietaryIntake_vegetables) {diUpdate.dietaryIntake_vegetables = aiData.dietaryIntake_vegetables as DietaryIntakeOption; updatedFieldsCount++;}
          if(aiData.dietaryIntake_fruits) {diUpdate.dietaryIntake_fruits = aiData.dietaryIntake_fruits as DietaryIntakeOption; updatedFieldsCount++;}
          if(aiData.dietaryIntake_water) {diUpdate.dietaryIntake_water = aiData.dietaryIntake_water as DietaryIntakeOption; updatedFieldsCount++;}
          if(Object.keys(diUpdate).length > 0) setDietaryIntakeData(prev => ({...(prev || defaultDietaryIntakeData), ...diUpdate}));

          // Exercise
          const exUpdate: Partial<ExerciseFormValues> = {};
          if(aiData.exercise_workHours) {exUpdate.exercise_workHours = aiData.exercise_workHours as ExerciseWorkHoursOption; updatedFieldsCount++;}
          if(aiData.exercise_sedentaryHours) {exUpdate.exercise_sedentaryHours = aiData.exercise_sedentaryHours as ExerciseWorkHoursOption; updatedFieldsCount++;}
          if(aiData.exercise_weeklyFrequency) {exUpdate.exercise_weeklyFrequency = aiData.exercise_weeklyFrequency as ExerciseWeeklyFrequencyOption; updatedFieldsCount++;}
          if(aiData.exercise_durationPerSession) {exUpdate.exercise_durationPerSession = aiData.exercise_durationPerSession as ExerciseDurationOption; updatedFieldsCount++;}
          if(aiData.exercise_intensity) {exUpdate.exercise_intensity = aiData.exercise_intensity as ExerciseIntensityOption; updatedFieldsCount++;}
          if(Object.keys(exUpdate).length > 0) setExerciseData(prev => ({...(prev || defaultExerciseData), ...exUpdate}));
          
          // Smoking Status
          const smkUpdate: Partial<SmokingStatusFormValues> = {};
          if (aiData.smoking_status) { smkUpdate.smoking_status = aiData.smoking_status as SmokingStatusOption; updatedFieldsCount++; }
          if (aiData.smoking_status === '吸烟' || aiData.smoking_status === '戒烟') {
              if (aiData.smoking_cigarettesPerDay) { smkUpdate.smoking_cigarettesPerDay = aiData.smoking_cigarettesPerDay; updatedFieldsCount++; }
              if (aiData.smoking_years) { smkUpdate.smoking_years = aiData.smoking_years; updatedFieldsCount++; }
          }
          if (aiData.smoking_passiveDays) { smkUpdate.smoking_passiveDays = aiData.smoking_passiveDays as FrequencyOption; updatedFieldsCount++; }
          if (Object.keys(smkUpdate).length > 0) setSmokingStatusData(prev => ({...(prev || defaultSmokingStatusData), ...smkUpdate}));

          // Drinking Status
          const drkUpdate: Partial<DrinkingStatusFormValues> = {};
          if (aiData.drinking_status) { drkUpdate.drinking_status = aiData.drinking_status as DrinkingStatusOption; updatedFieldsCount++; }
          if (aiData.drinking_status === '饮酒' || aiData.drinking_status === '戒酒') {
            if (aiData.drinking_type) { drkUpdate.drinking_type = aiData.drinking_type as AlcoholTypeOption | string; updatedFieldsCount++; }
            if (aiData.drinking_type === '其他' && aiData.drinking_type_other) { drkUpdate.drinking_type_other = aiData.drinking_type_other; updatedFieldsCount++;}
            if (aiData.drinking_amountPerDay) { drkUpdate.drinking_amountPerDay = aiData.drinking_amountPerDay; updatedFieldsCount++; }
            if (aiData.drinking_years) { drkUpdate.drinking_years = aiData.drinking_years; updatedFieldsCount++; }
          }
          if (Object.keys(drkUpdate).length > 0) setDrinkingStatusData(prev => ({...(prev || defaultDrinkingStatusData), ...drkUpdate}));

          // Mental Health
          const mhUpdate: Partial<MentalHealthFormValues> = {};
          if (aiData.mentalHealth_majorEvents) { mhUpdate.mentalHealth_majorEvents = aiData.mentalHealth_majorEvents as YesNoOption; updatedFieldsCount++; }
          if (aiData.mentalHealth_impactOnLife) { mhUpdate.mentalHealth_impactOnLife = aiData.mentalHealth_impactOnLife as ImpactLevelOption; updatedFieldsCount++; }
          if (aiData.mentalHealth_stressLevel) { mhUpdate.mentalHealth_stressLevel = aiData.mentalHealth_stressLevel as ImpactLevelOption; updatedFieldsCount++; }
          const sasKeys = Object.keys(aiData).filter(k => k.startsWith('mentalHealth_sas_')) as (keyof typeof aiData)[];
          sasKeys.forEach(key => {
            if (aiData[key]) { (mhUpdate as any)[key] = aiData[key] as SASOption; updatedFieldsCount++; }
          });
          if (Object.keys(mhUpdate).length > 0) setMentalHealthData(prev => ({...(prev || defaultMentalHealthData), ...mhUpdate}));

          // Adherence Behavior
          const adhUpdate: Partial<AdherenceBehaviorFormValues> = {};
          if (aiData.adherence_selfAssessmentBody) { adhUpdate.adherence_selfAssessmentBody = aiData.adherence_selfAssessmentBody as AdherenceBodyOption; updatedFieldsCount++; }
          if (aiData.adherence_selfAssessmentMind) { adhUpdate.adherence_selfAssessmentMind = aiData.adherence_selfAssessmentMind as AdherenceMindOption; updatedFieldsCount++; }
          if (aiData.adherence_priorityProblems && Array.isArray(aiData.adherence_priorityProblems)) {
              const problems = aiData.adherence_priorityProblems.filter(s => typeof s === 'string').slice(0,4);
              adhUpdate.adherence_priorityProblems = [...problems, ...Array(Math.max(0, 4 - problems.length)).fill('')];
              if(problems.length > 0) updatedFieldsCount++;
          } else { adhUpdate.adherence_priorityProblems = Array(4).fill('');}
          if (aiData.adherence_doctorAdviceCompliance) { adhUpdate.adherence_doctorAdviceCompliance = aiData.adherence_doctorAdviceCompliance as AdherenceComplianceOption; updatedFieldsCount++; }
          if (aiData.adherence_healthPromotionMethods && Array.isArray(aiData.adherence_healthPromotionMethods)) { 
              adhUpdate.adherence_healthPromotionMethods = aiData.adherence_healthPromotionMethods.filter(s=>typeof s === 'string'); 
              if(adhUpdate.adherence_healthPromotionMethods.length > 0) updatedFieldsCount++;
          }
          if (aiData.adherence_otherHealthPromotion) { 
              adhUpdate.adherence_otherHealthPromotion = aiData.adherence_otherHealthPromotion; 
              if(adhUpdate.adherence_otherHealthPromotion.trim() !== "" && adhUpdate.adherence_healthPromotionMethods && !adhUpdate.adherence_healthPromotionMethods.includes("其他")) {
                  adhUpdate.adherence_healthPromotionMethods = [...(adhUpdate.adherence_healthPromotionMethods || []), "其他"];
              }
              updatedFieldsCount++;
          }
          if (Object.keys(adhUpdate).length > 0) setAdherenceData(prev => ({...(prev || defaultAdherenceData), ...adhUpdate}));
          
          // Sleep
          const slpUpdate: Partial<SleepFormValues> = {};
          if (aiData.sleep_adequacy) { slpUpdate.sleep_adequacy = aiData.sleep_adequacy as SleepAdequacyOption; updatedFieldsCount++; }
          if (Object.keys(slpUpdate).length > 0) setSleepData(prev => ({...(prev || defaultSleepData), ...slpUpdate}));

          // Other Medications
          const omUpdate: Partial<OtherMedicationsFormValues> = {};
          if (aiData.otherInfo_medicationsUsed) { omUpdate.otherInfo_medicationsUsed = aiData.otherInfo_medicationsUsed; updatedFieldsCount++; }
          if (Object.keys(omUpdate).length > 0) setOtherMedicationsData(prev => ({...(prev || defaultOtherMedicationsData), ...omUpdate}));

          // Contact Preferences
          const cpUpdate: Partial<ContactPreferenceFormValues> = {};
          if (aiData.otherInfo_contactPreference_method) { cpUpdate.otherInfo_contactPreference_method = aiData.otherInfo_contactPreference_method as ContactPreferenceMethod | string; updatedFieldsCount++;}
          if (aiData.otherInfo_contactPreference_method_other) { cpUpdate.otherInfo_contactPreference_method_other = aiData.otherInfo_contactPreference_method_other; if(aiData.otherInfo_contactPreference_method_other.trim() !== "") updatedFieldsCount++;}
          if (aiData.otherInfo_contactPreference_frequency) { cpUpdate.otherInfo_contactPreference_frequency = aiData.otherInfo_contactPreference_frequency as ContactPreferenceFrequency | string; updatedFieldsCount++;}
          if (aiData.otherInfo_contactPreference_frequency_other) { cpUpdate.otherInfo_contactPreference_frequency_other = aiData.otherInfo_contactPreference_frequency_other; if(ai.otherInfo_contactPreference_frequency_other.trim() !== "") updatedFieldsCount++;}
          if (aiData.otherInfo_contactPreference_time) { cpUpdate.otherInfo_contactPreference_time = aiData.otherInfo_contactPreference_time as ContactPreferenceTime | string; updatedFieldsCount++;}
          if (aiData.otherInfo_contactPreference_time_other) { cpUpdate.otherInfo_contactPreference_time_other = aiData.otherInfo_contactPreference_time_other; if(ai.otherInfo_contactPreference_time_other.trim() !== "") updatedFieldsCount++;}
          if (Object.keys(cpUpdate).length > 0) setContactPreferenceData(prev => ({...(prev || defaultContactPreferenceData), ...cpUpdate}));
          
          // Suggestions
          const sugUpdate: Partial<SuggestionsFormValues> = {};
          if (aiData.otherInfo_suggestions) { sugUpdate.otherInfo_suggestions = aiData.otherInfo_suggestions; if(ai.otherInfo_suggestions.trim() !== "") updatedFieldsCount++;}
          if (Object.keys(sugUpdate).length > 0) setSuggestionsData(prev => ({...(prev || defaultSuggestionsData), ...sugUpdate}));

          // Service Satisfaction
          const satUpdate: Partial<ServiceSatisfactionFormValues> = {};
          if (aiData.otherInfo_serviceSatisfaction) { satUpdate.otherInfo_serviceSatisfaction = aiData.otherInfo_serviceSatisfaction as ServiceSatisfactionOption; updatedFieldsCount++;}
          if (Object.keys(satUpdate).length > 0) setServiceSatisfactionData(prev => ({...(prev || defaultServiceSatisfactionData), ...satUpdate}));


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
      setSelectedFile(null); 
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
       {/* AI File Upload Section - No longer sticky */}
      <Card className="shadow-sm bg-card">
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
            initialData={dietaryHabitsData}
            onSave={setDietaryHabitsData}
          />
        </TabsContent>

        <TabsContent value="dietaryIntake">
          <DietaryIntakeForm 
            initialData={dietaryIntakeData}
            onSave={setDietaryIntakeData}
          />
        </TabsContent>

        <TabsContent value="exercise">
          <ExerciseForm 
            initialData={exerciseData}
            onSave={setExerciseData}
          />
        </TabsContent>
        
        <TabsContent value="smokingStatus">
          <SmokingStatusForm
            initialData={smokingStatusData}
            onSave={setSmokingStatusData}
          />
        </TabsContent>
        
        <TabsContent value="drinkingStatus">
          <DrinkingStatusForm
            initialData={drinkingStatusData}
            onSave={setDrinkingStatusData}
          />
        </TabsContent>
        
        <TabsContent value="mentalHealth">
          <MentalHealthForm
            initialData={mentalHealthData || undefined} 
            onSave={setMentalHealthData} />
        </TabsContent>
        
         <TabsContent value="adherence">
           <AdherenceBehaviorForm 
            initialData={adherenceData || undefined}  
            onSave={setAdherenceData} />
        </TabsContent>

        <TabsContent value="sleep">
          <SleepForm 
            initialData={sleepData || undefined} 
            onSave={setSleepData} />
        </TabsContent>
        
        <TabsContent value="otherInfo">
            <OtherMedicationsForm 
                initialData={otherMedicationsData}
                onSave={setOtherMedicationsData}
            />
        </TabsContent>
        
        <TabsContent value="communication">
          <ContactPreferenceForm 
            initialData={contactPreferenceData || undefined}  
            onSave={setContactPreferenceData} />
        </TabsContent>
        
        <TabsContent value="suggestions">
          <SuggestionsForm 
            initialData={suggestionsData} 
            onSave={setSuggestionsData} />
        </TabsContent>

        <TabsContent value="serviceSatisfaction">
          <ServiceSatisfactionForm 
            initialData={serviceSatisfactionData || undefined} 
            onSave={setServiceSatisfactionData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

