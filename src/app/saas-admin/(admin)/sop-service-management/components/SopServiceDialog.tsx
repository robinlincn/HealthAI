
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
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import type { SaasSopService } from '@/lib/types';

const sopServiceSchema = z.object({
  name: z.string().min(2, { message: "服务名称至少需要2个字符。" }),
  type: z.enum(['Coze', 'Dify', 'Other'], { required_error: "请选择服务类型。"}),
  apiEndpoint: z.string().url({ message: "请输入有效的API端点URL。" }),
  apiKey: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive', 'error']),
  parameters: z.string().optional().refine((val) => {
    if (!val || val.trim() === "") return true; // Allow empty string
    try {
      JSON.parse(val);
      return true;
    } catch (e) {
      return false;
    }
  }, { message: "参数必须是有效的JSON格式。" }),
});

type SopServiceFormValues = z.infer<typeof sopServiceSchema>;

interface SopServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaasSopService) => void;
  service?: SaasSopService | null;
}

export function SopServiceDialog({ isOpen, onClose, onSubmit, service }: SopServiceDialogProps) {
  const form = useForm<SopServiceFormValues>({
    resolver: zodResolver(sopServiceSchema),
    defaultValues: service ? {
      ...service,
      apiKey: service.apiKey || '', // Handle potentially undefined API key
      parameters: service.parameters || '',
    } : {
      name: '',
      type: 'Coze',
      apiEndpoint: '',
      apiKey: '',
      description: '',
      status: 'active',
      parameters: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (service) {
        form.reset({
          ...service,
          apiKey: service.apiKey || '',
          parameters: service.parameters || '',
        });
      } else {
        form.reset({
          name: '', type: 'Coze', apiEndpoint: '', apiKey: '', description: '',
          status: 'active', parameters: '',
        });
      }
    }
  }, [service, form, isOpen]);

  const handleFormSubmit: SubmitHandler<SopServiceFormValues> = (data) => {
    const serviceToSubmit: SaasSopService = {
      ...service, 
      id: service?.id || `sop-${Date.now().toString()}`,
      creationDate: service?.creationDate || new Date().toISOString(),
      ...data,
      apiKey: data.apiKey || undefined, // Store as undefined if empty
      parameters: data.parameters || undefined, // Store as undefined if empty
    };
    onSubmit(serviceToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>{service ? '编辑SOP服务' : '新增SOP服务'}</DialogTitle>
          <DialogDescription>
            {service ? '修改SOP服务的配置信息。' : '配置一个新的SOP服务，如Coze Bot或Dify Flow。'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({field}) => (
                <FormItem><FormLabel>服务名称</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>服务类型</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Coze">Coze Bot</SelectItem>
                      <SelectItem value="Dify">Dify Flow</SelectItem>
                      <SelectItem value="Other">其他</SelectItem>
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>
            </div>
            <FormField control={form.control} name="apiEndpoint" render={({field}) => (
              <FormItem><FormLabel>API 端点 URL</FormLabel><FormControl><Input type="url" placeholder="https://api.example.com/your-flow" {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField control={form.control} name="apiKey" render={({field}) => (
              <FormItem>
                <FormLabel>API 密钥 (可选)</FormLabel>
                <FormControl><Input type="password" placeholder="输入API密钥 (将安全存储)" {...field} /></FormControl>
                <FormMessage/>
                <FormDescription className="text-xs">API密钥将用于认证，请妥善保管。</FormDescription>
              </FormItem>
            )}/>
             <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>服务状态</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="active">已激活</SelectItem>
                      <SelectItem value="inactive">未激活</SelectItem>
                      <SelectItem value="error">错误/配置问题</SelectItem>
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>
            <FormField control={form.control} name="description" render={({field}) => (
              <FormItem><FormLabel>描述 (可选)</FormLabel><FormControl><Textarea rows={3} placeholder="简要描述此服务的功能和用途。" {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField control={form.control} name="parameters" render={({field}) => (
                <FormItem>
                    <FormLabel>额外参数 (可选, JSON格式)</FormLabel>
                    <FormControl><Textarea rows={3} placeholder='例如：{"timeout": 5000, "retries": 3}' {...field} /></FormControl>
                    <FormMessage/>
                    <FormDescription className="text-xs">用于传递给API的固定参数，请输入有效的JSON字符串。</FormDescription>
                </FormItem>
            )}/>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{service ? '保存更改' : '创建服务'}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
