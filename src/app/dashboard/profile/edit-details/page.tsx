
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
  { value: "otherInfo", label: "其他", icon: FileQuestion, componentKey: "otherInfo" }, // Grouped 'Other' items
  { value: "communication", label: "沟通偏好", icon: MessagesSquare, componentKey: "communication" },
  { value: "suggestions", label: "您的建议", icon: Lightbulb, componentKey: "suggestions" },
  { value: "serviceSatisfaction", label: "服务满意度", icon: ThumbsUp, componentKey: "serviceSatisfaction" },
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

        if (aiResponse) { // aiResponse is now ExtractProfileInfoOutput, not { output: ... }
          const aiData = aiResponse;
          let updatedFieldsCount = 0;

          // Basic Info
          const basicUpdate: Partial<BasicInfoFormValues> = {};
          if (aiData.name) { basicUpdate.name = aiData.name; updatedFieldsCount++; }
          if (aiData.gender) { basicUpdate.gender = aiData.gender; updatedFieldsCount++; }
          if (aiData.dob) { try { const d = parseISO(aiData.dob); if(isValid(d)) basicUpdate.dob = d; updatedFieldsCount++; } catch(e){} }
          if (aiData.address) { basicUpdate.address = aiData.address; updatedFieldsCount++; }
          if (typeof aiData.hadPreviousCheckup === 'boolean') { basicUpdate.hadPreviousCheckup = aiData.hadPreviousCheckup; updatedFieldsCount++; }
          if (typeof aiData.agreesToIntervention === 'boolean') { basicUpdate.agreesToIntervention = aiData.agreesToIntervention; updatedFieldsCount++; }
          if (aiData.contactPhone) { basicUpdate.contactPhone = aiData.contactPhone; updatedFieldsCount++; }
          if (aiData.contactEmail) { basicUpdate.contactEmail = aiData.contactEmail; updatedFieldsCount++; }
          if (aiData.bloodType) { basicUpdate.bloodType = aiData.bloodType; updatedFieldsCount++; }
          if (aiData.maritalStatus) { basicUpdate.maritalStatus = aiData.maritalStatus; updatedFieldsCount++; }
          if (aiData.occupation) { basicUpdate.occupation = aiData.occupation; updatedFieldsCount++; }
          if (aiData.educationLevel) { basicUpdate.educationLevel = aiData.educationLevel; updatedFieldsCount++; }
          if (aiData.recordNumber) { basicUpdate.recordNumber = aiData.recordNumber; updatedFieldsCount++; }
          if (aiData.admissionDate) { try { const d = parseISO(aiData.admissionDate); if(isValid(d)) basicUpdate.admissionDate = d; updatedFieldsCount++; } catch(e){} }
          if (aiData.recordDate) { try { const d = parseISO(aiData.recordDate); if(isValid(d)) basicUpdate.recordDate = d; updatedFieldsCount++; } catch(e){} }
          if (aiData.informant) { basicUpdate.informant = aiData.informant; updatedFieldsCount++; }
          if (aiData.reliability) { basicUpdate.reliability = aiData.reliability; updatedFieldsCount++; }
          if (Object.keys(basicUpdate).length > 0) setBasicInfoData(prev => ({ ...(prev || defaultBasicInfoData), ...basicUpdate }));
          
          // Family History
          if (aiData.familyMedicalHistory && Array.isArray(aiData.familyMedicalHistory)) {
            const processedFamilyHistory = aiData.familyMedicalHistory.map(entry => ({
              relative: entry.relative || 'self', // Default to 'self' if missing
              conditions: Array.isArray(entry.conditions) ? entry.conditions.filter(c => typeof c === 'string') : [],
            })).filter(entry => defaultFamilyHistoryData.some(dfh => dfh.relative === entry.relative));

            const mergedFamilyHistory = defaultFamilyHistoryData.map(defaultEntry => {
                const aiEntry = processedFamilyHistory.find(ae => ae.relative === defaultEntry.relative);
                if (aiEntry && aiEntry.conditions.length > 0) updatedFieldsCount++;
                return aiEntry ? { ...defaultEntry, conditions: aiEntry.conditions } : defaultEntry;
            });
            setFamilyHistoryData(mergedFamilyHistory);
          } else {
            setFamilyHistoryData(defaultFamilyHistoryData);
          }

          // Current Symptoms
          if (aiData.currentSymptoms && Array.isArray(aiData.currentSymptoms)) {
            const validSymptoms = aiData.currentSymptoms.filter(s => typeof s === 'string');
            if (validSymptoms.length > 0) updatedFieldsCount++;
            setCurrentSymptomsData(validSymptoms);
          } else { setCurrentSymptomsData(defaultCurrentSymptomsData); }

          // Allergies
          if (aiData.allergies && Array.isArray(aiData.allergies)) {
            const validAllergies = aiData.allergies.filter(a => typeof a === 'string');
            if (validAllergies.length > 0) updatedFieldsCount++;
            setAllergiesData(validAllergies);
             if (typeof aiData.otherAllergyText === 'string' && aiData.otherAllergyText.trim() !== "") {
              setOtherAllergyTextData(aiData.otherAllergyText);
              if (!validAllergies.includes("其他")) {
                setAllergiesData(prev => [...prev, "其他"]);
              }
              updatedFieldsCount++;
            } else {
              setOtherAllergyTextData(defaultOtherAllergyTextData);
            }
          } else {
            setAllergiesData(defaultAllergiesData);
            setOtherAllergyTextData(defaultOtherAllergyTextData);
          }

          // Operation History
          if (aiData.operationHistory && Array.isArray(aiData.operationHistory)) {
            const validOps = aiData.operationHistory.filter(op => typeof op === 'string');
            if (validOps.length > 0) updatedFieldsCount++;
            setOperationHistoryData(validOps);
          } else { setOperationHistoryData(defaultOperationHistoryData); }

          // Blood Transfusion
          if (typeof aiData.bloodTransfusionHistory === 'string') {
            setBloodTransfusionHistoryData(aiData.bloodTransfusionHistory);
            if(aiData.bloodTransfusionHistory.trim() !== "") updatedFieldsCount++;
          } else { setBloodTransfusionHistoryData(defaultBloodTransfusionHistoryData); }

          // Medication Categories
          if (aiData.medicationCategories && Array.isArray(aiData.medicationCategories)) {
            const validMedCats = aiData.medicationCategories.filter(mc => typeof mc === 'string');
            if (validMedCats.length > 0) updatedFieldsCount++;
            setMedicationCategoriesData(validMedCats);
          } else { setMedicationCategoriesData(defaultMedicationCategoriesData); }
          
          // Contact History
          if (aiData.contactHistory && Array.isArray(aiData.contactHistory)) {
            const validContacts = aiData.contactHistory.filter(ch => typeof ch === 'string');
            if (validContacts.length > 0) updatedFieldsCount++;
            setContactHistoryData(validContacts);
          } else { setContactHistoryData(defaultContactHistoryData); }
          
          // Dietary Habits
          const dietaryHabitsUpdate: Partial<DietaryHabitsFormValues> = {};
          if (aiData.dietaryHabits_breakfastDays) { dietaryHabitsUpdate.dietaryHabits_breakfastDays = aiData.dietaryHabits_breakfastDays; updatedFieldsCount++; }
          if (aiData.dietaryHabits_lateSnackDays) { dietaryHabitsUpdate.dietaryHabits_lateSnackDays = aiData.dietaryHabits_lateSnackDays; updatedFieldsCount++; }
          if (aiData.dietaryHabits_badHabits && Array.isArray(aiData.dietaryHabits_badHabits)) { dietaryHabitsUpdate.dietaryHabits_badHabits = aiData.dietaryHabits_badHabits.filter(s=>typeof s === 'string'); if(dietaryHabitsUpdate.dietaryHabits_badHabits.length > 0) updatedFieldsCount++;}
          if (aiData.dietaryHabits_preferences && Array.isArray(aiData.dietaryHabits_preferences)) { dietaryHabitsUpdate.dietaryHabits_preferences = aiData.dietaryHabits_preferences.filter(s=>typeof s === 'string'); if(dietaryHabitsUpdate.dietaryHabits_preferences.length > 0) updatedFieldsCount++;}
          if (aiData.dietaryHabits_foodTypePreferences && Array.isArray(aiData.dietaryHabits_foodTypePreferences)) { dietaryHabitsUpdate.dietaryHabits_foodTypePreferences = aiData.dietaryHabits_foodTypePreferences.filter(s=>typeof s === 'string'); if(dietaryHabitsUpdate.dietaryHabits_foodTypePreferences.length > 0)updatedFieldsCount++;}
          setDietaryHabitsData(prev => ({...(prev || defaultDietaryHabitsData), ...dietaryHabitsUpdate}));

          // Dietary Intake
          const dietaryIntakeUpdate: Partial<DietaryIntakeFormValues> = {};
          if (aiData.dietaryIntake_staple) { dietaryIntakeUpdate.dietaryIntake_staple = aiData.dietaryIntake_staple; updatedFieldsCount++; }
          if (aiData.dietaryIntake_meat) { dietaryIntakeUpdate.dietaryIntake_meat = aiData.dietaryIntake_meat; updatedFieldsCount++; }
          if (aiData.dietaryIntake_fish) { dietaryIntakeUpdate.dietaryIntake_fish = aiData.dietaryIntake_fish; updatedFieldsCount++; }
          if (aiData.dietaryIntake_eggs) { dietaryIntakeUpdate.dietaryIntake_eggs = aiData.dietaryIntake_eggs; updatedFieldsCount++; }
          if (aiData.dietaryIntake_dairy) { dietaryIntakeUpdate.dietaryIntake_dairy = aiData.dietaryIntake_dairy; updatedFieldsCount++; }
          if (aiData.dietaryIntake_soy) { dietaryIntakeUpdate.dietaryIntake_soy = aiData.dietaryIntake_soy; updatedFieldsCount++; }
          if (aiData.dietaryIntake_vegetables) { dietaryIntakeUpdate.dietaryIntake_vegetables = aiData.dietaryIntake_vegetables; updatedFieldsCount++; }
          if (aiData.dietaryIntake_fruits) { dietaryIntakeUpdate.dietaryIntake_fruits = aiData.dietaryIntake_fruits; updatedFieldsCount++; }
          if (aiData.dietaryIntake_water) { dietaryIntakeUpdate.dietaryIntake_water = aiData.dietaryIntake_water; updatedFieldsCount++; }
          setDietaryIntakeData(prev => ({...(prev || defaultDietaryIntakeData), ...dietaryIntakeUpdate}));

          // Exercise
          const exerciseUpdate: Partial<ExerciseFormValues> = {};
          if (aiData.exercise_workHours) { exerciseUpdate.exercise_workHours = aiData.exercise_workHours; updatedFieldsCount++; }
          if (aiData.exercise_sedentaryHours) { exerciseUpdate.exercise_sedentaryHours = aiData.exercise_sedentaryHours; updatedFieldsCount++; }
          if (aiData.exercise_weeklyFrequency) { exerciseUpdate.exercise_weeklyFrequency = aiData.exercise_weeklyFrequency; updatedFieldsCount++; }
          if (aiData.exercise_durationPerSession) { exerciseUpdate.exercise_durationPerSession = aiData.exercise_durationPerSession; updatedFieldsCount++; }
          if (aiData.exercise_intensity) { exerciseUpdate.exercise_intensity = aiData.exercise_intensity; updatedFieldsCount++; }
          setExerciseData(prev => ({...(prev || defaultExerciseData), ...exerciseUpdate}));
          
          // Smoking Status
          const smokingUpdate: Partial<SmokingStatusFormValues> = {};
          if (aiData.smoking_status) { smokingUpdate.smoking_status = aiData.smoking_status; updatedFieldsCount++; }
          if (aiData.smoking_status === '吸烟' || aiData.smoking_status === '戒烟') {
              if (aiData.smoking_cigarettesPerDay) { smokingUpdate.smoking_cigarettesPerDay = aiData.smoking_cigarettesPerDay; updatedFieldsCount++; }
              if (aiData.smoking_years) { smokingUpdate.smoking_years = aiData.smoking_years; updatedFieldsCount++; }
          }
          if (aiData.smoking_passiveDays) { smokingUpdate.smoking_passiveDays = aiData.smoking_passiveDays; updatedFieldsCount++; }
          setSmokingStatusData(prev => ({...(prev || defaultSmokingStatusData), ...smokingUpdate}));

          // Drinking Status
          const drinkingUpdate: Partial<DrinkingStatusFormValues> = {};
          if (aiData.drinking_status) { drinkingUpdate.drinking_status = aiData.drinking_status; updatedFieldsCount++; }
          if (aiData.drinking_status === '饮酒' || aiData.drinking_status === '戒酒') {
            if (aiData.drinking_type) { drinkingUpdate.drinking_type = aiData.drinking_type; updatedFieldsCount++; }
            if (aiData.drinking_type === '其他' && aiData.drinking_type_other) { drinkingUpdate.drinking_type_other = aiData.drinking_type_other; updatedFieldsCount++;}
            if (aiData.drinking_amountPerDay) { drinkingUpdate.drinking_amountPerDay = aiData.drinking_amountPerDay; updatedFieldsCount++; }
            if (aiData.drinking_years) { drinkingUpdate.drinking_years = aiData.drinking_years; updatedFieldsCount++; }
          }
          setDrinkingStatusData(prev => ({...(prev || defaultDrinkingStatusData), ...drinkingUpdate}));
          
          // Mental Health
          const mentalHealthUpdate: Partial<MentalHealthFormValues> = {};
          if (aiData.mentalHealth_majorEvents) { mentalHealthUpdate.mentalHealth_majorEvents = aiData.mentalHealth_majorEvents; updatedFieldsCount++; }
          if (aiData.mentalHealth_impactOnLife) { mentalHealthUpdate.mentalHealth_impactOnLife = aiData.mentalHealth_impactOnLife; updatedFieldsCount++; }
          if (aiData.mentalHealth_stressLevel) { mentalHealthUpdate.mentalHealth_stressLevel = aiData.mentalHealth_stressLevel; updatedFieldsCount++; }
          const sasKeys = Object.keys(aiData).filter(k => k.startsWith('mentalHealth_sas_')) as (keyof ExtractProfileInfoOutput)[];
          sasKeys.forEach(key => {
            if (aiData[key] && typeof aiData[key] === 'string') { // Ensure value is a string
                (mentalHealthUpdate as any)[key] = aiData[key] as SASOption; // Type assertion
                updatedFieldsCount++;
            }
          });
          if (Object.keys(mentalHealthUpdate).length > 0) {
              setMentalHealthData(prev => ({...(prev || defaultMentalHealthData), ...mentalHealthUpdate}));
          }
          
          // Adherence Behavior
          const adherenceUpdate: Partial<AdherenceBehaviorFormValues> = {};
          if (aiData.adherence_selfAssessmentBody) { adherenceUpdate.adherence_selfAssessmentBody = aiData.adherence_selfAssessmentBody; updatedFieldsCount++; }
          if (aiData.adherence_selfAssessmentMind) { adherenceUpdate.adherence_selfAssessmentMind = aiData.adherence_selfAssessmentMind; updatedFieldsCount++; }
          if (aiData.adherence_priorityProblems && Array.isArray(aiData.adherence_priorityProblems)) {
              const problems = aiData.adherence_priorityProblems.filter(s => typeof s === 'string').slice(0,4);
              adherenceUpdate.adherence_priorityProblems = [...problems, ...Array(Math.max(0, 4 - problems.length)).fill('')];
              if(problems.length > 0) updatedFieldsCount++;
          } else {
              adherenceUpdate.adherence_priorityProblems = Array(4).fill('');
          }
          if (aiData.adherence_doctorAdviceCompliance) { adherenceUpdate.adherence_doctorAdviceCompliance = aiData.adherence_doctorAdviceCompliance; updatedFieldsCount++; }
          if (aiData.adherence_healthPromotionMethods && Array.isArray(aiData.adherence_healthPromotionMethods)) { 
              adherenceUpdate.adherence_healthPromotionMethods = aiData.adherence_healthPromotionMethods.filter(s=>typeof s === 'string'); 
              if(adherenceUpdate.adherence_healthPromotionMethods.length > 0) updatedFieldsCount++;
          }
          if (aiData.adherence_otherHealthPromotion) { 
              adherenceUpdate.adherence_otherHealthPromotion = aiData.adherence_otherHealthPromotion; 
              if(adherenceUpdate.adherence_otherHealthPromotion.trim() !== "" && adherenceUpdate.adherence_healthPromotionMethods && !adherenceUpdate.adherence_healthPromotionMethods.includes("其他")) {
                  adherenceUpdate.adherence_healthPromotionMethods = [...(adherenceUpdate.adherence_healthPromotionMethods || []), "其他"];
              }
              updatedFieldsCount++;
          }
          if (Object.keys(adherenceUpdate).length > 0) {
              setAdherenceData(prev => ({...(prev || defaultAdherenceData), ...adherenceUpdate}));
          }
          
          // Sleep
          const sleepUpdate: Partial<SleepFormValues> = {};
          if (aiData.sleep_adequacy) { sleepUpdate.sleep_adequacy = aiData.sleep_adequacy; updatedFieldsCount++; }
          if (Object.keys(sleepUpdate).length > 0) {
            setSleepData(prev => ({...(prev || defaultSleepData), ...sleepUpdate}));
          }

          // Other Medications
          const otherMedsUpdate: Partial<OtherMedicationsFormValues> = {};
          if (aiData.otherInfo_medicationsUsed) { otherMedsUpdate.otherInfo_medicationsUsed = aiData.otherInfo_medicationsUsed; updatedFieldsCount++; }
          if (Object.keys(otherMedsUpdate).length > 0) {
              setOtherMedicationsData(prev => ({...(prev || defaultOtherMedicationsData), ...otherMedsUpdate}));
          }

          // Contact Preferences
          const contactPrefUpdate: Partial<ContactPreferenceFormValues> = {};
          if (aiData.otherInfo_contactPreference_method) { contactPrefUpdate.otherInfo_contactPreference_method = aiData.otherInfo_contactPreference_method; updatedFieldsCount++;}
          if (aiData.otherInfo_contactPreference_method_other) { contactPrefUpdate.otherInfo_contactPreference_method_other = aiData.otherInfo_contactPreference_method_other; if(aiData.otherInfo_contactPreference_method_other.trim() !== "") updatedFieldsCount++;}
          if (aiData.otherInfo_contactPreference_frequency) { contactPrefUpdate.otherInfo_contactPreference_frequency = aiData.otherInfo_contactPreference_frequency; updatedFieldsCount++;}
          if (aiData.otherInfo_contactPreference_frequency_other) { contactPrefUpdate.otherInfo_contactPreference_frequency_other = aiData.otherInfo_contactPreference_frequency_other; if(aiData.otherInfo_contactPreference_frequency_other.trim() !== "") updatedFieldsCount++;}
          if (aiData.otherInfo_contactPreference_time) { contactPrefUpdate.otherInfo_contactPreference_time = aiData.otherInfo_contactPreference_time; updatedFieldsCount++;}
          if (aiData.otherInfo_contactPreference_time_other) { contactPrefUpdate.otherInfo_contactPreference_time_other = aiData.otherInfo_contactPreference_time_other; if(aiData.otherInfo_contactPreference_time_other.trim() !== "") updatedFieldsCount++;}
          if (Object.keys(contactPrefUpdate).length > 0) {
            setContactPreferenceData(prev => ({...(prev || defaultContactPreferenceData), ...contactPrefUpdate}));
          }
          
          // Suggestions
          const suggestionsUpdate: Partial<SuggestionsFormValues> = {};
          if (aiData.otherInfo_suggestions) { suggestionsUpdate.otherInfo_suggestions = aiData.otherInfo_suggestions; if(aiData.otherInfo_suggestions.trim() !== "") updatedFieldsCount++;}
          if (Object.keys(suggestionsUpdate).length > 0) {
            setSuggestionsData(prev => ({...(prev || defaultSuggestionsData), ...suggestionsUpdate}));
          }

          // Service Satisfaction
          const satisfactionUpdate: Partial<ServiceSatisfactionFormValues> = {};
          if (aiData.otherInfo_serviceSatisfaction) { satisfactionUpdate.otherInfo_serviceSatisfaction = aiData.otherInfo_serviceSatisfaction; updatedFieldsCount++;}
          if (Object.keys(satisfactionUpdate).length > 0) {
            setServiceSatisfactionData(prev => ({...(prev || defaultServiceSatisfactionData), ...satisfactionUpdate}));
          }
          
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
            initialData={mentalHealthData || undefined} // Pass undefined if null
            onSave={setMentalHealthData} />
        </TabsContent>
        
        <TabsContent value="adherence">
           <AdherenceBehaviorForm 
            initialData={adherenceData || undefined}  // Pass undefined if null
            onSave={setAdherenceData} />
        </TabsContent>

        <TabsContent value="sleep">
          <SleepForm 
            initialData={sleepData || undefined} // Pass undefined if null
            onSave={setSleepData} />
        </TabsContent>
        
         <TabsContent value="otherInfo">
             {renderPlaceholderContent("其他个人信息", FileQuestion)}
             {/* Example: If OtherMedicationsForm was meant to be here standalone */}
             {/* <OtherMedicationsForm initialData={otherMedicationsData} onSave={setOtherMedicationsData} /> */}
        </TabsContent>
        
        <TabsContent value="communication">
          <ContactPreferenceForm 
            initialData={contactPreferenceData || undefined}  // Pass undefined if null
            onSave={setContactPreferenceData} />
        </TabsContent>
        
        <TabsContent value="suggestions">
          <SuggestionsForm 
            initialData={suggestionsData} 
            onSave={setSuggestionsData} />
        </TabsContent>

        <TabsContent value="serviceSatisfaction">
          <ServiceSatisfactionForm 
            initialData={serviceSatisfactionData || undefined} // Pass undefined if null
            onSave={setServiceSatisfactionData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
  
