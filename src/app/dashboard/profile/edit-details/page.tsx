
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Corrected: Ensure Card components are imported
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  UserCircle, HandHeart, Activity, Ban, Drama, Droplets, Pill, Apple, 
  CookingPot, Dumbbell, Cigarette, Wine, Brain, CheckSquare, Bed, Info, 
  MessagesSquare, Lightbulb, ThumbsUp, ChevronLeft, ChevronRight, 
  Wind, MessageCircleQuestion, NotebookText, HelpCircle, Cog, ShieldQuestion, SprayCan
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

import { BasicInfoForm } from "@/components/profile/BasicInfoForm";
import { FamilyHistoryEditor } from "@/components/profile/FamilyHistoryEditor";
import { CurrentSymptomsForm } from "@/components/profile/CurrentSymptomsForm";
import { AllergyForm } from "@/components/profile/AllergyForm";
import { OperationHistoryForm } from "@/components/profile/OperationHistoryForm";
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


import type { UserProfile, FamilyMedicalHistoryEntry } from "@/lib/types";


const tabItems = [
    { value: "basicInfo", label: "基本信息", icon: UserCircle },
    { value: "familyHistory", label: "家族病史", icon: HandHeart },
    { value: "currentSymptoms", label: "现有症状", icon: Activity },
    { value: "allergies", label: "过敏史", icon: Ban },
    { value: "operationHistory", label: "手术史", icon: Drama }, 
    { value: "bloodTransfusion", label: "输血史", icon: Droplets },
    { value: "medicationHistory", label: "用药史", icon: Pill },
    { value: "contactHistory", label: "接触史", icon: Wind }, 
    { value: "dietaryHabits", label: "饮食习惯", icon: Apple },
    { value: "dietaryIntake", label: "膳食摄入", icon: CookingPot }, 
    { value: "exercise", label: "运动锻炼", icon: Dumbbell },
    { value: "smokingStatus", label: "吸烟情况", icon: Cigarette },
    { value: "drinkingStatus", label: "饮酒情况", icon: Wine },
    { value: "mentalHealth", label: "心理健康", icon: Brain },
    { value: "adherence", label: "遵医行为", icon: CheckSquare },
    { value: "sleep", label: "睡眠", icon: Bed },
    { value: "other", label: "其他", icon: Info }, // For medications used
    { value: "communication", label: "沟通进展", icon: MessagesSquare }, // For contact preferences
    { value: "suggestions", label: "您的建议", icon: Lightbulb },
    { value: "serviceSatisfaction", label: "服务满意度", icon: ThumbsUp },
  ];

// Mock data for various profile sections
const mockUserProfileData: Partial<Pick<UserProfile, 
  'familyMedicalHistory' | 'currentSymptoms' | 'allergies' | 'otherAllergyText' | 
  'operationHistory' | 'bloodTransfusionHistory' | 'medicationCategories' | 'contactHistory' |
  'dietaryHabits_breakfastDays' | 'dietaryHabits_lateSnackDays' | 'dietaryHabits_badHabits' | 
  'dietaryHabits_preferences' | 'dietaryHabits_foodTypePreferences' |
  'dietaryIntake_staple' | 'dietaryIntake_meat' | 'dietaryIntake_fish' | 'dietaryIntake_eggs' |
  'dietaryIntake_dairy' | 'dietaryIntake_soy' | 'dietaryIntake_vegetables' | 'dietaryIntake_fruits' | 'dietaryIntake_water' |
  'exercise_workHours' | 'exercise_sedentaryHours' | 'exercise_weeklyFrequency' | 'exercise_durationPerSession' | 'exercise_intensity' |
  'smoking_status' | 'smoking_cigarettesPerDay' | 'smoking_years' | 'smoking_passiveDays' |
  'drinking_status' | 'drinking_type' | 'drinking_type_other' | 'drinking_amountPerDay' | 'drinking_years' |
  'mentalHealth_majorEvents' | 'mentalHealth_impactOnLife' | 'mentalHealth_stressLevel' | 
  'mentalHealth_sas_anxiety' | 'mentalHealth_sas_fear' | 'mentalHealth_sas_panic' | 'mentalHealth_sas_goingCrazy' | 
  'mentalHealth_sas_misfortune' | 'mentalHealth_sas_trembling' | 'mentalHealth_sas_bodyPain' | 'mentalHealth_sas_fatigue' |
  'mentalHealth_sas_restlessness' | 'mentalHealth_sas_palpitations' | 'mentalHealth_sas_dizziness' | 'mentalHealth_sas_fainting' |
  'mentalHealth_sas_breathingDifficulty' | 'mentalHealth_sas_paresthesia' | 'mentalHealth_sas_stomachPain' | 'mentalHealth_sas_frequentUrination' |
  'mentalHealth_sas_sweating' |
  'adherence_selfAssessmentBody' | 'adherence_selfAssessmentMind' | 'adherence_priorityProblems' | 'adherence_doctorAdviceCompliance' |
  'adherence_healthPromotionMethods' | 'adherence_otherHealthPromotion' |
  'sleep_adequacy' |
  'otherInfo_medicationsUsed' | 'otherInfo_contactPreference_method' | 'otherInfo_contactPreference_method_other' |
  'otherInfo_contactPreference_frequency' | 'otherInfo_contactPreference_frequency_other' | 'otherInfo_contactPreference_time' |
  'otherInfo_contactPreference_time_other' | 'otherInfo_suggestions' | 'otherInfo_serviceSatisfaction'
