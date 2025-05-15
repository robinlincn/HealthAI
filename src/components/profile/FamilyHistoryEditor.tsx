
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { FamilyMedicalHistoryEntry } from "@/lib/types";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


const familyMedicalHistoryEntrySchema = z.object({
  relative: z.enum(["self", "father", "mother", "paternal_grandparents", "maternal_grandparents"]),
  conditions: z.array(z.string()),
});

const familyHistoryFormSchema = z.object({
  familyMedicalHistory: z.array(familyMedicalHistoryEntrySchema),
});

type FamilyHistoryFormValues = z.infer<typeof familyHistoryFormSchema>;

const allFamilyConditions = ["高血压", "糖尿病", "冠心病", "高血脂", "肥胖", "脑卒中", "骨质疏松", "老年痴呆", "肺癌", "肝癌", "胃肠癌", "前列腺癌", "乳腺癌", "宫颈癌"];
const relativesMap: Record<FamilyMedicalHistoryEntry["relative"], string> = {
  self: "本人",
  father: "父亲",
  mother: "母亲",
  paternal_grandparents: "祖父母",
  maternal_grandparents: "外祖父母",
};

const defaultFamilyHistoryData: FamilyMedicalHistoryEntry[] = [
  { relative: "self", conditions: [] },
  { relative: "father", conditions: [] },
  { relative: "mother", conditions: [] },
  { relative: "paternal_grandparents", conditions: [] },
  { relative: "maternal_grandparents", conditions: [] },
];

interface FamilyHistoryEditorProps {
  initialData?: FamilyMedicalHistoryEntry[];
  onSave: (data: FamilyMedicalHistoryEntry[]) => void;
}

export function FamilyHistoryEditor({ initialData, onSave }: FamilyHistoryEditorProps) {
  const { toast } = useToast();
  
  const form = useForm<FamilyHistoryFormValues>({
    resolver: zodResolver(familyHistoryFormSchema),
    defaultValues: {
      familyMedicalHistory: initialData && initialData.length > 0 ? initialData : defaultFamilyHistoryData,
    },
    mode: "onChange",
  });

  // Reset form if initialData changes
  useEffect(() => {
    form.reset({
      familyMedicalHistory: initialData && initialData.length > 0 ? initialData : defaultFamilyHistoryData,
    });
  }, [initialData, form]);

  function onSubmit(data: FamilyHistoryFormValues) {
    const processedData = data.familyMedicalHistory.map(entry => ({
      ...entry,
      conditions: entry.conditions.filter(c => c) // Ensure no empty strings if checkboxes are used directly as values
    }));
    onSave(processedData);
    // Toast is now handled by the parent page
  }

  return (
    <Card className="shadow-sm mt-4">
        <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">编辑家族病史及患病情况</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="familyMedicalHistory"
                render={() => (
                    <FormItem>
                    {/* FormLabel can be omitted if CardTitle serves this purpose */}
                    <Tabs defaultValue="self" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 h-auto gap-1">
                        {(form.watch('familyMedicalHistory') || defaultFamilyHistoryData).map((relativeEntry) => (
                            <TabsTrigger key={relativeEntry.relative} value={relativeEntry.relative} className="text-xs px-1 py-1.5 h-full data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                            {relativesMap[relativeEntry.relative]}
                            </TabsTrigger>
                        ))}
                        </TabsList>
                        {(form.watch('familyMedicalHistory') || defaultFamilyHistoryData).map((_relativeEntry, relativeIndex) => (
                        <TabsContent 
                            key={form.getValues(`familyMedicalHistory.${relativeIndex}.relative`)} 
                            value={form.getValues(`familyMedicalHistory.${relativeIndex}.relative`)}
                            className="mt-0" // Remove default top margin from TabsContent
                        >
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border rounded-md mt-2 bg-muted/30 max-h-60 overflow-y-auto">
                            {allFamilyConditions.map((condition) => (
                                <FormField
                                key={`${form.getValues(`familyMedicalHistory.${relativeIndex}.relative`)}-${condition}`}
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
                <div className="flex justify-end pt-2">
                    <Button type="submit">保存家族病史</Button>
                </div>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}


    