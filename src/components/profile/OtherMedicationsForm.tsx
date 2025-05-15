
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const otherMedicationsFormSchema = z.object({
  otherInfo_medicationsUsed: z.string().optional(),
});

export type OtherMedicationsFormValues = z.infer<typeof otherMedicationsFormSchema>;

interface OtherMedicationsFormProps {
  initialData?: OtherMedicationsFormValues;
  onSave: (data: OtherMedicationsFormValues) => void;
}

export function OtherMedicationsForm({ initialData, onSave }: OtherMedicationsFormProps) {
  const { toast } = useToast();
  
  const form = useForm<OtherMedicationsFormValues>({
    resolver: zodResolver(otherMedicationsFormSchema),
    defaultValues: initialData || { otherInfo_medicationsUsed: "" },
  });

  useEffect(() => {
    form.reset(initialData || { otherInfo_medicationsUsed: "" });
  }, [initialData, form]);

  function onSubmit(data: OtherMedicationsFormValues) {
    onSave(data);
    toast({
      title: "药物使用信息已保存",
      description: "您的药物使用信息已更新。",
    });
  }

  return (
    <Card className="shadow-sm mt-4">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">编辑您使用的药物</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otherInfo_medicationsUsed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">您有使用何种药物？请详细列出：</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例如：阿司匹林 100mg 每日一次，二甲双胍 0.5g 每日两次..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit">保存药物信息</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
