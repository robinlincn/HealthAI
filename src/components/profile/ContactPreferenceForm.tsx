
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
import type { ContactPreferenceMethod, ContactPreferenceFrequency, ContactPreferenceTime } from "@/lib/types";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const contactMethodOptions: (ContactPreferenceMethod | string)[] = ['电话', '微信', '短信', '邮件', '其他'];
const contactFrequencyOptions: (ContactPreferenceFrequency | string)[] = ['每周两次', '每周一次', '两周一次', '根据实际情况需要', '其他'];
const contactTimeOptions: (ContactPreferenceTime | string)[] = ['上午', '下午', '晚上7点后', '其他'];

const contactPreferenceFormSchema = z.object({
  otherInfo_contactPreference_method: z.string().optional(),
  otherInfo_contactPreference_method_other: z.string().optional(),
  otherInfo_contactPreference_frequency: z.string().optional(),
  otherInfo_contactPreference_frequency_other: z.string().optional(),
  otherInfo_contactPreference_time: z.string().optional(),
  otherInfo_contactPreference_time_other: z.string().optional(),
}).refine(data => {
  if (data.otherInfo_contactPreference_method === '其他' && (!data.otherInfo_contactPreference_method_other || data.otherInfo_contactPreference_method_other.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "请填写“其他”联系方式。",
  path: ["otherInfo_contactPreference_method_other"],
}).refine(data => {
  if (data.otherInfo_contactPreference_frequency === '其他' && (!data.otherInfo_contactPreference_frequency_other || data.otherInfo_contactPreference_frequency_other.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "请填写“其他”联系频率。",
  path: ["otherInfo_contactPreference_frequency_other"],
}).refine(data => {
  if (data.otherInfo_contactPreference_time === '其他' && (!data.otherInfo_contactPreference_time_other || data.otherInfo_contactPreference_time_other.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "请填写“其他”联系时间。",
  path: ["otherInfo_contactPreference_time_other"],
});

export type ContactPreferenceFormValues = z.infer<typeof contactPreferenceFormSchema>;

interface ContactPreferenceFormProps {
  initialData?: ContactPreferenceFormValues;
  onSave: (data: ContactPreferenceFormValues) => void;
}

export function ContactPreferenceForm({ initialData, onSave }: ContactPreferenceFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ContactPreferenceFormValues>({
    resolver: zodResolver(contactPreferenceFormSchema),
    defaultValues: initialData || {
        otherInfo_contactPreference_method: undefined,
        otherInfo_contactPreference_method_other: '',
        otherInfo_contactPreference_frequency: undefined,
        otherInfo_contactPreference_frequency_other: '',
        otherInfo_contactPreference_time: undefined,
        otherInfo_contactPreference_time_other: '',
    },
  });

  useEffect(() => {
    form.reset(initialData || {
        otherInfo_contactPreference_method: undefined,
        otherInfo_contactPreference_method_other: '',
        otherInfo_contactPreference_frequency: undefined,
        otherInfo_contactPreference_frequency_other: '',
        otherInfo_contactPreference_time: undefined,
        otherInfo_contactPreference_time_other: '',
    });
  }, [initialData, form]);

  const watchedMethod = form.watch("otherInfo_contactPreference_method");
  const watchedFrequency = form.watch("otherInfo_contactPreference_frequency");
  const watchedTime = form.watch("otherInfo_contactPreference_time");

  function onSubmit(data: ContactPreferenceFormValues) {
    const dataToSave = { ...data };
    if (data.otherInfo_contactPreference_method !== '其他') dataToSave.otherInfo_contactPreference_method_other = '';
    if (data.otherInfo_contactPreference_frequency !== '其他') dataToSave.otherInfo_contactPreference_frequency_other = '';
    if (data.otherInfo_contactPreference_time !== '其他') dataToSave.otherInfo_contactPreference_time_other = '';
    onSave(dataToSave);
    toast({
      title: "联系偏好已保存",
      description: "您的联系偏好设置已更新。",
    });
  }

  const renderRadioGroupField = (
    name: keyof ContactPreferenceFormValues,
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
        <CardTitle className="text-base">编辑沟通偏好</CardTitle>
        <FormDescription className="text-xs">我们的医务人员会在您个性化调理过程中支持与沟通健康进展，您希望什么样的方式来联系您？</FormDescription>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[calc(100vh-28rem)] pr-3"> 
                <div className="space-y-6">
                    {renderRadioGroupField("otherInfo_contactPreference_method", "联系方式：", contactMethodOptions)}
                    {watchedMethod === '其他' && (
                        <FormField
                        control={form.control}
                        name="otherInfo_contactPreference_method_other"
                        render={({ field }) => (
                            <FormItem className="pl-4">
                            <FormLabel className="text-xs">请注明其他方式：</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="其他联系方式" className="h-8 text-xs" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    )}

                    {renderRadioGroupField("otherInfo_contactPreference_frequency", "联系频率：", contactFrequencyOptions)}
                    {watchedFrequency === '其他' && (
                        <FormField
                        control={form.control}
                        name="otherInfo_contactPreference_frequency_other"
                        render={({ field }) => (
                            <FormItem className="pl-4">
                            <FormLabel className="text-xs">请注明其他频率：</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="其他联系频率" className="h-8 text-xs" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    )}

                    {renderRadioGroupField("otherInfo_contactPreference_time", "联系时间：", contactTimeOptions)}
                    {watchedTime === '其他' && (
                        <FormField
                        control={form.control}
                        name="otherInfo_contactPreference_time_other"
                        render={({ field }) => (
                            <FormItem className="pl-4">
                            <FormLabel className="text-xs">请注明其他时间：</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="其他联系时间" className="h-8 text-xs" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    )}
                </div>
            </ScrollArea>
            <div className="flex justify-end pt-4">
              <Button type="submit">保存联系偏好</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
