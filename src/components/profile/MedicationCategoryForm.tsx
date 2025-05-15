
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
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const medicationCategoryOptions = [
  "降压药", "降糖药", "降脂药", "降尿酸药", "抗心律失常药", 
  "缓解哮喘药物", "强的松类药物", "解热镇痛药（如布洛芬等）", "雌激素类药物", 
  "利尿剂", "镇静剂或安眠药", "中草药", "避孕药", "抗抑郁药物", "其他"
];

const medicationCategoryFormSchema = z.object({
  selectedMedicationCategories: z.array(z.string()).optional(),
});

type MedicationCategoryFormValues = z.infer<typeof medicationCategoryFormSchema>;

interface MedicationCategoryFormProps {
  initialMedicationCategories?: string[];
  onSave: (categories: string[]) => void;
}

export function MedicationCategoryForm({ initialMedicationCategories, onSave }: MedicationCategoryFormProps) {
  const { toast } = useToast();
  
  const form = useForm<MedicationCategoryFormValues>({
    resolver: zodResolver(medicationCategoryFormSchema),
    defaultValues: {
      selectedMedicationCategories: initialMedicationCategories || [],
    },
  });

  useEffect(() => {
    form.reset({ selectedMedicationCategories: initialMedicationCategories || [] });
  }, [initialMedicationCategories, form]);

  function onSubmit(data: MedicationCategoryFormValues) {
    onSave(data.selectedMedicationCategories || []);
    toast({
      title: "用药史已保存",
      description: "您的用药史（类别）信息已更新。",
    });
  }

  return (
    <Card className="shadow-sm mt-4">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">编辑用药史 (选择类别)</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="selectedMedicationCategories"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm">请选择您目前正在使用的药物类别：</FormLabel>
                  <ScrollArea className="h-60 w-full rounded-md border p-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                      {medicationCategoryOptions.map((category) => (
                        <FormField
                          key={category}
                          control={form.control}
                          name="selectedMedicationCategories"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={category}
                                className="flex flex-row items-center space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), category])
                                        : field.onChange(
                                            (field.value || []).filter(
                                              (value) => value !== category
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-xs font-normal leading-tight">
                                  {category}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">保存用药史</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