>> = {
  familyMedicalHistory: [
    { relative: "self", conditions: ["高血压"] },
    { relative: "father", conditions: ["糖尿病", "高血压"] },
    { relative: "mother", conditions: [] }, { relative: "paternal_grandparents", conditions: [] }, { relative: "maternal_grandparents", conditions: [] },
  ],
  currentSymptoms: ["头晕", "心慌"], 
  allergies: ["青霉素", "其他"],
  otherAllergyText: "芒果",
  operationHistory: ["心脏（含心脏介入）"], 
  bloodTransfusionHistory: "2005年因车祸输血400ml，无不良反应。",
  medicationCategories: ["降压药", "降糖药"],
  contactHistory: ["油烟", "粉烟尘"],
  dietaryHabits_breakfastDays: "7天",
  dietaryHabits_lateSnackDays: "1-2天",
  dietaryHabits_badHabits: ["吃饭过快"],
  dietaryHabits_preferences: ["咸", "辣"],
  dietaryHabits_foodTypePreferences: ["油炸食品"],
  dietaryIntake_staple: '2-4碗', dietaryIntake_meat: '1-2两', dietaryIntake_fish: '<1两', dietaryIntake_eggs: '1-2个',
  dietaryIntake_dairy: '1-2杯', dietaryIntake_soy: '0.5-1两', dietaryIntake_vegetables: '6-10两', dietaryIntake_fruits: '1-4两', dietaryIntake_water: '6-9杯',
  exercise_workHours: '5-8小时', exercise_sedentaryHours: '5-8小时', exercise_weeklyFrequency: '偶尔（1-2次/周）',
  exercise_durationPerSession: '30-60分钟', exercise_intensity: '中度运动',
  smoking_status: '从不', smoking_passiveDays: '没有',
  drinking_status: '偶尔', drinking_type: '啤酒', drinking_amountPerDay: '<2两', drinking_years: '<5年',
  mentalHealth_majorEvents: "否", mentalHealth_impactOnLife: "有一点", mentalHealth_stressLevel: "较明显",
  mentalHealth_sas_anxiety: "小部分时间有", // ... and so on for all SAS questions
  adherence_selfAssessmentBody: "满意", adherence_selfAssessmentMind: "还算关心",
  adherence_priorityProblems: ["控制血糖", "改善睡眠"], adherence_doctorAdviceCompliance: "执行一部分",
  adherence_healthPromotionMethods: ["改变饮食习惯", "药物"],
  sleep_adequacy: "一般",
  otherInfo_medicationsUsed: "阿司匹林 100mg QD",
  otherInfo_contactPreference_method: "微信", otherInfo_contactPreference_frequency: "每周一次", otherInfo_contactPreference_time: "下午",
  otherInfo_suggestions: "希望增加更多菜谱推荐。", otherInfo_serviceSatisfaction: "较好",
};


