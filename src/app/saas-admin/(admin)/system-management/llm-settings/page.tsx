
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"; // Added CardFooter
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrainCog, Save, Eye, EyeOff, PlusCircle, Workflow } from "lucide-react"; 
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { SaasLlmSettings, SaasAiWorkflowApiConfig } from '@/lib/types';
import { WorkflowApiConfigTable } from './components/WorkflowApiConfigTable';
import { WorkflowApiConfigDialog } from './components/WorkflowApiConfigDialog';
import { Separator } from '@/components/ui/separator';

const llmSettingsSchema = z.object({
  apiKey: z.string().min(1, "API密钥不能为空。"),
  apiEndpoint: z.string().url("请输入有效的API端点URL。").min(1, "API端点URL不能为空。"),
  modelName: z.string().min(1, "模型名称/标识符不能为空。"),
});

type LlmSettingsFormValues = z.infer<typeof llmSettingsSchema>;

const LLM_SETTINGS_STORAGE_KEY = 'saas_llm_settings_v2';
const AI_WORKFLOW_CONFIGS_STORAGE_KEY = 'saas_ai_workflow_configs';

const mockInitialWorkflowConfigs: SaasAiWorkflowApiConfig[] = [
  {
    id: 'wf-dify-001',
    name: 'Dify内容摘要流程',
    type: 'Dify',
    apiEndpoint: 'https://api.dify.ai/v1/workflows/your-summary-flow/run',
    description: '用于生成文本摘要的Dify工作流。',
    creationDate: new Date(2024, 3, 10).toISOString(),
    status: 'active',
  },
  {
    id: 'wf-coze-001',
    name: 'Coze智能客服Bot',
    type: 'Coze',
    apiEndpoint: 'https://api.coze.com/bots/your-chatbot-id/chat',
    parametersJson: JSON.stringify({ "user_persona": "patient" }),
    description: '用于初步回答用户健康咨询的Coze机器人。',
    creationDate: new Date(2024, 2, 15).toISOString(),
    status: 'active',
  },
];

