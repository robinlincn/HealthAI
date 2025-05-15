
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
import type { SleepAdequacyOption } from "@/lib/types";
import { useEffect } from "react";

const sleepAdequacyOptions: SleepAdequacyOption[] = ['充足', '一般', '不足', '严重不足'];

const sleepFormSchema = z.object({
  sleep_adequacy: z.string().optional() as z.ZodType<SleepAdequacyOption | undefined>,
});

export type SleepFormValues = z.infer<typeof sleepFormSchema>;

interface SleepFormProps {
  initialData?: SleepFormValues;
  onSave: (data: SleepFormValues) => void;
}

export function SleepForm({ initialData, onSave }: SleepFormProps) {
  const { toast } = useToast();
  
  const form = useForm<SleepFormValues>({
    resolver: zodResolver(sleepFormSchema),
    defaultValues: initialData || { sleep_adequacy: undefined },
  });

  useEffect(() => {
    form.reset(initialData || { sleep_adequacy: undefined });
  }, [initialData, form]);

  function onSubmit(data: SleepFormValues) {
    onSave(data);
    toast({
      title: "睡眠信息已保存",
      description: "您的睡眠情况信息已更新。",
    });
  }

  return (
    <Card className="shadow-sm mt-4">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">编辑睡眠情况</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="sleep_adequacy"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm">您感觉自己的睡眠充足吗：</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap gap-x-3 gap-y-1"
                    >
                      {sleepAdequacyOptions.map((option) => (
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
            <div className="flex justify-end pt-4">
              <Button type="submit">保存睡眠信息</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