const renderPlaceholderContent = (title: string, Icon?: LucideIcon) => (
    <Card className="shadow-sm mt-4">
      <CardHeader className="p-4">
        <CardTitle className="text-base flex items-center">
          {Icon && <Icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          {title}
        </CardTitle>
        <CardDescription className="text-xs">此模块用于记录您的 {title.toLowerCase()} 相关信息。</CardDescription>
      </CardHeader>
      <CardContent className="p-4 text-center text-muted-foreground">
        <p className="mb-2 text-sm">"{title}" 功能正在建设中。</p>
        <p className="text-xs">相关的表单字段和交互逻辑将在此处实现。</p>
      </CardContent>
    </Card>
  );

export default function EditProfileDetailsPage() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const SCROLL_AMOUNT = 200;
  const { toast } = useToast();

  // States for each form section - using Partial for flexibility during development
  const [familyHistoryData, setFamilyHistoryData] = React.useState<FamilyMedicalHistoryEntry[]>(mockUserProfileData.familyMedicalHistory || []);
  const [currentSymptomsData, setCurrentSymptomsData] = React.useState<string[]>(mockUserProfileData.currentSymptoms || []);
  const [allergiesData, setAllergiesData] = React.useState<string[]>(mockUserProfileData.allergies || []);
  const [otherAllergyTextData, setOtherAllergyTextData] = React.useState<string>(mockUserProfileData.otherAllergyText || "");
  const [operationHistoryData, setOperationHistoryData] = React.useState<string[]>(mockUserProfileData.operationHistory || []);
  const [bloodTransfusionHistoryData, setBloodTransfusionHistoryData] = React.useState<string>(mockUserProfileData.bloodTransfusionHistory || "");
  const [medicationCategoriesData, setMedicationCategoriesData] = React.useState<string[]>(mockUserProfileData.medicationCategories || []);
  const [contactHistoryData, setContactHistoryData] = React.useState<string[]>(mockUserProfileData.contactHistory || []);
  const [dietaryHabitsData, setDietaryHabitsData] = React.useState<DietaryHabitsFormValues>(mockUserProfileData as DietaryHabitsFormValues);
  const [dietaryIntakeData, setDietaryIntakeData] = React.useState<DietaryIntakeFormValues>(mockUserProfileData as DietaryIntakeFormValues);
  const [exerciseData, setExerciseData] = React.useState<ExerciseFormValues>(mockUserProfileData as ExerciseFormValues);
  const [smokingStatusData, setSmokingStatusData] = React.useState<SmokingStatusFormValues>(mockUserProfileData as SmokingStatusFormValues);
  const [drinkingStatusData, setDrinkingStatusData] = React.useState<DrinkingStatusFormValues>(mockUserProfileData as DrinkingStatusFormValues);
  const [mentalHealthData, setMentalHealthData] = React.useState<MentalHealthFormValues>(mockUserProfileData as MentalHealthFormValues);
  const [adherenceData, setAdherenceData] = React.useState<AdherenceBehaviorFormValues>(mockUserProfileData as AdherenceBehaviorFormValues);
  const [sleepData, setSleepData] = React.useState<SleepFormValues>(mockUserProfileData as SleepFormValues);
  const [otherMedicationsData, setOtherMedicationsData] = React.useState<OtherMedicationsFormValues>({otherInfo_medicationsUsed: mockUserProfileData.otherInfo_medicationsUsed || ""});
  const [contactPreferenceData, setContactPreferenceData] = React.useState<ContactPreferenceFormValues>({
    otherInfo_contactPreference_method: mockUserProfileData.otherInfo_contactPreference_method,
    otherInfo_contactPreference_method_other: mockUserProfileData.otherInfo_contactPreference_method_other,
    otherInfo_contactPreference_frequency: mockUserProfileData.otherInfo_contactPreference_frequency,
    otherInfo_contactPreference_frequency_other: mockUserProfileData.otherInfo_contactPreference_frequency_other,
    otherInfo_contactPreference_time: mockUserProfileData.otherInfo_contactPreference_time,
    otherInfo_contactPreference_time_other: mockUserProfileData.otherInfo_contactPreference_time_other,
  });
  const [suggestionsData, setSuggestionsData] = React.useState<SuggestionsFormValues>({otherInfo_suggestions: mockUserProfileData.otherInfo_suggestions || ""});
  const [serviceSatisfactionData, setServiceSatisfactionData] = React.useState<ServiceSatisfactionFormValues>({otherInfo_serviceSatisfaction: mockUserProfileData.otherInfo_serviceSatisfaction});

  const handleSaveFamilyHistory = (data: FamilyMedicalHistoryEntry[]) => {
    setFamilyHistoryData(data); 
    toast({ title: "家族病史已保存", description: "您的家族病史信息已在编辑页面更新。" });
  };

  const handleSaveCurrentSymptoms = (symptoms: string[]) => {
    setCurrentSymptomsData(symptoms);
     toast({ title: "症状信息已保存", description: "您的现有不适症状已更新。" });
  };

  const handleSaveAllergies = (data: { allergies?: string[]; otherAllergyText?: string }) => {
    setAllergiesData(data.allergies || []);
    setOtherAllergyTextData(data.otherAllergyText || "");
     toast({ title: "过敏史已保存", description: "您的过敏史信息已更新。" });
  };

  const handleSaveOperationHistory = (operations: string[]) => {
    setOperationHistoryData(operations);
    toast({ title: "手术史已保存", description: "您的手术史信息已更新。" });
  };

  const handleSaveBloodTransfusionHistory = (historyText?: string) => {
    setBloodTransfusionHistoryData(historyText || "");
    toast({ title: "输血史已保存", description: "您的输血史信息已更新。" });
  };
  
  const handleSaveMedicationCategories = (categories: string[]) => {
    setMedicationCategoriesData(categories);
    toast({ title: "用药史已保存", description: "您的用药史（类别）信息已更新。" });
  };

  const handleSaveContactHistory = (history: string[]) => {
    setContactHistoryData(history);
    toast({ title: "接触史已保存", description: "您的接触史信息已更新。" });
  };

  const handleSaveDietaryHabits = (data: DietaryHabitsFormValues) => {
    setDietaryHabitsData(data);
    toast({ title: "饮食习惯已保存", description: "您的饮食习惯信息已更新。" });
  };

  const handleSaveDietaryIntake = (data: DietaryIntakeFormValues) => {
    setDietaryIntakeData(data);
    toast({ title: "膳食摄入已保存", description: "您的膳食摄入信息已更新。" });
  };

  const handleSaveExerciseData = (data: ExerciseFormValues) => { 
    setExerciseData(data);
    toast({ title: "运动锻炼信息已保存", description: "您的运动锻炼信息已更新。" });
  };

  const handleSaveSmokingStatus = (data: SmokingStatusFormValues) => {
    setSmokingStatusData(data);
    toast({ title: "吸烟情况已保存", description: "您的吸烟情况信息已更新。" });
  };
  
  const handleSaveDrinkingStatus = (data: DrinkingStatusFormValues) => {
    setDrinkingStatusData(data);
    toast({ title: "饮酒情况已保存", description: "您的饮酒情况信息已更新。" });
  };

  const handleSaveMentalHealth = (data: MentalHealthFormValues) => {
    setMentalHealthData(data);
    toast({ title: "心理健康信息已保存", description: "您的心理健康评估数据已更新。" });
  };
  
  const handleSaveAdherenceBehavior = (data: AdherenceBehaviorFormValues) => {
    setAdherenceData(data);
    toast({ title: "遵医行为信息已保存", description: "您的遵医行为信息已更新。" });
  };

  const handleSaveSleep = (data: SleepFormValues) => {
    setSleepData(data);
    toast({ title: "睡眠信息已保存", description: "您的睡眠信息已更新。" });
  };

  const handleSaveOtherMedications = (data: OtherMedicationsFormValues) => {
    setOtherMedicationsData(data);
    toast({ title: "其他药物信息已保存", description: "您的药物使用信息已更新。" });
  };
  const handleSaveContactPreferences = (data: ContactPreferenceFormValues) => {
    setContactPreferenceData(data);
    toast({ title: "联系偏好已保存", description: "您的联系偏好设置已更新。" });
  };
  const handleSaveSuggestions = (data: SuggestionsFormValues) => {
    setSuggestionsData(data);
    toast({ title: "建议已保存", description: "您对本中心的建议已提交。" });
  };
  
  const handleSaveServiceSatisfaction = (data: ServiceSatisfactionFormValues) => {
    setServiceSatisfactionData(data);
    toast({ title: "服务满意度已保存", description: "感谢您的评价。" });
  };


  const checkScrollability = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 5); 
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  React.useEffect(() => {
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
    <div className="space-y-6">
      <Tabs defaultValue="basicInfo" className="w-full">
        <div className="relative flex items-center group">
           <Button
            variant="ghost"
            size="icon"
            onClick={() => handleScrollClick('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/70 p-0 shadow-md hover:bg-muted transition-opacity duration-200 
              ${canScrollLeft ? 'opacity-75 hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
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
              ${canScrollRight ? 'opacity-75 hover:opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-label="Scroll right"
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <TabsContent value="basicInfo">
          <BasicInfoForm />
        </TabsContent>
        
        <TabsContent value="familyHistory">
           <FamilyHistoryEditor initialData={familyHistoryData} onSave={handleSaveFamilyHistory} />
        </TabsContent>

        <TabsContent value="currentSymptoms">
          <CurrentSymptomsForm initialSymptoms={currentSymptomsData} onSave={handleSaveCurrentSymptoms} />
        </TabsContent>

        <TabsContent value="allergies">
          <AllergyForm 
            initialAllergies={allergiesData} 
            initialOtherAllergyText={otherAllergyTextData}
            onSave={handleSaveAllergies} 
          />
        </TabsContent>

        <TabsContent value="operationHistory">
          <OperationHistoryForm 
            initialOperationHistory={operationHistoryData} 
            onSave={handleSaveOperationHistory} 
          />
        </TabsContent>

        <TabsContent value="bloodTransfusion">
          <BloodTransfusionForm 
            initialHistoryText={bloodTransfusionHistoryData}
            onSave={handleSaveBloodTransfusionHistory}
          />
        </TabsContent>

        <TabsContent value="medicationHistory">
          <MedicationCategoryForm 
            initialMedicationCategories={medicationCategoriesData}
            onSave={handleSaveMedicationCategories}
          />
        </TabsContent>
        
        <TabsContent value="contactHistory">
          <ContactHistoryForm 
            initialContactHistory={contactHistoryData}
            onSave={handleSaveContactHistory}
          />
        </TabsContent>
        
        <TabsContent value="dietaryHabits">
          <DietaryHabitsForm 
            initialData={dietaryHabitsData}
            onSave={handleSaveDietaryHabits}
          />
        </TabsContent>

        <TabsContent value="dietaryIntake">
          <DietaryIntakeForm 
            initialData={dietaryIntakeData}
            onSave={handleSaveDietaryIntake}
          />
        </TabsContent>

        <TabsContent value="exercise">
          <ExerciseForm 
            initialData={exerciseData}
            onSave={handleSaveExerciseData}
          />
        </TabsContent>
        
        <TabsContent value="smokingStatus">
          <SmokingStatusForm
            initialData={smokingStatusData}
            onSave={handleSaveSmokingStatus}
          />
        </TabsContent>
        
        <TabsContent value="drinkingStatus">
          <DrinkingStatusForm
            initialData={drinkingStatusData}
            onSave={handleSaveDrinkingStatus}
          />
        </TabsContent>
        
        <TabsContent value="mentalHealth">
          <MentalHealthForm
            initialData={mentalHealthData}
            onSave={handleSaveMentalHealth}
          />
        </TabsContent>
        
        <TabsContent value="adherence">
           <AdherenceBehaviorForm initialData={adherenceData} onSave={handleSaveAdherenceBehavior} />
        </TabsContent>

        <TabsContent value="sleep">
          <SleepForm initialData={sleepData} onSave={handleSaveSleep} />
        </TabsContent>

        <TabsContent value="other">
          <OtherMedicationsForm initialData={otherMedicationsData} onSave={handleSaveOtherMedications} />
        </TabsContent>
        
        <TabsContent value="communication">
          <ContactPreferenceForm initialData={contactPreferenceData} onSave={handleSaveContactPreferences} />
        </TabsContent>
        
        <TabsContent value="suggestions">
          <SuggestionsForm initialData={suggestionsData} onSave={handleSaveSuggestions} />
        </TabsContent>

        <TabsContent value="serviceSatisfaction">
          <ServiceSatisfactionForm initialData={serviceSatisfactionData} onSave={handleSaveServiceSatisfaction} />
        </TabsContent>
        
      </Tabs>
    </div>
  );
}