export default function LlmSettingsPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const llmForm = useForm<LlmSettingsFormValues>({
    resolver: zodResolver(llmSettingsSchema),
    defaultValues: { apiKey: "", apiEndpoint: "", modelName: "" },
  });

  const [workflowConfigs, setWorkflowConfigs] = useState<SaasAiWorkflowApiConfig[]>([]);
  const [isWorkflowDialogVisible, setIsWorkflowDialogVisible] = useState(false);
  const [editingWorkflowConfig, setEditingWorkflowConfig] = useState<SaasAiWorkflowApiConfig | null>(null);

  useEffect(() => {
    setIsClient(true);
    const storedLlmSettings = localStorage.getItem(LLM_SETTINGS_STORAGE_KEY);
    if (storedLlmSettings) {
      try {
        llmForm.reset(JSON.parse(storedLlmSettings));
      } catch (e) { console.error("Error parsing stored LLM settings:", e); }
    }

    const storedWorkflowConfigs = localStorage.getItem(AI_WORKFLOW_CONFIGS_STORAGE_KEY);
    if (storedWorkflowConfigs) {
      try {
        setWorkflowConfigs(JSON.parse(storedWorkflowConfigs));
      } catch (e) { 
        console.error("Error parsing stored AI workflow configs:", e);
        setWorkflowConfigs(mockInitialWorkflowConfigs); 
      }
    } else {
      setWorkflowConfigs(mockInitialWorkflowConfigs); 
    }
  }, [llmForm]);

  const onLlmSubmit = (data: LlmSettingsFormValues) => {
    localStorage.setItem(LLM_SETTINGS_STORAGE_KEY, JSON.stringify(data));
    toast({ title: "LLM模型设置已保存", description: "AI大语言模型配置已成功更新。" });
  };

  const handleAddWorkflowConfig = () => {
    setEditingWorkflowConfig(null);
    setIsWorkflowDialogVisible(true);
  };

  const handleEditWorkflowConfig = (config: SaasAiWorkflowApiConfig) => {
    setEditingWorkflowConfig(config);
    setIsWorkflowDialogVisible(true);
  };

  const handleDeleteWorkflowConfig = (configId: string) => {
    if (window.confirm('确定要删除此AI工作流配置吗？')) {
      setWorkflowConfigs(prev => {
        const updated = prev.filter(c => c.id !== configId);
        localStorage.setItem(AI_WORKFLOW_CONFIGS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      toast({ title: '删除成功', description: 'AI工作流配置已删除。' });
    }
  };

  const handleWorkflowDialogSubmit = (data: SaasAiWorkflowApiConfig) => {
    setWorkflowConfigs(prev => {
      let updated;
      if (editingWorkflowConfig) {
        updated = prev.map(c => (c.id === editingWorkflowConfig.id ? { ...c, ...data } : c));
        toast({ title: '更新成功', description: `工作流 "${data.name}" 已更新。`});
      } else {
        updated = [{ ...data, id: `wfcfg-${Date.now()}`, creationDate: new Date().toISOString() }, ...prev];
        toast({ title: '创建成功', description: `新工作流 "${data.name}" 已添加。`});
      }
      localStorage.setItem(AI_WORKFLOW_CONFIGS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setIsWorkflowDialogVisible(false);
    setEditingWorkflowConfig(null);
  };
  
  if (!isClient) {
     return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>AI大语言模型与工作流设置</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载设置...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-8"> 
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BrainCog className="h-6 w-6 text-primary" />
            AI大语言模型与工作流设置
          </CardTitle>
          <CardDescription>
            配置系统使用的核心AI大语言模型及外部AI工作流（如Dify, Coze）的API参数。
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Form {...llmForm}>
        <form onSubmit={llmForm.handleSubmit(onLlmSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">核心模型配置</CardTitle>
              <CardDescription>用于Genkit主要AI功能的语言模型。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={llmForm.control} name="apiEndpoint" render={({ field }) => (
                <FormItem><FormLabel>API 端点/链接</FormLabel><FormControl><Input placeholder="例如: https://generativelanguage.googleapis.com" {...field} /></FormControl><FormDescription>语言模型提供商的API基础URL。</FormDescription><FormMessage /></FormItem>
              )}/>
              <FormField control={llmForm.control} name="apiKey" render={({ field }) => (
                <FormItem><FormLabel>API 密钥</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl><Input type={showApiKey ? "text" : "password"} placeholder="输入您的API密钥" {...field} /></FormControl>
                    <Button type="button" variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)} aria-label={showApiKey ? "隐藏密钥" : "显示密钥"}>
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormDescription>用于API请求认证的密钥。请妥善保管。</FormDescription><FormMessage />
                </FormItem>
              )}/>
              <FormField control={llmForm.control} name="modelName" render={({ field }) => (
                <FormItem><FormLabel>模型名称/标识符</FormLabel><FormControl><Input placeholder="例如: models/gemini-1.5-flash, gpt-4-turbo" {...field} /></FormControl><FormDescription>希望使用的具体模型名称。</FormDescription><FormMessage /></FormItem>
              )}/>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button type="submit"><Save className="mr-2 h-4 w-4" /> 保存核心模型设置</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Workflow className="h-5 w-5 text-primary/80"/>AI工作流调用配置 (Dify, Coze等)</CardTitle>
          <CardDescription>管理用于特定任务（如复杂问答、定制流程）的外部AI工作流的API参数。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex justify-end">
            <Button onClick={handleAddWorkflowConfig}>
              <PlusCircle className="mr-2 h-4 w-4" /> 添加工作流配置
            </Button>
          </div>
          <WorkflowApiConfigTable
            configs={workflowConfigs}
            onEdit={handleEditWorkflowConfig}
            onDelete={handleDeleteWorkflowConfig}
          />
        </CardContent>
      </Card>

      <WorkflowApiConfigDialog
        isOpen={isWorkflowDialogVisible}
        onClose={() => { setIsWorkflowDialogVisible(false); setEditingWorkflowConfig(null); }}
        onSubmit={handleWorkflowDialogSubmit}
        config={editingWorkflowConfig}
      />
    </div>
  );
}

