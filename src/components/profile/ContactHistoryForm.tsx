
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const contactHistoryOptions = [
  "油烟", "粉烟尘", "毒、致癌物", "高温", "低温", "噪音", "辐射"
];

const contactHistoryFormSchema = z.object({
  selectedContactHistory: z.array(z.string()).optional(),
});

type ContactHistoryFormValues = z.infer<typeof contactHistoryFormSchema>;

interface ContactHistoryFormProps {
  initialContactHistory?: string[];
  onSave: (history: string[]) => void;
}

export function ContactHistoryForm({ initialContactHistory, onSave }: ContactHistoryFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ContactHistoryFormValues>({
    resolver: zodResolver(contactHistoryFormSchema),
    defaultValues: {
      selectedContactHistory: initialContactHistory || [],
    },
  });

  useEffect(() => {
    form.reset({ selectedContactHistory: initialContactHistory || [] });
  }, [initialContactHistory, form]);

  function onSubmit(data: ContactHistoryFormValues) {
    onSave(data.selectedContactHistory || []);
    toast({
      title: "接触史已保存",
      description: "您的接触史信息已更新。",
    });
  }

  return (
    <Card className="shadow-sm mt-4">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">编辑接触史</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="selectedContactHistory"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm">请选择您有过的接触史：</FormLabel>
                  <ScrollArea className="h-40 w-full rounded-md border p-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                      {contactHistoryOptions.map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="selectedContactHistory"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item}
                                className="flex flex-row items-center space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item])
                                        : field.onChange(
                                            (field.value || []).filter(
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
            <div className="flex justify-end">
              <Button type="submit">保存接触史</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

