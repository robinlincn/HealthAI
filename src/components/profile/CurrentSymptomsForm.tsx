
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
import type { UserProfile } from "@/lib/types";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const currentSymptomsOptions = [
  "心情烦躁", "情绪低落", "体重下降", "严重失眠", "健忘", "经常头痛", "头晕", "皮肤瘙痒", "视力下降", "耳鸣",
  "经常鼻出血", "鼻涕带血", "声音嘶哑", "气喘", "经常干咳", "咳痰带血", "心慌", "胸闷", "胸痛",
  "吞咽不适或梗塞感", "食欲减退", "反酸", "嗳气", "腹胀", "腹痛", "腹部包块", "便秘", "腹泻", "便血",
  "大便变细", "尿频", "血尿", "肢体麻痛", "无力", "腰背痛", "女性血性白带", "接触性出血"
];

const symptomsFormSchema = z.object({
  symptoms: z.array(z.string()).optional(),
});

type SymptomsFormValues = z.infer<typeof symptomsFormSchema>;

interface CurrentSymptomsFormProps {
  initialSymptoms?: string[];
  onSave: (symptoms: string[]) => void;
}

export function CurrentSymptomsForm({ initialSymptoms, onSave }: CurrentSymptomsFormProps) {
  const { toast } = useToast();
  
  const form = useForm<SymptomsFormValues>({
    resolver: zodResolver(symptomsFormSchema),
    defaultValues: {
      symptoms: initialSymptoms || [],
    },
  });

  useEffect(() => {
    form.reset({ symptoms: initialSymptoms || [] });
  }, [initialSymptoms, form]);

  function onSubmit(data: SymptomsFormValues) {
    onSave(data.symptoms || []);
    toast({
      title: "症状信息已保存",
      description: "您的现有不适症状已更新。",
    });
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">编辑现有不适症状</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="symptoms"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm">请选择您当前感到的不适症状：</FormLabel>
                  <ScrollArea className="h-72 w-full rounded-md border p-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                      {currentSymptomsOptions.map((symptom) => (
                        <FormField
                          key={symptom}
                          control={form.control}
                          name="symptoms"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={symptom}
                                className="flex flex-row items-center space-x-2 space-y-0"
                              >
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
                                <FormLabel className="text-xs font-normal leading-tight">
                                  {symptom}
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
              <Button type="submit">保存症状</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
