
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
import type { GroupOutboundCallTask, OutboundCallGroup, CallTaskRecurrence, CallTaskStatus } from "@/lib/types";
import { useEffect } from "react";
import { format, parseISO } from "date-fns";

const groupTaskFormSchema = z.object({
  groupId: z.string().min(1, "必须选择一个外呼组。"),
  content: z.string().min(5, "外呼内容至少需要5个字符。"),
  scheduledTime: z.string().refine(val => !isNaN(parseISO(val).valueOf()), { message: "请输入有效的日期时间。" }),
  maxCallAttempts: z.coerce.number().int().min(1, "呼叫轮数至少为1。").max(5, "呼叫轮数最多为5。"),
  recurrence: z.enum(['none', 'daily', 'weekly', 'monthly'] as [CallTaskRecurrence, ...CallTaskRecurrence[]]),
  wechatInfo: z.string().min(1, "微信/群名称不能为空。"),
  status: z.enum(['pending', 'scheduled', 'cancelled'] as [CallTaskStatus, ...CallTaskStatus[]]).optional(),
  notes: z.string().optional(),
});

type GroupTaskFormValues = z.infer<typeof groupTaskFormSchema>;

interface GroupCallTaskFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<GroupOutboundCallTask, 'id' | 'creationDate' | 'groupName' | 'callAttempts'> & { id?: string; groupName: string; callAttempts?:number; status?: GroupOutboundCallTask['status'] }) => void;
  task?: GroupOutboundCallTask | null;
  groups: OutboundCallGroup[];
  preselectedGroupId?: string | null;
}

export function GroupCallTaskFormDialog({ isOpen, onClose, onSave, task, groups, preselectedGroupId }: GroupCallTaskFormDialogProps) {
  const form = useForm<GroupTaskFormValues>({
    resolver: zodResolver(groupTaskFormSchema),
    defaultValues: {
      groupId: task?.groupId || preselectedGroupId || "",
      content: task?.content || "",
      scheduledTime: task?.scheduledTime ? format(parseISO(task.scheduledTime), "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      maxCallAttempts: task?.maxCallAttempts || 1, // Default to 1 for group tasks
      recurrence: task?.recurrence || "none",
      wechatInfo: task?.wechatInfo || "",
      status: task?.status || "pending",
      notes: task?.notes || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        groupId: task?.groupId || preselectedGroupId || (groups.length > 0 ? groups[0].id : ""),
        content: task?.content || "",
        scheduledTime: task?.scheduledTime ? format(parseISO(task.scheduledTime), "yyyy-MM-dd'T'HH:mm") : format(new Date(Date.now() + 60*60*1000), "yyyy-MM-dd'T'HH:mm"),
        maxCallAttempts: task?.maxCallAttempts || 1,
        recurrence: task?.recurrence || "none",
        wechatInfo: task?.wechatInfo || "",
        status: task?.status && ['pending', 'scheduled', 'cancelled'].includes(task.status) ? task.status as 'pending' | 'scheduled' | 'cancelled' : 'pending',
        notes: task?.notes || "",
      });
    }
  }, [task, isOpen, groups, preselectedGroupId, form]);

  const onSubmit = (data: GroupTaskFormValues) => {
    const selectedGroup = groups.find(g => g.id === data.groupId);
    if (!selectedGroup) {
        form.setError("groupId", {type: "manual", message: "选择的组无效。"});
        return;
    }
    onSave({ ...data, groupName: selectedGroup.name });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{task ? "编辑组外呼任务" : "新建组外呼任务"}</DialogTitle>
          <DialogDescription>
            {task ? "修改组任务详情。" : "为选定外呼组创建任务。"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>选择外呼组</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择一个外呼组" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groups.map(g => (
                        <SelectItem key={g.id} value={g.id}>{g.name} ({g.memberCount}人)</SelectItem>
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
                    <Textarea placeholder="输入统一的外呼内容..." {...field} rows={3}/>
                  </FormControl>
                  <FormDescription>此内容将用于组内所有成员。</FormDescription>
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
                        <FormControl><Input type="datetime-local" {...field} /></FormControl>
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
                        <FormControl><Input type="number" min="1" max="5" {...field} /></FormControl>
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
                    <Input placeholder="输入统一的微信群名或通知渠道" {...field} />
                  </FormControl>
                   <FormDescription>外呼完成后将通过此渠道发送通知。</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {task && (
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
                <Button type="submit">保存组任务</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
