
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { AdherenceBodyOption, AdherenceMindOption, AdherenceComplianceOption } from "@/lib/types";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const adherenceBodyOptions: AdherenceBodyOption[] = ['很满意', '满意', '尚可', '不太好', '很糟糕'];
const adherenceMindOptions: AdherenceMindOption[] = ['很重视', '还算关心', '不太在意', '无所谓'];
const adherenceComplianceOptions: AdherenceComplianceOption[] = ['完全执行', '执行一部分', '完全不执行'];
const adherenceHealthPromotionMethodsOptions: string[] = ["改变生活形态", "改变饮食习惯", "营养辅助品", "药物", "其他"];


const adherenceBehaviorFormSchema = z.object({
  adherence_selfAssessmentBody: z.string().optional() as z.ZodType<AdherenceBodyOption | undefined>,
  adherence_selfAssessmentMind: z.string().optional() as z.ZodType<AdherenceMindOption | undefined>,
  adherence_priorityProblems: z.array(z.string().optional()).max(4, "最多填写4个问题").optional(),
  adherence_doctorAdviceCompliance: z.string().optional() as z.ZodType<AdherenceComplianceOption | undefined>,
  adherence_healthPromotionMethods: z.array(z.string()).optional(),
  adherence_otherHealthPromotion: z.string().optional(),
}).refine(data => {
  if (data.adherence_healthPromotionMethods?.includes("其他") && (!data.adherence_otherHealthPromotion || data.adherence_otherHealthPromotion.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "请填写“其他”促进健康方式的具体内容。",
  path: ["adherence_otherHealthPromotion"],
});

export type AdherenceBehaviorFormValues = z.infer<typeof adherenceBehaviorFormSchema>;

interface AdherenceBehaviorFormProps {
  initialData?: AdherenceBehaviorFormValues;
  onSave: (data: AdherenceBehaviorFormValues) => void;
}

export function AdherenceBehaviorForm({ initialData, onSave }: AdherenceBehaviorFormProps) {
  const { toast } = useToast();
  
  const form = useForm<AdherenceBehaviorFormValues>({
    resolver: zodResolver(adherenceBehaviorFormSchema),
    defaultValues: initialData || {
        adherence_selfAssessmentBody: undefined,
        adherence_selfAssessmentMind: undefined,
        adherence_priorityProblems: Array(4).fill(''),
        adherence_doctorAdviceCompliance: undefined,
        adherence_healthPromotionMethods: [],
        adherence_otherHealthPromotion: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        adherence_priorityProblems: [
          ...(initialData.adherence_priorityProblems || []),
          ...Array(Math.max(0, 4 - (initialData.adherence_priorityProblems?.length || 0))).fill('')
        ].slice(0, 4)
      });
    } else {
       form.reset({ // Ensure reset to empty state if no initialData
        adherence_selfAssessmentBody: undefined,
        adherence_selfAssessmentMind: undefined,
        adherence_priorityProblems: Array(4).fill(''),
        adherence_doctorAdviceCompliance: undefined,
        adherence_healthPromotionMethods: [],
        adherence_otherHealthPromotion: '',
      });
    }
  }, [initialData, form]);
  
  const watchedHealthPromotionMethods = form.watch("adherence_healthPromotionMethods");
  const showOtherPromotionInput = !!watchedHealthPromotionMethods?.includes("其他");

  function onSubmit(data: AdherenceBehaviorFormValues) {
     const dataToSave = {
      ...data,
      adherence_priorityProblems: data.adherence_priorityProblems?.filter(p => p && p.trim() !== ''), 
      adherence_otherHealthPromotion: data.adherence_healthPromotionMethods?.includes("其他") ? data.adherence_otherHealthPromotion : "",
    };
    onSave(dataToSave);
    toast({
      title: "遵医行为信息已保存",
      description: "您的遵医行为相关信息已更新。",
    });
  }

  const renderRadioGroupField = (
    name: keyof AdherenceBehaviorFormValues,
    label: string,
    options: readonly string[]
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm">{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value as string | undefined}
              className="flex flex-wrap gap-x-3 gap-y-1"
            >
              {options.map((option) => (
                <FormItem key={option} className="flex items-center space-x-1.5">
                  <FormControl><RadioGroupItem value={option} /></FormControl>
                  <FormLabel className="font-normal text-xs">{option}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderCheckboxGroupField = (
    name: keyof AdherenceBehaviorFormValues,
    label: string,
    options: readonly string[]
  ) => (
    <FormField
      control={form.control}
      name={name as any} 
      render={() => (
        <FormItem>
          <FormLabel className="text-sm">{label}</FormLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {options.map((item) => (
              <FormField
                key={item}
                control={form.control}
                name={name as any}
                render={({ field }) => {
                  return (
                    <FormItem
                      className="flex flex-row items-center space-x-2 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={(field.value as string[])?.includes(item)}
                          onCheckedChange={(checked) => {
                            const currentValue = (field.value as string[]) || [];
                            return checked
                              ? field.onChange([...currentValue, item])
                              : field.onChange(
                                  currentValue.filter(
                                    (value) => value !== item
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-xs font-normal leading-tight">
                        {item}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );


  return (
    <Card className="shadow-sm mt-4">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">编辑遵医行为信息</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[calc(100vh-28rem)] pr-3"> 
                <div className="space-y-6">
                    <div>
                        <FormLabel className="text-sm font-medium">1. 您怎么评价自己健康状况：</FormLabel>
                        <div className="pl-2 mt-1 space-y-3">
                            {renderRadioGroupField("adherence_selfAssessmentBody", "A.身体感觉：", adherenceBodyOptions)}
                            {renderRadioGroupField("adherence_selfAssessmentMind", "B.心理态度：", adherenceMindOptions)}
                        </div>
                    </div>

                    <div>
                        <FormLabel className="text-sm font-medium">2. 您最希望被解决的健康问题 （请依据优先级，最多4项）：</FormLabel>
                        <div className="space-y-2 mt-1">
                            {['第一', '第二', '第三', '第四'].map((priority, index) => (
                                <FormField
                                key={index}
                                control={form.control}
                                name={`adherence_priorityProblems.${index}` as any} 
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">{priority}：</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder={`问题 ${index + 1}`} className="h-8 text-xs" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            ))}
                        </div>
                         <FormMessage>{form.formState.errors.adherence_priorityProblems?.message}</FormMessage>
                    </div>
                    
                    {renderRadioGroupField("adherence_doctorAdviceCompliance", "3. 对医嘱及专业人员建议的依从度：", adherenceComplianceOptions)}

                    <div>
                        {renderCheckboxGroupField("adherence_healthPromotionMethods", "4.您希望以何种方式促进健康：", adherenceHealthPromotionMethodsOptions)}
                        {showOtherPromotionInput && (
                            <FormField
                                control={form.control}
                                name="adherence_otherHealthPromotion"
                                render={({ field }) => (
                                <FormItem className="mt-2 pl-4">
                                    <FormLabel className="text-xs">其他方式说明：</FormLabel>
                                    <FormControl>
                                    <Input {...field} placeholder="具体说明其他方式" className="h-8 text-xs"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        )}
                    </div>
                </div>
            </ScrollArea>
            <div className="flex justify-end pt-4">
              <Button type="submit">保存遵医行为信息</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    