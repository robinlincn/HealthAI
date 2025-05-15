
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
import type { YesNoOption, ImpactLevelOption, SASOption } from "@/lib/types";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const yesNoOptions: YesNoOption[] = ['是', '否']; // Simplified based on typical UI
const impactAndStressLevelOptions: ImpactLevelOption[] = ['几乎没有', '有一点', '较明显', '很大'];
const sasQuestionOptions: SASOption[] = ['没有或很少有时间有', '小部分时间有', '相当多时间有', '绝大部分或全部时间都有'];

const mentalHealthFormSchema = z.object({
  mentalHealth_majorEvents: z.string().optional() as z.ZodType<YesNoOption | undefined>,
  mentalHealth_impactOnLife: z.string().optional() as z.ZodType<ImpactLevelOption | undefined>,
  mentalHealth_stressLevel: z.string().optional() as z.ZodType<ImpactLevelOption | undefined>,
  mentalHealth_sas_anxiety: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_fear: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_panic: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_goingCrazy: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_misfortune: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_trembling: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_bodyPain: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_fatigue: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_restlessness: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_palpitations: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_dizziness: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_fainting: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_breathingDifficulty: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_paresthesia: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_stomachPain: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_frequentUrination: z.string().optional() as z.ZodType<SASOption | undefined>,
  mentalHealth_sas_sweating: z.string().optional() as z.ZodType<SASOption | undefined>,
});

export type MentalHealthFormValues = z.infer<typeof mentalHealthFormSchema>;

interface MentalHealthFormProps {
  initialData?: MentalHealthFormValues;
  onSave: (data: MentalHealthFormValues) => void;
}

const sasQuestions = [
  { name: "mentalHealth_sas_anxiety", label: "4. 我觉得比平常容易紧张和着急（焦虑）" },
  { name: "mentalHealth_sas_fear", label: "5. 我无缘无故地感到害怕（害怕）" },
  { name: "mentalHealth_sas_panic", label: "6. 我容易心里烦乱或觉得惊恐（惊恐）" },
  { name: "mentalHealth_sas_goingCrazy", label: "7. 我觉得我可能将要发疯（发疯感）" },
  { name: "mentalHealth_sas_misfortune", label: "8. 我觉得一切都很好，也不会发生什么不幸（不幸预感）。" },
  { name: "mentalHealth_sas_trembling", label: "9. 我手脚发抖打颤（手足颇抖）。" },
  { name: "mentalHealth_sas_bodyPain", label: "10. 我因为头痛，颈痛和背痛而苦恼（躯体疼痛）" },
  { name: "mentalHealth_sas_fatigue", label: "11. 我感觉容易衰弱和疲乏（乏力）。" },
  { name: "mentalHealth_sas_restlessness", label: "12. 我觉得心平气和，并且容易安静坐着（静坐不能）。" },
  { name: "mentalHealth_sas_palpitations", label: "13. 我觉得心跳很快（心悸）。" },
  { name: "mentalHealth_sas_dizziness", label: "14. 我因为一阵阵头晕而苦恼（头昏）。" },
  { name: "mentalHealth_sas_fainting", label: "15. 我有晕倒发作或觉得要晕倒似的（晕厥感）。" },
  { name: "mentalHealth_sas_breathingDifficulty", label: "16. 我呼气吸气都感到很容易（呼吸困难）。" },
  { name: "mentalHealth_sas_paresthesia", label: "17. 我手脚麻木和刺痛（手足刺痛）。" },
  { name: "mentalHealth_sas_stomachPain", label: "18. 我因为胃痛和消化不良而苦恼（胃痛或消化不良）。" },
  { name: "mentalHealth_sas_frequentUrination", label: "19. 我常常要小便（尿意频数）。" },
  { name: "mentalHealth_sas_sweating", label: "20. 我的手常常是干燥温暖的（多汗）。" },
] as const;


export function MentalHealthForm({ initialData, onSave }: MentalHealthFormProps) {
  const { toast } = useToast();
  
  const form = useForm<MentalHealthFormValues>({
    resolver: zodResolver(mentalHealthFormSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      // Ensure all fields are reset if initialData is not provided or becomes null/undefined
      form.reset({
        mentalHealth_majorEvents: undefined,
        mentalHealth_impactOnLife: undefined,
        mentalHealth_stressLevel: undefined,
        mentalHealth_sas_anxiety: undefined,
        mentalHealth_sas_fear: undefined,
        mentalHealth_sas_panic: undefined,
        mentalHealth_sas_goingCrazy: undefined,
        mentalHealth_sas_misfortune: undefined,
        mentalHealth_sas_trembling: undefined,
        mentalHealth_sas_bodyPain: undefined,
        mentalHealth_sas_fatigue: undefined,
        mentalHealth_sas_restlessness: undefined,
        mentalHealth_sas_palpitations: undefined,
        mentalHealth_sas_dizziness: undefined,
        mentalHealth_sas_fainting: undefined,
        mentalHealth_sas_breathingDifficulty: undefined,
        mentalHealth_sas_paresthesia: undefined,
        mentalHealth_sas_stomachPain: undefined,
        mentalHealth_sas_frequentUrination: undefined,
        mentalHealth_sas_sweating: undefined,
      });
    }
  }, [initialData, form]);

  function onSubmit(data: MentalHealthFormValues) {
    onSave(data);
    toast({
      title: "心理健康信息已保存",
      description: "您的心理健康评估数据已更新。",
    });
  }

  const renderRadioGroupField = (
    name: keyof MentalHealthFormValues,
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
        <CardTitle className="text-base">编辑心理健康信息</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[calc(100vh-28rem)] pr-3"> {/* Adjust height as needed */}
                <div className="space-y-6">
                    {renderRadioGroupField("mentalHealth_majorEvents", "1. 您正受一些重大意外困扰：(如重大经济损失、亲属亡故或自然灾害等)", yesNoOptions)}
                    {renderRadioGroupField("mentalHealth_impactOnLife", "2. 情绪对工作或生活的影响：", impactAndStressLevelOptions)}
                    {renderRadioGroupField("mentalHealth_stressLevel", "3. 您感觉到自己的精神压力：", impactAndStressLevelOptions)}
                    
                    <div className="pt-4">
                        <FormLabel className="text-sm font-semibold block mb-1">焦虑自评问卷 (SAS)</FormLabel>
                        <FormDescription className="text-xs mb-3">
                            根据您最近一周的实际情况，在下面适当的方格里划一勾（√），请您不要漏评某一项目，也不要在相同一个项目里打两个勾（即不要重复评定）。
                        </FormDescription>
                        <div className="space-y-5">
                            {sasQuestions.map((q) => (
                                <div key={q.name}>
                                    {renderRadioGroupField(q.name as keyof MentalHealthFormValues, q.label, sasQuestionOptions)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollArea>
            <div className="flex justify-end pt-4">
              <Button type="submit">保存心理健康信息</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
