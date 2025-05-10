
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { EmergencyContact } from "@/lib/types";
import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const emergencyContactSchema = z.object({
  id: z.string().optional(), // Keep existing ID or generate new
  name: z.string().min(2, "姓名至少需要2个字符。"),
  relationship: z.string().min(1, "关系不能为空。"),
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入有效的中国大陆手机号码。"),
});

const emergencyContactsFormSchema = z.object({
  contacts: z.array(emergencyContactSchema),
});

type EmergencyContactsFormValues = z.infer<typeof emergencyContactsFormSchema>;

// Mock data
const defaultValues: EmergencyContactsFormValues = {
  contacts: [
    { id: "1", name: "张三", relationship: "配偶", phone: "13900139000" },
    { id: "2", name: "李四", relationship: "子女", phone: "13700137000" },
  ],
};

export function EmergencyContacts() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<EmergencyContactsFormValues>({
    resolver: zodResolver(emergencyContactsFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  function onSubmit(data: EmergencyContactsFormValues) {
    console.log("Emergency contacts submitted:", data);
    toast({
      title: "紧急联系人已更新",
      description: "您的紧急联系人信息已成功保存。",
    });
  }
  
  if (!isClient) {
    return <div className="space-y-4">加载中...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative pt-2 shadow-sm"> {/* Added shadow-sm */}
             <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">删除联系人</span>
              </Button>
            <CardContent className="space-y-4 pt-4"> {/* Added pt-4 to CardContent for better spacing with top button */}
              <FormField
                control={form.control}
                name={`contacts.${index}.name`}
                render={({ field: itemField }) => (
                  <FormItem>
                    <FormLabel>姓名</FormLabel>
                    <FormControl>
                      <Input placeholder="联系人姓名" {...itemField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`contacts.${index}.relationship`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>关系</FormLabel>
                      <FormControl>
                        <Input placeholder="如：配偶、子女" {...itemField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`contacts.${index}.phone`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>电话</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="联系人电话" {...itemField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex space-x-4 pt-2"> {/* Added pt-2 for spacing */}
            <Button
            type="button"
            variant="outline"
            onClick={() => append({ id: Date.now().toString(), name: "", relationship: "", phone: "" })}
            >
            <PlusCircle className="mr-2 h-4 w-4" /> 添加紧急联系人
            </Button>
            <Button type="submit">保存更新</Button>
        </div>
      </form>
    </Form>
  );
}

