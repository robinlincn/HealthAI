
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Ensure this is at the top
import { BasicInfoForm } from "@/components/profile/BasicInfoForm";
import { EmergencyContacts } from "@/components/profile/EmergencyContacts";
import { FamilyHistoryEditor } from "@/components/profile/FamilyHistoryEditor";
import { CurrentSymptomsForm } from "@/components/profile/CurrentSymptomsForm";
import { AllergyForm } from "@/components/profile/AllergyForm";
import { OperationHistoryForm } from "@/components/profile/OperationHistoryForm";
import { BloodTransfusionForm } from "@/components/profile/BloodTransfusionForm";
import { MedicationCategoryForm } from "@/components/profile/MedicationCategoryForm";
import { ContactHistoryForm } from '@/components/profile/ContactHistoryForm';
import { DietaryHabitsForm, type DietaryHabitsFormValues } from '@/components/profile/DietaryHabitsForm';
import { DietaryIntakeForm, type DietaryIntakeFormValues } from '@/components/profile/DietaryIntakeForm';
import { ExerciseForm, type ExerciseFormValues } from '@/components/profile/ExerciseForm';
import { SmokingStatusForm, type SmokingStatusFormValues } from '@/components/profile/SmokingStatusForm';
import { DrinkingStatusForm, type DrinkingStatusFormValues } from '@/components/profile/DrinkingStatusForm';
import { MentalHealthForm, type MentalHealthFormValues } from '@/components/profile/MentalHealthForm';


import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  UserCircle, HandHeart, Activity, Ban, Drama, Droplets, Pill, Apple, 
  CookingPot, Dumbbell, Cigarette, Wine, Brain, CheckSquare, Bed, Info, 
  MessagesSquare, Lightbulb, ThumbsUp, ChevronLeft, ChevronRight, 
  ScrollText, ListChecks, MessageCircleQuestion, NotebookText, HelpCircle, Cog, Wind, ShieldQuestion, SprayCan
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import type { FamilyMedicalHistoryEntry, UserProfile, FrequencyOption, DietaryIntakeOption, ExerciseWorkHoursOption, ExerciseWeeklyFrequencyOption, ExerciseDurationOption, ExerciseIntensityOption, SmokingStatusOption, DrinkingStatusOption, AlcoholTypeOption, SASOption, AdherenceBodyOption, AdherenceMindOption, AdherenceComplianceOption, SleepAdequacyOption, ContactPreferenceMethod, ContactPreferenceFrequency, ContactPreferenceTime, ServiceSatisfactionOption, LucideIcon, YesNoOption, ImpactLevelOption } from "@/lib/types"; 

// Mock data for various profile sections
const mockFamilyHistory: FamilyMedicalHistoryEntry[] = [
  { relative: "self", conditions: ["高血压"] },
  { relative: "father", conditions: ["糖尿病", "高血压"] },
  { relative: "mother", conditions: [] },
  { relative: "paternal_grandparents", conditions: [] },
  { relative: "maternal_grandparents", conditions: [] },
];

const mockCurrentSymptoms: string[] = ["头晕", "心慌"]; 
const mockAllergies: string[] = ["青霉素", "其他"];
const mockOtherAllergyText: string = "芒果";
const mockOperationHistory: string[] = ["心脏（含心脏介入）"]; 
const mockBloodTransfusionHistory: string = "2005年因车祸输血400ml，无不良反应。";
const mockMedicationCategories: string[] = ["降压药", "降糖药"];
const mockContactHistory: string[] = ["油烟", "粉烟尘"];

const mockDietaryHabitsData: DietaryHabitsFormValues = {
  dietaryHabits_breakfastDays: "7天",
  dietaryHabits_lateSnackDays: "1-2天",
  dietaryHabits_badHabits: ["吃饭过快"],
  dietaryHabits_preferences: ["咸", "辣"],
  dietaryHabits_foodTypePreferences: ["油炸食品"],
};

