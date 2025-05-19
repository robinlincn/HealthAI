
'use client';

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import type { SaasAiWorkflowApiConfig } from '@/lib/types'; // Ensure this type is created

const workflowApiConfigSchema = z.object({
  name: z.string().min(2, { message: "工作流名称至少需要2个字符。" }),
  type: z.enum(['Dify', 'Coze', 'Other'], { required_error: "请选择工作流类型。"}),
  apiEndpoint: z.string().url({ message: "请输入有效的API端点URL。" }),
  apiKey: z.string().optional(),
  parametersJson: z.string().optional().refine((val) => {
    if (!val || val.trim() === "") return true; // Allow empty string
    try {
      JSON.parse(val);
      return true;
    } catch (e) {
      return false;
    }
  }, { message: "参数必须是有效的JSON格式。" }),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

type WorkflowApiConfigFormValues = z.infer<typeof workflowApiConfigSchema>;

interface WorkflowApiConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaasAiWorkflowApiConfig) => void;
  config?: SaasAiWorkflowApiConfig | null;
}

export function WorkflowApiConfigDialog({ isOpen, onClose, onSubmit, config }: WorkflowApiConfigDialogProps) {
  const form = useForm<WorkflowApiConfigFormValues>({
    resolver: zodResolver(workflowApiConfigSchema),
    defaultValues: config ? {
      ...config,
      apiKey: config.apiKey || '',
      parametersJson: config.parametersJson || '',
      status: config.status || 'active',
    } : {
      name: '',
      type: 'Dify',
      apiEndpoint: '',
      apiKey: '',
      parametersJson: '',
      description: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (config) {
        form.reset({
          ...config,
          apiKey: config.apiKey || '',
          parametersJson: config.parametersJson || '',
          status: config.status || 'active',
        });
      } else {
        form.reset({
          name: '', type: 'Dify', apiEndpoint: '', apiKey: '', parametersJson: '', description: '', status: 'active',
        });
      }
    }
  }, [config, form, isOpen]);

  const handleFormSubmit: SubmitHandler<WorkflowApiConfigFormValues> = (data) => {
    const configToSubmit: SaasAiWorkflowApiConfig = {
      ...config, 
      id: config?.id || `wfcfg-${Date.now().toString()}`,
      creationDate: config?.creationDate || new Date().toISOString(),
      ...data,
      apiKey: data.apiKey || undefined,
      parametersJson: data.parametersJson || undefined,
      description: data.description || undefined,
    };
    onSubmit(configToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{config ? '编辑AI工作流配置' : '新增AI工作流配置'}</DialogTitle>
          <DialogDescription>
            配置Dify、Coze等AI工作流的API调用参数。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField control={form.control} name="name" render={({field}) => (
              <FormItem><FormLabel>名称</FormLabel><FormControl><Input placeholder="例如: Dify内容生成流程" {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
             <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel>类型</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Dify">Dify</SelectItem>
                    <SelectItem value="Coze">Coze</SelectItem>
                    <SelectItem value="Other">其他</SelectItem>
                  </SelectContent>
                </Select><FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="apiEndpoint" render={({field}) => (
              <FormItem><FormLabel>API 端点 URL</FormLabel><FormControl><Input type="url" placeholder="https://api.example.com/workflow" {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField control={form.control} name="apiKey" render={({field}) => (
              <FormItem>
                <FormLabel>API 密钥 (可选)</FormLabel>
                <FormControl><Input type="password" placeholder="留空则不使用密钥" {...field} /></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={form.control} name="parametersJson" render={({field}) => (
              <FormItem>
                <FormLabel>默认参数 (可选, JSON格式)</FormLabel>
                <FormControl><Textarea rows={3} placeholder='例如: {"temperature": 0.7, "max_tokens": 500}' {...field} /></FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
             <FormField control={form.control} name="description" render={({field}) => (
              <FormItem><FormLabel>描述 (可选)</FormLabel><FormControl><Textarea rows={2} placeholder="此工作流的用途说明" {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>状态</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="active">已激活</SelectItem>
                      <SelectItem value="inactive">未激活</SelectItem>
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{config ? '保存更改' : '创建配置'}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}

    