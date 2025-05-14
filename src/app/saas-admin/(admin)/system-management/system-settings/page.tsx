
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, Palette, BellRing, ShieldAlert, ServerCrash, Languages, Clock, Save } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const settingsSchema = z.object({
    platformName: z.string().min(3, "平台名称至少3个字符。"),
    defaultTheme: z.enum(["light", "dark", "system"]),
    maintenanceMode: z.boolean(),
    defaultLanguage: z.enum(["zh-CN", "en-US"]),
    sessionTimeout: z.coerce.number().min(5, "会话超时至少5分钟。").max(120, "会话超时最多120分钟."),
    adminEmail: z.string().email("请输入有效的管理员邮箱。").optional().or(z.literal('')),
    smtpServer: z.string().optional(), // Further validation can be added if SMTP is actively used
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SystemSettingsPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      platformName: "AI慢病管理SAAS平台",
      defaultTheme: "light",
      maintenanceMode: false,
      defaultLanguage: "zh-CN",
      sessionTimeout: 30,
      adminEmail: "admin@saas.example.com",
      smtpServer: "",
    },
  });
  
  useEffect(() => {
    setIsClient(true);
    // In a real app, fetch settings from backend and populate form
    // form.reset(fetchedSettings); 
  }, [form]);


  const onSubmit = (data: SettingsFormValues) => {
    console.log("Saving system settings:", data);
    toast({ title: "设置已保存 (模拟)", description: "系统全局设置已成功更新。" });
  };
  
  if (!isClient) {
     return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>系统设置</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载设置数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Settings2 className="h-6 w-6 text-primary" />
            平台参数设置
          </CardTitle>
          <CardDescription>
            配置SAAS平台的全局参数、默认行为和维护选项。
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center"><Palette className="mr-2 h-5 w-5"/>平台基础设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="platformName" render={({field}) => (
                        <FormItem><FormLabel>平台名称</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                    <FormField control={form.control} name="defaultTheme" render={({field}) => (
                        <FormItem>
                            <FormLabel>默认主题</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="light">浅色模式</SelectItem>
                                    <SelectItem value="dark">深色模式</SelectItem>
                                    <SelectItem value="system">跟随系统</SelectItem>
                                </SelectContent>
                            </Select><FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="defaultLanguage" render={({field}) => (
                        <FormItem>
                            <FormLabel>默认语言</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="zh-CN">简体中文</SelectItem>
                                    <SelectItem value="en-US">English (US)</SelectItem>
                                </SelectContent>
                            </Select><FormMessage/>
                        </FormItem>
                    )}/>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center"><BellRing className="mr-2 h-5 w-5"/>通知与邮件</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="smtpServer" render={({field}) => (
                        <FormItem><FormLabel>SMTP服务器地址 (可选)</FormLabel><FormControl><Input placeholder="smtp.example.com" {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                    <FormField control={form.control} name="adminEmail" render={({field}) => (
                        <FormItem><FormLabel>管理员邮箱 (用于接收系统通知)</FormLabel><FormControl><Input type="email" placeholder="admin@saas.com" {...field} /></FormControl><FormMessage/></FormItem>
                    )}/>
                    <p className="text-xs text-muted-foreground">邮件服务器、短信网关等高级配置功能正在开发中。</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center"><ShieldAlert className="mr-2 h-5 w-5"/>安全与维护</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="maintenanceMode" render={({field}) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <FormLabel>启用维护模式</FormLabel>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )}/>
                    <p className="text-xs text-muted-foreground -mt-2 px-3">启用后，普通用户将无法访问平台，仅管理员可见。</p>
                    
                    <FormField control={form.control} name="sessionTimeout" render={({field}) => (
                        <FormItem>
                            <FormLabel>会话超时时间 (分钟)</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <Button variant="destructive" onClick={() => toast({title: "提示", description:"清理系统缓存功能开发中。"})} className="w-full" type="button">
                        <ServerCrash className="mr-2 h-4 w-4"/>清理系统缓存
                    </Button>
                </CardContent>
            </Card>
            </div>
            <div className="flex justify-end mt-6">
                <Button type="submit"><Save className="mr-2 h-4 w-4" />保存所有设置</Button>
            </div>
        </form>
      </Form>
    </div>
  );
}
