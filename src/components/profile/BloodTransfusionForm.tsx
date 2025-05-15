
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const bloodTransfusionFormSchema = z.object({
  historyText: z.string().optional(),
});

type BloodTransfusionFormValues = z.infer<typeof bloodTransfusionFormSchema>;

interface BloodTransfusionFormProps {
  initialHistoryText?: string;
  onSave: (historyText?: string) => void;
}

export function BloodTransfusionForm({ initialHistoryText, onSave }: BloodTransfusionFormProps) {
  const { toast } = useToast();
  
  const form = useForm<BloodTransfusionFormValues>({
    resolver: zodResolver(bloodTransfusionFormSchema),
    defaultValues: {
      historyText: initialHistoryText || "",
    },
  });

  useEffect(() => {
    form.reset({ historyText: initialHistoryText || "" });
  }, [initialHistoryText, form]);

  function onSubmit(data: BloodTransfusionFormValues) {
    onSave(data.historyText);
    toast({
      title: "输血史已保存",
      description: "您的输血史信息已更新。",
    });
  }

  return (
    <Card className="shadow-sm mt-4">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">编辑输血史</CardTitle>
        <CardDescription className="text-xs">（请您描述时间及输血原因）</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="historyText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="historyText" className="sr-only">输血史描述</FormLabel>
                  <FormControl>
                    <Textarea
                      id="historyText"
                      placeholder="例如：2010年因外伤手术输血约400ml，无不良反应。"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">保存输血史</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
