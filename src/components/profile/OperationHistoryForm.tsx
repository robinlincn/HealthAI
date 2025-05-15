
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

const operationHistoryOptions = [
  "头颅（含脑）", "眼耳鼻咽喉", "颌面部及口腔", "颈部或甲状腺胸部（含肺部）",
  "心脏（含心脏介入）", "外周血管", "胃肠", "肝胆", "肾脏", "脊柱",
  "四肢及关节", "膀胱", "妇科", "乳腺", "前列腺", "其它"
];

const operationHistoryFormSchema = z.object({
  selectedOperations: z.array(z.string()).optional(),
});

type OperationHistoryFormValues = z.infer<typeof operationHistoryFormSchema>;

interface OperationHistoryFormProps {
  initialOperationHistory?: string[];
  onSave: (operations: string[]) => void;
}

export function OperationHistoryForm({ initialOperationHistory, onSave }: OperationHistoryFormProps) {
  const { toast } = useToast();
  
  const form = useForm<OperationHistoryFormValues>({
    resolver: zodResolver(operationHistoryFormSchema),
    defaultValues: {
      selectedOperations: initialOperationHistory || [],
    },
  });

  useEffect(() => {
    form.reset({ selectedOperations: initialOperationHistory || [] });
  }, [initialOperationHistory, form]);

  function onSubmit(data: OperationHistoryFormValues) {
    onSave(data.selectedOperations || []);
    toast({
      title: "手术史已保存",
      description: "您的手术史信息已更新。",
    });
  }

  return (
    <Card className="shadow-sm mt-4">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">编辑手术史</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="selectedOperations"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm">请选择您经历过的手术（可多选）：</FormLabel>
                  <ScrollArea className="h-60 w-full rounded-md border p-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                      {operationHistoryOptions.map((operation) => (
                        <FormField
                          key={operation}
                          control={form.control}
                          name="selectedOperations"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={operation}
                                className="flex flex-row items-center space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(operation)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), operation])
                                        : field.onChange(
                                            (field.value || []).filter(
                                              (value) => value !== operation
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-xs font-normal leading-tight">
                                  {operation}
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
              <Button type="submit">保存手术史</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
