
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import type { SingleOutboundCallTask, DoctorPatient, CallTaskRecurrence, CallTaskStatus } from "@/lib/types";
import { useEffect } from "react";
import { format, parseISO } from "date-fns";

const singleTaskFormSchema = z.object({
  patientId: z.string().min(1, "必须选择一个病人。"),
  content: z.string().min(5, "外呼内容至少需要5个字符。"),
  scheduledTime: z.string().refine(val => !isNaN(parseISO(val).valueOf()), { message: "请输入有效的日期时间。" }),
  maxCallAttempts: z.coerce.number().int().min(1, "呼叫轮数至少为1。").max(5, "呼叫轮数最多为5。"),
  recurrence: z.enum(['none', 'daily', 'weekly', 'monthly'] as [CallTaskRecurrence, ...CallTaskRecurrence[]]),
  wechatInfo: z.string().min(1, "微信/群名称不能为空。"),
  status: z.enum(['pending', 'scheduled', 'cancelled'] as [CallTaskStatus, ...CallTaskStatus[]]).optional(),
  notes: z.string().optional(),
});

type SingleTaskFormValues = z.infer<typeof singleTaskFormSchema>;

interface SinglePatientTaskFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<SingleOutboundCallTask, 'id' | 'creationDate' | 'patientName' | 'callAttempts'> & { id?: string; status?: CallTaskStatus; patientName: string; callAttempts?: number }) => void;
  task?: SingleOutboundCallTask | null;
  patients: DoctorPatient[];
}

export function SinglePatientTaskFormDialog({ isOpen, onClose, onSave, task, patients }: SinglePatientTaskFormDialogProps) {
  const form = useForm<SingleTaskFormValues>({
    resolver: zodResolver(singleTaskFormSchema),
    defaultValues: {
      patientId: task?.patientId || "",
      content: task?.content || "",
      scheduledTime: task?.scheduledTime ? format(parseISO(task.scheduledTime), "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      maxCallAttempts: task?.maxCallAttempts || 3,
      recurrence: task?.recurrence || "none",
      wechatInfo: task?.wechatInfo || "",
      status: task?.status || "pending",
      notes: task?.notes || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        patientId: task?.patientId || (patients.length > 0 ? patients[0].id : ""),
        content: task?.content || "",
        scheduledTime: task?.scheduledTime ? format(parseISO(task.scheduledTime), "yyyy-MM-dd'T'HH:mm") : format(new Date(Date.now() + 60*60*1000), "yyyy-MM-dd'T'HH:mm"), // Default to 1 hour from now
        maxCallAttempts: task?.maxCallAttempts || 3,
        recurrence: task?.recurrence || "none",
        wechatInfo: task?.wechatInfo || "",
        status: task?.status && ['pending', 'scheduled', 'cancelled'].includes(task.status) ? task.status as 'pending' | 'scheduled' | 'cancelled' : 'pending',
        notes: task?.notes || "",
      });
    }
  }, [task, isOpen, patients, form]);

  const onSubmit = (data: SingleTaskFormValues) => {
    const selectedPatient = patients.find(p => p.id === data.patientId);
    if (!selectedPatient) {
      form.setError("patientId", { type: "manual", message: "选择的病人无效。" });
      return;
    }
    onSave({ ...data, patientName: selectedPatient.name });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{task ? "编辑单人外呼任务" : "新建单人外呼任务"}</DialogTitle>
          <DialogDescription>
            {task ? "修改任务详情。" : "为选定病人创建外呼任务。"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>选择病人</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择一个病人" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name} ({p.diagnosis})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>外呼内容</FormLabel>
                  <FormControl>
                    <Textarea placeholder="输入外呼的具体内容..." {...field} rows={3} />
                  </FormControl>
                  <FormDescription>支持文字，语音形式待开发。</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>定时呼叫时间</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxCallAttempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>最大呼叫轮数</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
                control={form.control}
                name="recurrence"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>重复周期</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                        <SelectItem value="none">一次性呼叫</SelectItem>
                        <SelectItem value="daily" disabled>每日 (开发中)</SelectItem>
                        <SelectItem value="weekly" disabled>每周 (开发中)</SelectItem>
                        <SelectItem value="monthly" disabled>每月 (开发中)</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="wechatInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>微信/群名称 (用于通知)</FormLabel>
                  <FormControl>
                    <Input placeholder="输入病人微信名或相关微信群名" {...field} />
                  </FormControl>
                  <FormDescription>外呼完成后将通过此微信发送通知。</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             {task && ( // Only show status field when editing
                <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>任务状态</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="pending">待处理</SelectItem>
                            <SelectItem value="scheduled">已安排</SelectItem>
                            <SelectItem value="cancelled">已取消</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            )}
             <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>备注 (可选)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="其他备注信息" {...field} rows={2}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">取消</Button>
              </DialogClose>
              <Button type="submit">保存任务</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
