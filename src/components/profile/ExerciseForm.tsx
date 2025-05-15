
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { ExerciseWorkHoursOption, ExerciseWeeklyFrequencyOption, ExerciseDurationOption, ExerciseIntensityOption } from "@/lib/types";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const exerciseWorkSedentaryHoursOptions: ExerciseWorkHoursOption[] = ['没有', '1-2小时', '2-5小时', '5-8小时', '≥8小时'];
const exerciseWeeklyFrequencyOptions: ExerciseWeeklyFrequencyOption[] = ['从不', '偶尔（1-2次/周）', '经常（3-5次/周）', '总是（>5次/周）'];
const exerciseDurationPerSessionOptions: ExerciseDurationOption[] = ['<10分钟', '10~30分钟', '30~60分钟', '1~2小时'];
const exerciseIntensityOptions: ExerciseIntensityOption[] = ['不锻炼', '极轻度运动', '轻度运动', '中度运动', '重度运动'];


const exerciseFormSchema = z.object({
  exercise_workHours: z.string().optional() as z.ZodType<ExerciseWorkHoursOption | undefined>,
  exercise_sedentaryHours: z.string().optional() as z.ZodType<ExerciseWorkHoursOption | undefined>,
  exercise_weeklyFrequency: z.string().optional() as z.ZodType<ExerciseWeeklyFrequencyOption | undefined>,
  exercise_durationPerSession: z.string().optional() as z.ZodType<ExerciseDurationOption | undefined>,
  exercise_intensity: z.string().optional() as z.ZodType<ExerciseIntensityOption | undefined>,
});

export type ExerciseFormValues = z.infer<typeof exerciseFormSchema>;

interface ExerciseFormProps {
  initialData?: ExerciseFormValues;
  onSave: (data: ExerciseFormValues) => void;
}

export function ExerciseForm({ initialData, onSave }: ExerciseFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: initialData || {
        exercise_workHours: undefined,
        exercise_sedentaryHours: undefined,
        exercise_weeklyFrequency: undefined,
        exercise_durationPerSession: undefined,
        exercise_intensity: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  function onSubmit(data: ExerciseFormValues) {
    onSave(data);
    toast({
      title: "运动锻炼信息已保存",
      description: "您的运动锻炼相关信息已更新。",
    });
  }

  const renderRadioGroupField = (
    name: keyof ExerciseFormValues,
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
              value={field.value}
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

  return (
    <Card className="shadow-sm mt-4">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">编辑运动锻炼信息</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[calc(100vh-25rem)] pr-3">
                <div className="space-y-6">
                    {renderRadioGroupField("exercise_workHours", "1. 您平均每天的工作时间是：", exerciseWorkSedentaryHoursOptions)}
                    {renderRadioGroupField("exercise_sedentaryHours", "2. 平均每天坐姿(静止)时间：", exerciseWorkSedentaryHoursOptions)}
                    {renderRadioGroupField("exercise_weeklyFrequency", "3. 您平均每周运动锻炼时间：", exerciseWeeklyFrequencyOptions)}
                    {renderRadioGroupField("exercise_durationPerSession", "4. 您平均每次运动锻炼时间：", exerciseDurationPerSessionOptions)}
                    {renderRadioGroupField("exercise_intensity", "5. 您一般锻炼的强度是什么：", exerciseIntensityOptions)}
                </div>
            </ScrollArea>
            <div className="flex justify-end pt-4">
              <Button type="submit">保存运动信息</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


    