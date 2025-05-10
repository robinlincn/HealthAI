
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { MedicalHistory, FamilyMedicalHistoryEntry, MedicationEntry } from "@/lib/types";
import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";

const medicationEntrySchema = z.object({
  id: z.string(),
  drugName: z.string().min(1, "药物名称不能为空。"),
  dosage: z.string().min(1, "剂量不能为空。"),
  frequency: z.string().min(1, "使用频次不能为空。"),
  notes: z.string().optional(),
});

const familyMedicalHistoryEntrySchema = z.object({
  relative: z.enum(["self", "father", "mother", "paternal_grandparents", "maternal_grandparents"]),
  conditions: z.array(z.string()),
});

const medicalHistoryFormSchema = z.object({
  pastMedicalHistoryText: z.string().optional(),
  familyMedicalHistory: z.array(familyMedicalHistoryEntrySchema).optional(),
  allergies: z.array(z.string().min(1, "过敏史不能为空")).optional(),
  currentSymptoms: z.array(z.string()).optional(),
  medicationHistory: z.array(medicationEntrySchema).optional(),
  otherMedicalInfo: z.string().optional(),
  healthGoals: z.array(z.string()).optional(),
});

type MedicalHistoryFormValues = z.infer<typeof medicalHistoryFormSchema>;

const defaultValues: MedicalHistoryFormValues = {
  pastMedicalHistoryText: "2010年阑尾炎手术, 2005年肺炎。",
  familyMedicalHistory: [
    { relative: "self", conditions: ["高血压", "2型糖尿病"] },
    { relative: "father", conditions: ["高血压"] },
    { relative: "mother", conditions: [] },
    { relative: "paternal_grandparents", conditions: [] },
    { relative: "maternal_grandparents", conditions: [] },
  ],
  allergies: ["青霉素"],
  currentSymptoms: ["心慌气短"],
  medicationHistory: [
    { id: "med1", drugName: "代文", dosage: "80mg*2", frequency: "一粒/次/天 (早晨空腹)", notes: "2016年开始服药" },
    { id: "med2", drugName: "倍他乐克", dosage: "47.5mg/粒", frequency: "一粒/次/天 (早晨空腹)", notes: "2018年开始服药" },
  ],
  otherMedicalInfo: "长期服用降压药。日常血压监测在130-140/80-85 mmHg左右。心率在90-105次/分左右。",
  healthGoals: ["控制血糖, 防止并发症"],
};

const allFamilyConditions = ["脑出血", "糖尿病", "冠心病", "高血压", "结核", "精神病", "肿瘤癌症", "老年痴呆", "肝炎", "肾脏病", "先天畸形", "乳腺癌", "宫颈癌"];
const allSymptoms = ["心慌气短", "持续低烧", "体重下降", "严重头晕", "健忘", "经常头痛", "失眠", "反应迟钝", "视力下降", "耳鸣", "经常鼻出血", "鼻涕带血", "声音嘶哑", "气喘", "经常干咳", "痰中带血", "心悸", "胸闷", "胸痛", "吞咽不适感", "食欲减退", "反酸", "嗳气", "腹胀", "腹痛", "腹部包块", "便秘", "腹泻", "便血", "大便习惯改变", "尿频", "血尿", "关节疼痛", "无力", "尿潴留", "女性性征改变", "接触性出血"];
const allHealthGoalsOptions = ["控制血糖, 防止并发症", "管理血压", "控制体重", "改善睡眠", "缓解疼痛", "提高免疫力"];


