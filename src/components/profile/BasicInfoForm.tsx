"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { UserProfile } from "@/lib/types";
import { useEffect, useState } from "react";

const profileFormSchema = z.object({
  name: z.string().min(2, "姓名至少需要2个字符。").max(50, "姓名不能超过50个字符。"),
  gender: z.enum(["male", "female", "other"], { required_error: "请选择性别。" }),
  age: z.coerce.number().min(0, "年龄不能为负。").max(120, "年龄不合理。"),
  contactPhone: z.string().regex(/^1[3-9]\d{9}$/, "请输入有效的中国大陆手机号码。").or(z.literal("")),
  contactEmail: z.string().email("请输入有效的邮箱地址。").or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Mock data - in a real app, this would come from an API
const defaultValues: Partial<ProfileFormValues> = {
  name: "示例用户",
  gender: "male",
  age: 30,
  contactPhone: "13800138000",
  contactEmail: "user@example.com",
};

export function BasicInfoForm() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    console.log("Profile data submitted:", data);
    toast({
      title: "信息已更新",
      description: "您的基本信息已成功保存。",
    });
  }

  if (!isClient) {
    // Render a loading state or null on the server to avoid hydration mismatch for form default values
    return <div className="space-y-4">加载中...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>姓名</FormLabel>
              <FormControl>
                <Input placeholder="请输入您的姓名" {...field} />
              </FormControl>
              <FormDescription>您的公开显示名称。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>性别</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择您的性别" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">男性</SelectItem>
                    <SelectItem value="female">女性</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>年龄</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="请输入您的年龄" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>联系电话</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="请输入您的手机号码" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>电子邮箱</FormLabel>
              <FormControl>
                <Input type="email" placeholder="请输入您的邮箱地址" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">保存更新</Button>
      </form>
    </Form>
  );
}
