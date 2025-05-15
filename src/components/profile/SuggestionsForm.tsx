
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

const suggestionsFormSchema = z.object({
  otherInfo_suggestions: z.string().optional(),
});

export type SuggestionsFormValues = z.infer<typeof suggestionsFormSchema>;

interface SuggestionsFormProps {
  initialData?: SuggestionsFormValues;
  onSave: (data: SuggestionsFormValues) => void;
}

export function SuggestionsForm({ initialData, onSave }: SuggestionsFormProps) {
  const { toast } = useToast();
  
  const form = useForm<SuggestionsFormValues>({
    resolver: zodResolver(suggestionsFormSchema),
    defaultValues: initialData || { otherInfo_suggestions: "" },
  });

  useEffect(() => {
    form.reset(initialData || { otherInfo_suggestions: "" });
  }, [initialData, form]);

  function onSubmit(data: SuggestionsFormValues) {
    onSave(data);
    toast({
      title: "建议已提交",
      description: "感谢您对本中心的建议！",
    });
  }

  return (
    <Card className="shadow-sm mt-4">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">您对本中心的建议</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otherInfo_suggestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sr-only">建议内容</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="请输入您宝贵的建议..."
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit">提交建议</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
