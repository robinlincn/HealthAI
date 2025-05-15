
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { SmokingStatusOption, FrequencyOption } from "@/lib/types";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const smokingStatusOptions: SmokingStatusOption[] = ['从不', '偶尔', '戒烟', '吸烟'];
const smokingCigarettesPerDayOptions: string[] = ['＜5支', '5~15支', '15~25支', '25~40支', '≥40支'];
const smokingYearsOptions: string[] = ['＜1年', '1~5年', '5~10年', '10~20年', '≥20年'];
const smokingPassiveDaysOptions: FrequencyOption[] = ['没有', '1-2天', '3-4天', '5-6天', '7天'];

const smokingStatusFormSchema = z.object({
  smoking_status: z.string().optional() as z.ZodType<SmokingStatusOption | undefined>,
  smoking_cigarettesPerDay: z.string().optional(),
  smoking_years: z.string().optional(),
  smoking_passiveDays: z.string().optional() as z.ZodType<FrequencyOption | undefined>,
});

export type SmokingStatusFormValues = z.infer<typeof smokingStatusFormSchema>;

interface SmokingStatusFormProps {
  initialData?: SmokingStatusFormValues;
  onSave: (data: SmokingStatusFormValues) => void;
}

export function SmokingStatusForm({ initialData, onSave }: SmokingStatusFormProps) {
  const { toast } = useToast();
  
  const form = useForm<SmokingStatusFormValues>({
    resolver: zodResolver(smokingStatusFormSchema),
    defaultValues: initialData || {
        smoking_status: undefined,
        smoking_cigarettesPerDay: undefined,
        smoking_years: undefined,
        smoking_passiveDays: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const watchedSmokingStatus = form.watch("smoking_status");
  const showConditionalQuestions = watchedSmokingStatus === '吸烟' || watchedSmokingStatus === '戒烟';

  function onSubmit(data: SmokingStatusFormValues) {
    const dataToSave = { ...data };
    if (!showConditionalQuestions) {
      dataToSave.smoking_cigarettesPerDay = undefined;
      dataToSave.smoking_years = undefined;
    }
    onSave(dataToSave);
    toast({
      title: "吸烟情况已保存",
      description: "您的吸烟情况信息已更新。",
    });
  }

  const renderRadioGroupField = (
    name: keyof SmokingStatusFormValues,
    label: string,
    options: readonly string[],
    description?: string
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
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Card className="shadow-sm mt-4">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">编辑吸烟情况</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[calc(100vh-25rem)] pr-3"> {/* Adjust height as needed */}
                <div className="space-y-6">
                    {renderRadioGroupField("smoking_status", "1. 您当前吸烟情况的描述：", smokingStatusOptions, "若“从不”则不需填下两题")}
                    
                    {showConditionalQuestions && (
                        <>
                            {renderRadioGroupField("smoking_cigarettesPerDay", "2. 平均每天吸香烟的支数是：", smokingCigarettesPerDayOptions, "折算成香烟")}
                            {renderRadioGroupField("smoking_years", "3. 您总共吸烟的年数是：", smokingYearsOptions)}
                        </>
                    )}
                    
                    {renderRadioGroupField("smoking_passiveDays", "4. 平均每周被动吸烟情况：", smokingPassiveDaysOptions, "指“二手烟”")}
                </div>
            </ScrollArea>
            <div className="flex justify-end pt-4">
              <Button type="submit">保存吸烟情况</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
