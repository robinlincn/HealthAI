
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrainCog, Save, Eye, EyeOff } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define a type for LLM settings (can be expanded)
interface LlmSettings {
  apiKey: string;
  apiEndpoint: string;
  modelName: string;
}

const llmSettingsSchema = z.object({
  apiKey: z.string().min(1, "API密钥不能为空。"),
  apiEndpoint: z.string().url("请输入有效的API端点URL。").min(1, "API端点URL不能为空。"),
  modelName: z.string().min(1, "模型名称/标识符不能为空。"),
});

type LlmSettingsFormValues = z.infer<typeof llmSettingsSchema>;

// Mock storage key
const LLM_SETTINGS_STORAGE_KEY = 'saas_llm_settings';

export default function LlmSettingsPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const form = useForm<LlmSettingsFormValues>({
    resolver: zodResolver(llmSettingsSchema),
    defaultValues: {
      apiKey: "",
      apiEndpoint: "",
      modelName: "",
    },
  });

  useEffect(() => {
    setIsClient(true);
    // Load settings from localStorage on mount (client-side only)
    const storedSettings = localStorage.getItem(LLM_SETTINGS_STORAGE_KEY);
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings) as LlmSettings;
        form.reset(parsedSettings);
      } catch (e) {
        console.error("Error parsing stored LLM settings:", e);
      }
    }
  }, [form]);

  const onSubmit = (data: LlmSettingsFormValues) => {
    // Simulate saving settings (e.g., to localStorage or backend)
    localStorage.setItem(LLM_SETTINGS_STORAGE_KEY, JSON.stringify(data));
    console.log("Saving LLM settings:", data);
    toast({ title: "设置已保存", description: "AI大语言模型设置已成功更新。" });
  };
  
  if (!isClient) {
    return (
     <div className="space-y-6">
       <Card><CardHeader><CardTitle>AI大语言模型设置</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载设置...</p></CardContent></Card>
     </div>
   );
 }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BrainCog className="h-6 w-6 text-primary" />
            AI大语言模型设置
          </CardTitle>
          <CardDescription>
            配置系统使用的AI大语言模型（例如 Gemini, OpenAI GPT等）的API密钥、接入点和模型名称。
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">模型配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="apiEndpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API 端点/链接</FormLabel>
                    <FormControl>
                      <Input placeholder="例如: https://generativelanguage.googleapis.com" {...field} />
                    </FormControl>
                    <FormDescription>您的语言模型提供商的API基础URL。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API 密钥</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input 
                          type={showApiKey ? "text" : "password"} 
                          placeholder="输入您的API密钥" 
                          {...field} 
                        />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setShowApiKey(!showApiKey)}
                        aria-label={showApiKey ? "隐藏密钥" : "显示密钥"}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <FormDescription>用于API请求认证的密钥。请妥善保管。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>模型名称/标识符</FormLabel>
                    <FormControl>
                      <Input placeholder="例如: models/gemini-1.5-flash, gpt-4-turbo" {...field} />
                    </FormControl>
                    <FormDescription>您希望使用的具体模型名称。</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> 保存设置
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
