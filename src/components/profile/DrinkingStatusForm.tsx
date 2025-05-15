
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { DrinkingStatusOption, AlcoholTypeOption } from "@/lib/types";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const drinkingStatusOptions: DrinkingStatusOption[] = ['从不', '偶尔', '戒酒', '饮酒'];
const drinkingTypeOptions: AlcoholTypeOption[] = ['白酒', '黄酒', '红酒', '啤酒', '其他'];
const drinkingAmountPerDayOptions: string[] = ['＜2两', '2~4两', '4~6两', '6~8两', '≥8两'];
const drinkingYearsOptions: string[] = ['＜5年', '5~15年', '15~25年', '25~40年', '≥40年'];

const drinkingStatusFormSchema = z.object({
  drinking_status: z.string().optional() as z.ZodType<DrinkingStatusOption | undefined>,
  drinking_type: z.string().optional() as z.ZodType<AlcoholTypeOption | string | undefined>,
  drinking_type_other: z.string().optional(),
  drinking_amountPerDay: z.string().optional(),
  drinking_years: z.string().optional(),
}).refine(data => {
  if (data.drinking_type === '其他' && (!data.drinking_type_other || data.drinking_type_other.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "请填写“其他”饮酒类型。",
  path: ["drinking_type_other"],
});

export type DrinkingStatusFormValues = z.infer<typeof drinkingStatusFormSchema>;

interface DrinkingStatusFormProps {
  initialData?: DrinkingStatusFormValues;
  onSave: (data: DrinkingStatusFormValues) => void;
}

export function DrinkingStatusForm({ initialData, onSave }: DrinkingStatusFormProps) {
  const { toast } = useToast();
  
  const form = useForm<DrinkingStatusFormValues>({
    resolver: zodResolver(drinkingStatusFormSchema),
    defaultValues: initialData || {
        drinking_status: undefined,
        drinking_type: undefined,
        drinking_type_other: '',
        drinking_amountPerDay: undefined,
        drinking_years: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const watchedDrinkingStatus = form.watch("drinking_status");
  const showConditionalQuestions = watchedDrinkingStatus === '饮酒' || watchedDrinkingStatus === '戒酒';
  const showOtherDrinkingTypeInput = form.watch("drinking_type") === '其他';


  function onSubmit(data: DrinkingStatusFormValues) {
    const dataToSave = { ...data };
    if (!showConditionalQuestions) {
      dataToSave.drinking_type = undefined;
      dataToSave.drinking_type_other = '';
      dataToSave.drinking_amountPerDay = undefined;
      dataToSave.drinking_years = undefined;
    }
    if (data.drinking_type !== '其他') {
      dataToSave.drinking_type_other = '';
    }
    onSave(dataToSave);
    toast({
      title: "饮酒情况已保存",
      description: "您的饮酒情况信息已更新。",
    });
  }

  const renderRadioGroupField = (
    name: keyof DrinkingStatusFormValues,
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
        <CardTitle className="text-base">编辑饮酒情况</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[calc(100vh-25rem)] pr-3"> 
                <div className="space-y-6">
                    {renderRadioGroupField("drinking_status", "1. 您当前饮酒情况的描述是：", drinkingStatusOptions, "若“从不”则不需填下三题")}
                    
                    {showConditionalQuestions && (
                        <>
                            {renderRadioGroupField("drinking_type", "2. 您最常饮酒的类型是：", drinkingTypeOptions)}
                            {showOtherDrinkingTypeInput && (
                                <FormField
                                control={form.control}
                                name="drinking_type_other"
                                render={({ field }) => (
                                    <FormItem className="pl-4">
                                    <FormLabel className="text-xs">请注明其他类型：</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="其他饮酒类型" className="h-8 text-xs" />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            )}
                            {renderRadioGroupField("drinking_amountPerDay", "3. 平均每天饮酒的量是：", drinkingAmountPerDayOptions, "折算成白酒。1瓶啤酒（约600ml）=1杯红酒（约3两）=1两低度白酒或0.5两高度白酒。")}
                            {renderRadioGroupField("drinking_years", "4. 您总共饮酒的年数是：", drinkingYearsOptions)}
                        </>
                    )}
                </div>
            </ScrollArea>
            <div className="flex justify-end pt-4">
              <Button type="submit">保存饮酒情况</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
