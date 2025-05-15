
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
import type { DietaryIntakeOption } from "@/lib/types"; // Assuming DietaryIntakeOption covers all variants
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const stapleOptions: DietaryIntakeOption[] = ['<1碗', '1-2碗', '2-4碗', '4-6碗', '≥6碗'];
const meatFishSoyOptions: DietaryIntakeOption[] = ['不吃', '<1两', '1-2两', '2-5两', '≥5两'];
const eggOptions: DietaryIntakeOption[] = ['不吃', '<1个', '1-2个', '2-3个', '≥3个'];
const dairyOptions: DietaryIntakeOption[] = ['不吃', '<1杯', '1-2杯', '2-3杯', '≥3杯'];
const soyIntakeOptions: DietaryIntakeOption[] = ['不吃', '<0.5两', '0.5-1两', '1-2两', '≥2两'];
const vegetableOptions: DietaryIntakeOption[] = ['<2两', '2-6两', '6-10两', '10-15两', '≥15两'];
const fruitOptions: DietaryIntakeOption[] = ['<1两', '1-4两', '4-8两', '8-12两', '≥12两'];
const waterOptions: DietaryIntakeOption[] = ['<3杯', '3-6杯', '6-9杯', '9-12杯', '≥12杯'];


const dietaryIntakeFormSchema = z.object({
  dietaryIntake_staple: z.string().optional(),
  dietaryIntake_meat: z.string().optional(),
  dietaryIntake_fish: z.string().optional(),
  dietaryIntake_eggs: z.string().optional(),
  dietaryIntake_dairy: z.string().optional(),
  dietaryIntake_soy: z.string().optional(),
  dietaryIntake_vegetables: z.string().optional(),
  dietaryIntake_fruits: z.string().optional(),
  dietaryIntake_water: z.string().optional(),
});

export type DietaryIntakeFormValues = z.infer<typeof dietaryIntakeFormSchema>;

interface DietaryIntakeFormProps {
  initialData?: DietaryIntakeFormValues;
  onSave: (data: DietaryIntakeFormValues) => void;
}

export function DietaryIntakeForm({ initialData, onSave }: DietaryIntakeFormProps) {
  const { toast } = useToast();
  
  const form = useForm<DietaryIntakeFormValues>({
    resolver: zodResolver(dietaryIntakeFormSchema),
    defaultValues: initialData || {
        dietaryIntake_staple: undefined,
        dietaryIntake_meat: undefined,
        dietaryIntake_fish: undefined,
        dietaryIntake_eggs: undefined,
        dietaryIntake_dairy: undefined,
        dietaryIntake_soy: undefined,
        dietaryIntake_vegetables: undefined,
        dietaryIntake_fruits: undefined,
        dietaryIntake_water: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  function onSubmit(data: DietaryIntakeFormValues) {
    onSave(data);
    toast({
      title: "膳食摄入已保存",
      description: "您的膳食摄入信息已更新。",
    });
  }

  const renderRadioGroupField = (
    name: keyof DietaryIntakeFormValues,
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
        <CardTitle className="text-base">编辑膳食摄入（个人）</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[calc(100vh-25rem)] pr-3"> {/* Adjust height as needed */}
                <div className="space-y-6">
                    {renderRadioGroupField("dietaryIntake_staple", "1. 米、面、薯类日均摄入量：", stapleOptions, "一碗指2两")}
                    {renderRadioGroupField("dietaryIntake_meat", "2. 肉类及肉制品日均摄入量：", meatFishSoyOptions)}
                    {renderRadioGroupField("dietaryIntake_fish", "3. 鱼类及水产品日均摄入量：", meatFishSoyOptions)}
                    {renderRadioGroupField("dietaryIntake_eggs", "4. 蛋类及蛋制品日均摄入量：", eggOptions, "一个指50g")}
                    {renderRadioGroupField("dietaryIntake_dairy", "5. 奶类及奶制品日均摄入量：", dairyOptions, "一杯指200ml, 200ml相当于半瓶矿泉水")}
                    {renderRadioGroupField("dietaryIntake_soy", "6. 大豆及豆制品日均摄入量：", soyIntakeOptions)}
                    {renderRadioGroupField("dietaryIntake_vegetables", "7. 新鲜蔬菜日均摄入量：", vegetableOptions)}
                    {renderRadioGroupField("dietaryIntake_fruits", "8. 新鲜水果日均摄入量：", fruitOptions)}
                    {renderRadioGroupField("dietaryIntake_water", "9. 平均日饮水摄入量：", waterOptions, "一杯指200ml")}
                </div>
            </ScrollArea>
            <div className="flex justify-end pt-4">
              <Button type="submit">保存膳食摄入</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
