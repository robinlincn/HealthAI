
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
import type { ServiceSatisfactionOption } from "@/lib/types";
import { useEffect } from "react";

const serviceSatisfactionOptions: ServiceSatisfactionOption[] = ['满意', '较好', '一般', '不满意'];

const serviceSatisfactionFormSchema = z.object({
  otherInfo_serviceSatisfaction: z.string().optional() as z.ZodType<ServiceSatisfactionOption | undefined>,
});

export type ServiceSatisfactionFormValues = z.infer<typeof serviceSatisfactionFormSchema>;

interface ServiceSatisfactionFormProps {
  initialData?: ServiceSatisfactionFormValues;
  onSave: (data: ServiceSatisfactionFormValues) => void;
}

export function ServiceSatisfactionForm({ initialData, onSave }: ServiceSatisfactionFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ServiceSatisfactionFormValues>({
    resolver: zodResolver(serviceSatisfactionFormSchema),
    defaultValues: initialData || { otherInfo_serviceSatisfaction: undefined },
  });

  useEffect(() => {
    form.reset(initialData || { otherInfo_serviceSatisfaction: undefined });
  }, [initialData, form]);

  function onSubmit(data: ServiceSatisfactionFormValues) {
    onSave(data);
    toast({
      title: "评价已提交",
      description: "感谢您对我们服务的评价！",
    });
  }

  return (
    <Card className="shadow-sm mt-4">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">您对我中心的服务评价</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otherInfo_serviceSatisfaction"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm sr-only">服务满意度</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap gap-x-3 gap-y-1"
                    >
                      {serviceSatisfactionOptions.map((option) => (
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
              <Button type="submit">提交评价</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