export function MedicalHistoryForm() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const form = useForm<MedicalHistoryFormValues>({
    resolver: zodResolver(medicalHistoryFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields: medicationFields, append: appendMedication, remove: removeMedication } = useFieldArray({
    control: form.control,
    name: "medicationHistory",
  });

  const { fields: allergyFields, append: appendAllergy, remove: removeAllergy } = useFieldArray({
    control: form.control,
    name: "allergies",
  });

  function onSubmit(data: MedicalHistoryFormValues) {
    console.log("Medical history data submitted:", data);
    // Transform familyMedicalHistory for submission if needed
    const submittedData = {
      ...data,
      familyMedicalHistory: data.familyMedicalHistory?.map(relativeEntry => ({
        ...relativeEntry,
        conditions: relativeEntry.conditions.filter(c => c) // Ensure no empty strings if checkboxes are used directly as values
      })),
    };
    console.log("Processed medical history data:", submittedData);
    toast({
      title: "病历信息已更新",
      description: "您的病历信息已成功保存。",
    });
  }

  if (!isClient) {
    return <div className="space-y-4">加载中...</div>;
  }
  
  const relativesMap: Record<FamilyMedicalHistoryEntry["relative"], string> = {
    self: "本人",
    father: "父亲",
    mother: "母亲",
    paternal_grandparents: "祖父母",
    maternal_grandparents: "外祖父母",
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Family Medical History */}
        <FormField
          control={form.control}
          name="familyMedicalHistory"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold">家族病史及患病情况</FormLabel>
              <Tabs defaultValue="self" className="w-full">
                <TabsList className="grid w-full grid-cols-5 h-auto">
                  {(defaultValues.familyMedicalHistory || []).map((relativeEntry, index) => (
                    <TabsTrigger key={relativeEntry.relative} value={relativeEntry.relative} className="text-xs px-1 py-1.5 h-full">
                      {relativesMap[relativeEntry.relative]}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {(form.watch('familyMedicalHistory') || []).map((relativeEntry, relativeIndex) => (
                  <TabsContent key={relativeEntry.relative} value={relativeEntry.relative}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 border rounded-md mt-2">
                      {allFamilyConditions.map((condition) => (
                        <FormField
                          key={`${relativeEntry.relative}-${condition}`}
                          control={form.control}
                          name={`familyMedicalHistory.${relativeIndex}.conditions`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(condition)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), condition])
                                      : field.onChange(
                                          (field.value || []).filter(
                                            (value) => value !== condition
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-xs font-normal leading-tight">
                                {condition}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />

        {/* Current Symptoms */}
        <FormField
          control={form.control}
          name="currentSymptoms"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold">现有症状</FormLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 border rounded-md">
                {allSymptoms.slice(0,15).map((symptom) => ( // Showing a subset for brevity
                  <FormField
                    key={symptom}
                    control={form.control}
                    name="currentSymptoms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                        <FormControl>
                           <Checkbox
                              checked={field.value?.includes(symptom)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), symptom])
                                  : field.onChange(
                                      (field.value || []).filter(
                                        (value) => value !== symptom
                                      )
                                    );
                              }}
                            />
                        </FormControl>
                        <FormLabel className="text-xs font-normal leading-tight">{symptom}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
               <FormDescription className="text-xs">选择您当前感到的症状 (已展示部分常见症状)。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />

        {/* Past Medical History Text */}
        <FormField
          control={form.control}
          name="pastMedicalHistoryText"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">既往史</FormLabel>
              <FormControl>
                <Textarea placeholder="请描述您的既往重要病史、手术史等。" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        
        {/* Allergies */}
         <FormItem>
          <FormLabel className="text-base font-semibold">过敏史</FormLabel>
          {allergyFields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`allergies.${index}`}
              render={({ field: itemField }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Input placeholder="例如：青霉素、海鲜" {...itemField} />
                  </FormControl>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeAllergy(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => appendAllergy("")}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> 添加过敏项
          </Button>
        </FormItem>
        <Separator />

        {/* Medication History */}
        <FormItem>
          <FormLabel className="text-base font-semibold">用药史</FormLabel>
          <div className="space-y-4">
            {medicationFields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-md space-y-3 relative">
                 <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-destructive hover:text-destructive/80 h-7 w-7"
                    onClick={() => removeMedication(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                <FormField
                  control={form.control}
                  name={`medicationHistory.${index}.drugName`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel className="text-xs">药物名称</FormLabel>
                      <FormControl><Input placeholder="例如：代文" {...itemField} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                    control={form.control}
                    name={`medicationHistory.${index}.dosage`}
                    render={({ field: itemField }) => (
                        <FormItem>
                        <FormLabel className="text-xs">用量</FormLabel>
                        <FormControl><Input placeholder="例如：80mg*2" {...itemField} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name={`medicationHistory.${index}.frequency`}
                    render={({ field: itemField }) => (
                        <FormItem>
                        <FormLabel className="text-xs">使用频次</FormLabel>
                        <FormControl><Input placeholder="例如：每日一次" {...itemField} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name={`medicationHistory.${index}.notes`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel className="text-xs">备注</FormLabel>
                      <FormControl><Textarea placeholder="例如：餐后服用，2016年开始" rows={1} {...itemField} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendMedication({ id: Date.now().toString(), drugName: "", dosage: "", frequency: "", notes: "" })}>
            <PlusCircle className="mr-2 h-4 w-4" /> 添加药物
          </Button>
        </FormItem>
        <Separator />

        {/* Other Medical Info */}
        <FormField
          control={form.control}
          name="otherMedicalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">其他</FormLabel>
              <FormControl>
                <Textarea placeholder="请补充说明其他需要医生了解的健康信息。" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />

        {/* Health Goals */}
        <FormField
          control={form.control}
          name="healthGoals"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold">您最希望解决的健康问题 (可选前三项)</FormLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 border rounded-md">
                {allHealthGoalsOptions.map((goal) => (
                  <FormField
                    key={goal}
                    control={form.control}
                    name="healthGoals"
                    render={({ field }) => {
                      const currentGoals = field.value || [];
                      const isChecked = currentGoals.includes(goal);
                      const isDisabled = !isChecked && currentGoals.length >= 3;
                      return (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={isChecked}
                              disabled={isDisabled}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  if (currentGoals.length < 3) {
                                    field.onChange([...currentGoals, goal]);
                                  }
                                } else {
                                  field.onChange(
                                    currentGoals.filter((value) => value !== goal)
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className={`text-sm font-normal leading-tight ${isDisabled ? 'text-muted-foreground' : ''}`}>{goal}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormDescription className="text-xs">选择您最关注的1-3个健康目标。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">保存更新</Button>
      </form>
    </Form>
  );
}
