"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { useToast } from "@/hooks/use-toast";
import type { MedicalHistory } from "@/lib/types";
import { PlusCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

const medicalHistoryFormSchema = z.object({
  diagnosis: z.array(z.string().min(1, "诊断不能为空")).optional(),
  pastConditions: z.array(z.string().min(1, "既往病史不能为空")).optional(),
  familyHistory: z.array(z.string().min(1, "家族病史不能为空")).optional(),
  allergies: z.array(z.string().min(1, "过敏史不能为空")).optional(),
});

type MedicalHistoryFormValues = z.infer<typeof medicalHistoryFormSchema>;

// Mock data
const defaultValues: MedicalHistoryFormValues = {
  diagnosis: ["高血压", "2型糖尿病"],
  pastConditions: ["肺炎 (2010年)"],
  familyHistory: ["父亲患有高血压"],
  allergies: ["青霉素"],
};

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

  const { fields: diagnosisFields, append: appendDiagnosis, remove: removeDiagnosis } = useFieldArray({
    control: form.control,
    name: "diagnosis",
  });
  const { fields: pastConditionsFields, append: appendPastCondition, remove: removePastCondition } = useFieldArray({
    control: form.control,
    name: "pastConditions",
  });
  const { fields: familyHistoryFields, append: appendFamilyHistory, remove: removeFamilyHistory } = useFieldArray({
    control: form.control,
    name: "familyHistory",
  });
  const { fields: allergiesFields, append: appendAllergy, remove: removeAllergy } = useFieldArray({
    control: form.control,
    name: "allergies",
  });

  function onSubmit(data: MedicalHistoryFormValues) {
    console.log("Medical history data submitted:", data);
    toast({
      title: "病历信息已更新",
      description: "您的病历信息已成功保存。",
    });
  }

  if (!isClient) {
    return <div className="space-y-4">加载中...</div>;
  }

  const renderFieldArray = (
    label: string,
    name: keyof MedicalHistoryFormValues,
    fields: any[], 
    append: () => void, 
    remove: (index: number) => void
  ) => (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      {fields.map((field, index) => (
        <FormField
          key={field.id}
          control={form.control}
          name={`${name}.${index}` as any}
          render={({ field: itemField }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Input placeholder={`请输入${label}`} {...itemField} />
              </FormControl>
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                <XCircle className="h-4 w-4 text-destructive" />
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
        onClick={() => append()}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> 添加{label}
      </Button>
    </FormItem>
  );
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {renderFieldArray("疾病诊断", "diagnosis", diagnosisFields, () => appendDiagnosis(""), removeDiagnosis)}
        {renderFieldArray("既往病史", "pastConditions", pastConditionsFields, () => appendPastCondition(""), removePastCondition)}
        {renderFieldArray("家族病史", "familyHistory", familyHistoryFields, () => appendFamilyHistory(""), removeFamilyHistory)}
        {renderFieldArray("过敏史", "allergies", allergiesFields, () => appendAllergy(""), removeAllergy)}
        
        <Button type="submit">保存更新</Button>
      </form>
    </Form>
  );
}