const mockDietaryIntakeData: DietaryIntakeFormValues = {
  dietaryIntake_staple: '2-4碗',
  dietaryIntake_meat: '1-2两',
  dietaryIntake_fish: '<1两',
  dietaryIntake_eggs: '1-2个',
  dietaryIntake_dairy: '1-2杯',
  dietaryIntake_soy: '0.5-1两',
  dietaryIntake_vegetables: '6-10两',
  dietaryIntake_fruits: '1-4两',
  dietaryIntake_water: '6-9杯',
};

const mockExerciseData: ExerciseFormValues = {
  exercise_workHours: '5-8小时',
  exercise_sedentaryHours: '5-8小时',
  exercise_weeklyFrequency: '偶尔（1-2次/周）',
  exercise_durationPerSession: '30-60分钟',
  exercise_intensity: '中度运动',
};

const mockSmokingStatusData: SmokingStatusFormValues = {
    smoking_status: '从不',
    smoking_cigarettesPerDay: undefined,
    smoking_years: undefined,
    smoking_passiveDays: '没有',
};

const mockDrinkingStatusData: DrinkingStatusFormValues = {
    drinking_status: '偶尔',
    drinking_type: '啤酒',
    drinking_type_other: '',
    drinking_amountPerDay: '<2两',
    drinking_years: '<5年',
};

const mockMentalHealthData: MentalHealthFormValues = {
  mentalHealth_majorEvents: "否",
  mentalHealth_impactOnLife: "有一点",
  mentalHealth_stressLevel: "较明显",
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
};


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
    { value: "otherInfo", label: "其他", icon: Info },
    { value: "communication", label: "沟通进展", icon: MessagesSquare },
    { value: "suggestions", label: "您的建议", icon: Lightbulb },
    { value: "serviceSatisfaction", label: "服务满意度", icon: ThumbsUp },
  ];

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

  // States for each form section
  const [familyHistoryData, setFamilyHistoryData] = React.useState<FamilyMedicalHistoryEntry[]>(mockFamilyHistory);
  const [currentSymptomsData, setCurrentSymptomsData] = React.useState<string[]>(mockCurrentSymptoms);
  const [allergiesData, setAllergiesData] = React.useState<string[]>(mockAllergies);
  const [otherAllergyTextData, setOtherAllergyTextData] = React.useState<string>(mockOtherAllergyText);
  const [operationHistoryData, setOperationHistoryData] = React.useState<string[]>(mockOperationHistory);
  const [bloodTransfusionHistoryData, setBloodTransfusionHistoryData] = React.useState<string>(mockBloodTransfusionHistory);
  const [medicationCategoriesData, setMedicationCategoriesData] = React.useState<string[]>(mockMedicationCategories);
  const [contactHistoryData, setContactHistoryData] = React.useState<string[]>(mockContactHistory);
  const [dietaryHabitsData, setDietaryHabitsData] = React.useState<DietaryHabitsFormValues>(mockDietaryHabitsData);
  const [dietaryIntakeData, setDietaryIntakeData] = React.useState<DietaryIntakeFormValues>(mockDietaryIntakeData);
  const [exerciseData, setExerciseData] = React.useState<ExerciseFormValues>(mockExerciseData);
  const [smokingStatusData, setSmokingStatusData] = React.useState<SmokingStatusFormValues>(mockSmokingStatusData);
  const [drinkingStatusData, setDrinkingStatusData] = React.useState<DrinkingStatusFormValues>(mockDrinkingStatusData);
  const [mentalHealthData, setMentalHealthData] = React.useState<MentalHealthFormValues>(mockMentalHealthData);


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

        {tabItems.filter(tab => ![
            "basicInfo", "familyHistory", "currentSymptoms", "allergies", "operationHistory", 
            "bloodTransfusion", "medicationHistory", "contactHistory", "dietaryHabits", 
            "dietaryIntake", "exercise", "smokingStatus", "drinkingStatus", "mentalHealth"
        ].includes(tab.value)).map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {renderPlaceholderContent(tab.label, tab.icon)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
    
