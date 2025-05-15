
'use client';

import * as React from 'react';
import { BasicInfoForm } from "@/components/profile/BasicInfoForm";
import { FamilyHistoryEditor } from "@/components/profile/FamilyHistoryEditor";
import { CurrentSymptomsForm } from "@/components/profile/CurrentSymptomsForm";
import { AllergyForm } from "@/components/profile/AllergyForm"; // Import new AllergyForm
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  UserCircle, ShieldAlert, FileText, Users, ClipboardList, Stethoscope, 
  Droplets, Pill, Apple, Utensils, Dumbbell, Cigarette, Wine, Brain, 
  CheckSquare, Bed, Info, MessagesSquare, Lightbulb, ThumbsUp, CalendarHeart, 
  Activity, ShieldQuestion, Syringe, SprayCan, CookingPot, Heart, Wind,
  ChevronLeft, ChevronRight, HandHeart, ListChecks, MessageCircleQuestion,
  NotebookText, HelpCircle, Cog, Ban // Added Ban for Allergy
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import type { FamilyMedicalHistoryEntry, UserProfile } from "@/lib/types"; 
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Mock data for family history (can be fetched or from a store)
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

const tabItems = [
    { value: "basicInfo", label: "基本信息", icon: UserCircle },
    { value: "familyHistory", label: "家族病史", icon: HandHeart },
    { value: "currentSymptoms", label: "现有症状", icon: Activity },
    { value: "allergies", label: "过敏史", icon: Ban }, // Changed icon
    { value: "operationHistory", label: "手术史", icon: Stethoscope },
    { value: "bloodTransfusion", label: "输血史", icon: Droplets },
    { value: "medicationHistory", label: "用药史", icon: Pill },
    { value: "dietaryHabits", label: "饮食习惯", icon: Apple },
    { value: "dietaryIntake", label: "膳食摄入", icon: CookingPot },
    { value: "exercise", label: "运动锻炼", icon: Dumbbell },
    { value: "smokingStatus", label: "吸烟情况", icon: Cigarette },
    { value: "drinkingStatus", label: "饮酒情况", icon: Wine },
    { value: "mentalHealth", label: "心理健康", icon: Brain },
    { value: "adherence", label: "遵医行为", icon: CheckSquare },
    { value: "sleep", label: "睡眠", icon: Bed },
    { value: "otherInfo", label: "其他信息", icon: Info },
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

  const [familyHistoryData, setFamilyHistoryData] = React.useState<FamilyMedicalHistoryEntry[]>(mockFamilyHistory);
  const [currentSymptomsData, setCurrentSymptomsData] = React.useState<string[]>(mockCurrentSymptoms);
  const [allergiesData, setAllergiesData] = React.useState<string[]>(mockAllergies);
  const [otherAllergyTextData, setOtherAllergyTextData] = React.useState<string>(mockOtherAllergyText);


  const handleSaveFamilyHistory = (data: FamilyMedicalHistoryEntry[]) => {
    console.log("Saving family history from page:", data);
    setFamilyHistoryData(data); 
    toast({
      title: "家族病史已保存",
      description: "您的家族病史信息已在编辑页面更新。",
    });
  };

  const handleSaveCurrentSymptoms = (symptoms: string[]) => {
    console.log("Saving current symptoms from page:", symptoms);
    setCurrentSymptomsData(symptoms);
  };

  const handleSaveAllergies = (data: { allergies?: string[]; otherAllergyText?: string }) => {
    console.log("Saving allergies from page:", data);
    setAllergiesData(data.allergies || []);
    setOtherAllergyTextData(data.otherAllergyText || "");
    // Toast is handled within AllergyForm
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
      observer.observe(container, { childList: true, subtree: true });

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

        {tabItems.filter(tab => !["basicInfo", "familyHistory", "currentSymptoms", "allergies"].includes(tab.value)).map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {renderPlaceholderContent(tab.label, tab.icon)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

    