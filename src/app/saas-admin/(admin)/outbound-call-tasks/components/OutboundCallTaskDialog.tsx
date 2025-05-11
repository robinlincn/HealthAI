
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
import type { SaasOutboundCallTask } from '@/lib/types';
import { format, parseISO } from 'date-fns';

const taskSchema = z.object({
  name: z.string().min(2, { message: "任务名称至少需要2个字符。" }),
  targetType: z.enum(['customer_segment', 'employee_group', 'custom_list', 'individual_patient']),
  targetDetails: z.string().min(1, { message: "目标详情不能为空。" }),
  status: z.enum(['pending_schedule', 'scheduled', 'in_progress', 'completed', 'failed', 'cancelled']),
  scheduledTime: z.string().optional().refine(val => !val || !isNaN(parseISO(val).valueOf()), { message: "若填写，需为有效日期时间" }),
  scriptId: z.string().optional(),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface OutboundCallTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaasOutboundCallTask) => void;
  task?: SaasOutboundCallTask | null;
}

export function OutboundCallTaskDialog({ isOpen, onClose, onSubmit, task }: OutboundCallTaskDialogProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      ...task,
      scheduledTime: task.scheduledTime ? format(parseISO(task.scheduledTime), "yyyy-MM-dd'T'HH:mm") : undefined,
    } : {
      name: '',
      targetType: 'customer_segment',
      targetDetails: '',
      status: 'pending_schedule',
      scheduledTime: undefined,
      scriptId: '',
      assignedTo: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (task) {
        form.reset({
          ...task,
          scheduledTime: task.scheduledTime ? format(parseISO(task.scheduledTime), "yyyy-MM-dd'T'HH:mm") : undefined,
        });
      } else {
        form.reset({
          name: '', targetType: 'customer_segment', targetDetails: '', status: 'pending_schedule',
          scheduledTime: undefined, scriptId: '', assignedTo: '', notes: '',
        });
      }
    }
  }, [task, form, isOpen]);

  const handleFormSubmit: SubmitHandler<TaskFormValues> = (data) => {
    const taskToSubmit: SaasOutboundCallTask = {
      ...task, 
      id: task?.id || `task-${Date.now().toString()}`,
      creationDate: task?.creationDate || new Date().toISOString(),
      ...data,
      scheduledTime: data.scheduledTime ? parseISO(data.scheduledTime).toISOString() : undefined,
      scriptId: data.scriptId || undefined,
      assignedTo: data.assignedTo || undefined,
      notes: data.notes || undefined,
    };
    onSubmit(taskToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task ? '编辑外呼任务' : '新建外呼任务'}</DialogTitle>
          <DialogDescription>
            {task ? '修改外呼任务的详细信息。' : '创建一个新的外呼任务。'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({field}) => (
                <FormItem><FormLabel>任务名称</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="targetType" render={({ field }) => (
                <FormItem>
                  <FormLabel>目标类型</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="customer_segment">客户分群</SelectItem>
                      <SelectItem value="employee_group">员工组</SelectItem>
                      <SelectItem value="custom_list">自定义列表</SelectItem>
                      <SelectItem value="individual_patient">单个病人</SelectItem>
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>
            </div>
            <FormField control={form.control} name="targetDetails" render={({field}) => (
              <FormItem><FormLabel>目标详情</FormLabel><FormControl><Input placeholder="例如：高风险糖尿病患者 / 客服部 / VIP用户名单 / 病人ID:123" {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                    <FormLabel>任务状态</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="pending_schedule">待安排</SelectItem>
                            <SelectItem value="scheduled">已安排</SelectItem>
                            <SelectItem value="in_progress">进行中</SelectItem>
                            <SelectItem value="completed">已完成</SelectItem>
                            <SelectItem value="failed">失败</SelectItem>
                            <SelectItem value="cancelled">已取消</SelectItem>
                        </SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="scheduledTime" render={({ field }) => (
                    <FormItem>
                    <FormLabel>计划时间 (可选)</FormLabel>
                    <FormControl><Input type="datetime-local" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}/>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="scriptId" render={({field}) => (
                    <FormItem><FormLabel>关联脚本ID (可选)</FormLabel><FormControl><Input placeholder="SOP或Dify流程ID" {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="assignedTo" render={({field}) => (
                    <FormItem><FormLabel>分配给 (员工ID, 可选)</FormLabel><FormControl><Input placeholder="手动任务负责人ID" {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
            </div>
            <FormField control={form.control} name="notes" render={({field}) => (
              <FormItem><FormLabel>备注 (可选)</FormLabel><FormControl><Textarea rows={3} placeholder="任务相关备注信息" {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{task ? '保存更改' : '创建任务'}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
