
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { UserProfile, FrequencyOption } from "@/lib/types";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const breakfastAndSnackDaysOptions: FrequencyOption[] = ["没有", "1-2天", "3-4天", "5-6天", "7天"];
const badHabitsOptions: string[] = ["吃饭时喝水", "吃饭过快", "吃得过饱", "挑食偏食"];
const tastePreferencesOptions: string[] = ["咸", "甜", "生", "冷", "硬", "热烫", "高油脂", "腌熏", "辛辣"];
const foodTypePreferencesOptions: string[] = ["油炸食品", "甜点吃零食(适量坚果除外)", "经常吃快餐", "喝粥（>1次/天）"];

const dietaryHabitsFormSchema = z.object({
  dietaryHabits_breakfastDays: z.string().optional(),
  dietaryHabits_lateSnackDays: z.string().optional(),
  dietaryHabits_badHabits: z.array(z.string()).optional(),
  dietaryHabits_preferences: z.array(z.string()).optional(),
  dietaryHabits_foodTypePreferences: z.array(z.string()).optional(),
});

export type DietaryHabitsFormValues = z.infer<typeof dietaryHabitsFormSchema>;

interface DietaryHabitsFormProps {
  initialData?: DietaryHabitsFormValues; // Changed to accept the form values type directly
  onSave: (data: DietaryHabitsFormValues) => void;
}

export function DietaryHabitsForm({ initialData, onSave }: DietaryHabitsFormProps) {
  const { toast } = useToast();
  
  const form = useForm<DietaryHabitsFormValues>({
    resolver: zodResolver(dietaryHabitsFormSchema),
    defaultValues: {
      dietaryHabits_breakfastDays: initialData?.dietaryHabits_breakfastDays || undefined,
      dietaryHabits_lateSnackDays: initialData?.dietaryHabits_lateSnackDays || undefined,
      dietaryHabits_badHabits: initialData?.dietaryHabits_badHabits || [],
      dietaryHabits_preferences: initialData?.dietaryHabits_preferences || [],
      dietaryHabits_foodTypePreferences: initialData?.dietaryHabits_foodTypePreferences || [],
    },
  });

  useEffect(() => {
    form.reset({
      dietaryHabits_breakfastDays: initialData?.dietaryHabits_breakfastDays || undefined,
      dietaryHabits_lateSnackDays: initialData?.dietaryHabits_lateSnackDays || undefined,
      dietaryHabits_badHabits: initialData?.dietaryHabits_badHabits || [],
      dietaryHabits_preferences: initialData?.dietaryHabits_preferences || [],
      dietaryHabits_foodTypePreferences: initialData?.dietaryHabits_foodTypePreferences || [],
    });
  }, [initialData, form]);

  function onSubmit(data: DietaryHabitsFormValues) {
    onSave(data);
    toast({
      title: "饮食习惯已保存",
      description: "您的饮食习惯信息已更新。",
    });
  }

  const renderCheckboxGroup = (
    name: keyof DietaryHabitsFormValues,
    label: string,
    options: readonly string[]
  ) => (
    <FormField
      control={form.control}
      name={name as any} 
      render={() => (
        <FormItem>
          <FormLabel className="text-sm">{label}</FormLabel>
          <ScrollArea className="h-auto max-h-32 w-full rounded-md border p-2">
            <div className="grid grid-cols-2 gap-2">
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
          </ScrollArea>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Card className="shadow-sm mt-4">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">编辑饮食习惯</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="dietaryHabits_breakfastDays"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm">1.您平均每周吃早餐的天数：</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap gap-x-3 gap-y-1"
                    >
                      {breakfastAndSnackDaysOptions.map((option) => (
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
            <FormField
              control={form.control}
              name="dietaryHabits_lateSnackDays"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm">2.您平均每周吃夜宵的天数：</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap gap-x-3 gap-y-1"
                    >
                      {breakfastAndSnackDaysOptions.map((option) => (
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
            
            {renderCheckboxGroup("dietaryHabits_badHabits", "3.您目前饮食的不良习惯：", badHabitsOptions)}
            {renderCheckboxGroup("dietaryHabits_preferences", "4.您目前饮食方面的喜好（多选）：", tastePreferencesOptions)}
            {renderCheckboxGroup("dietaryHabits_foodTypePreferences", "5.您的饮食偏好（多选）：", foodTypePreferencesOptions)}

            <div className="flex justify-end">
              <Button type="submit">保存饮食习惯</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
