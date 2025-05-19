
'use client';

import { useEffect, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import type { SaasOutboundCallTask, SaasEnterprise, SaasEmployee, OutboundCallGroup, SaasPatient, SaasSopService } from '@/lib/types'; // Added SaasPatient, SaasSopService
import { format, parseISO } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

const taskSchema = z.object({
  name: z.string().min(2, { message: "任务名称至少需要2个字符。" }),
  enterpriseId: z.string().optional(),
  creatingDoctorId: z.string().optional(),
  targetType: z.enum(['individual_patient', 'patient_group', 'custom_list', 'employee_group']),
  targetPatientId: z.string().optional(),
  targetGroupId: z.string().optional(),
  targetCustomListDetails: z.string().optional(),
  targetDescription: z.string().optional(), // To store patient/group name for display if selected
  status: z.enum(['pending_schedule', 'scheduled', 'in_progress', 'completed', 'failed', 'cancelled']),
  scheduledTime: z.string().optional().refine(val => !val || !isNaN(parseISO(val).valueOf()), { message: "若填写，需为有效日期时间" }),
  callContentSummary: z.string().optional(),
  sopServiceId: z.string().optional(),
  assignedToEmployeeId: z.string().optional(),
  notes: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface OutboundCallTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaasOutboundCallTask) => void;
  task?: SaasOutboundCallTask | null;
  enterprises: SaasEnterprise[];
  allEmployees: SaasEmployee[]; // All employees from all enterprises for selection
  allPatients: SaasPatient[]; // All patients from all enterprises
  allGroups: OutboundCallGroup[]; // All groups from all enterprises
  allSopServices: SaasSopService[]; // All SOP services
}

export function OutboundCallTaskDialog({ 
    isOpen, onClose, onSubmit, task, 
    enterprises, allEmployees, allPatients, allGroups, allSopServices
}: OutboundCallTaskDialogProps) {

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      ...task,
      scheduledTime: task.scheduledTime ? format(parseISO(task.scheduledTime), "yyyy-MM-dd'T'HH:mm") : undefined,
    } : {
      name: '',
      enterpriseId: enterprises.length > 0 ? enterprises[0].id : undefined,
      targetType: 'individual_patient',
      status: 'pending_schedule',
      scheduledTime: undefined,
    },
  });

  const selectedEnterpriseId = form.watch('enterpriseId');
  const selectedTargetType = form.watch('targetType');

  const employeesOfSelectedEnterprise = useMemo(() => {
    if (!selectedEnterpriseId) return [];
    return allEmployees.filter(e => e.enterpriseId === selectedEnterpriseId);
  }, [selectedEnterpriseId, allEmployees]);

  const patientsOfSelectedEnterprise = useMemo(() => {
    if (!selectedEnterpriseId) return [];
    return allPatients.filter(p => p.enterpriseId === selectedEnterpriseId);
  }, [selectedEnterpriseId, allPatients]);
  
  const groupsOfSelectedEnterprise = useMemo(() => {
    if (!selectedEnterpriseId) return [];
    return allGroups.filter(g => g.enterpriseId === selectedEnterpriseId);
  }, [selectedEnterpriseId, allGroups]);


  useEffect(() => {
    if (isOpen) {
      if (task) {
        form.reset({
          ...task,
          scheduledTime: task.scheduledTime ? format(parseISO(task.scheduledTime), "yyyy-MM-dd'T'HH:mm") : undefined,
        });
      } else {
        form.reset({
          name: '', 
          enterpriseId: enterprises.length > 0 ? enterprises[0].id : undefined,
          targetType: 'individual_patient', 
          targetPatientId: undefined,
          targetGroupId: undefined,
          targetCustomListDetails: undefined,
          targetDescription: undefined,
          status: 'pending_schedule',
          scheduledTime: undefined, 
          callContentSummary: '',
          sopServiceId: undefined, 
          assignedToEmployeeId: undefined,
          notes: '',
        });
      }
    }
  }, [task, form, isOpen, enterprises]);

  const handleFormSubmit: SubmitHandler<TaskFormValues> = (data) => {
    let targetDesc = data.targetDescription;
    if (data.targetType === 'individual_patient' && data.targetPatientId) {
        targetDesc = allPatients.find(p => p.id === data.targetPatientId)?.name || data.targetPatientId;
    } else if (data.targetType === 'patient_group' && data.targetGroupId) {
        targetDesc = allGroups.find(g => g.id === data.targetGroupId)?.name || data.targetGroupId;
    } else if (data.targetType === 'custom_list') {
        targetDesc = data.targetCustomListDetails;
    } else if (data.targetType === 'employee_group' && data.targetGroupId) { // Assuming targetGroupId can be used for employee groups too
        targetDesc = allGroups.find(g => g.id === data.targetGroupId)?.name || data.targetGroupId; // Or fetch employee group name
    }


    const taskToSubmit: SaasOutboundCallTask = {
      ...task, 
      id: task?.id || `saas-task-${Date.now().toString()}`,
      creationDate: task?.creationDate || new Date().toISOString(),
      ...data,
      scheduledTime: data.scheduledTime ? parseISO(data.scheduledTime).toISOString() : undefined,
      targetDescription: targetDesc,
      callContentSummary: data.callContentSummary || undefined,
      sopServiceId: data.sopServiceId || undefined,
      assignedToEmployeeId: data.assignedToEmployeeId || undefined,
      notes: data.notes || undefined,
    };
    onSubmit(taskToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task ? '编辑外呼任务' : '新建平台外呼任务'}</DialogTitle>
          <DialogDescription>
            {task ? '修改外呼任务的详细信息。' : '创建一个新的平台级外呼任务。'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({field}) => (
                <FormItem><FormLabel>任务名称</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
               <FormField control={form.control} name="enterpriseId" render={({ field }) => (
                <FormItem>
                  <FormLabel>所属企业 (可选)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="选择企业 (平台级任务可不选)" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="">平台级任务 (不指定企业)</SelectItem>
                      {enterprises.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">若为特定企业任务请选择，否则为平台通用任务。</FormDescription>
                  <FormMessage />
                </FormItem>
              )}/>
            </div>
            <FormField control={form.control} name="targetType" render={({ field }) => (
                <FormItem>
                  <FormLabel>目标类型</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="individual_patient">单个病人</SelectItem>
                      <SelectItem value="patient_group">病人组</SelectItem>
                      <SelectItem value="custom_list">自定义列表</SelectItem>
                      <SelectItem value="employee_group">员工组</SelectItem>
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
            )}/>

            {selectedTargetType === 'individual_patient' && (
                 <FormField control={form.control} name="targetPatientId" render={({ field }) => (
                    <FormItem> <FormLabel>选择病人</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedEnterpriseId && patientsOfSelectedEnterprise.length === 0}>
                            <FormControl><SelectTrigger><SelectValue placeholder="选择一个病人" /></SelectTrigger></FormControl>
                            <SelectContent className="max-h-60">
                              <ScrollArea>
                                {patientsOfSelectedEnterprise.length === 0 && <SelectItem value="" disabled>请先选择企业或此企业无病人</SelectItem>}
                                {patientsOfSelectedEnterprise.map(p => (<SelectItem key={p.id} value={p.id}>{p.name} ({p.id})</SelectItem>))}
                              </ScrollArea>
                            </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">选择此任务针对的单个病人。需先选定企业。</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}/>
            )}
            {selectedTargetType === 'patient_group' && (
                 <FormField control={form.control} name="targetGroupId" render={({ field }) => (
                    <FormItem> <FormLabel>选择病人组</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedEnterpriseId && groupsOfSelectedEnterprise.length === 0}>
                            <FormControl><SelectTrigger><SelectValue placeholder="选择一个病人组" /></SelectTrigger></FormControl>
                            <SelectContent className="max-h-60">
                              <ScrollArea>
                                {groupsOfSelectedEnterprise.length === 0 && <SelectItem value="" disabled>请先选择企业或此企业无病人组</SelectItem>}
                                {groupsOfSelectedEnterprise.map(g => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}
                              </ScrollArea>
                            </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">选择此任务针对的病人组。需先选定企业。</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}/>
            )}
             {(selectedTargetType === 'custom_list' || selectedTargetType === 'employee_group') && (
                <FormField control={form.control} name="targetCustomListDetails" render={({field}) => (
                    <FormItem><FormLabel>{selectedTargetType === 'custom_list' ? '自定义列表详情' : '员工组详情/ID'}</FormLabel><FormControl><Input placeholder="例如: VIP名单Excel, 或员工组ID" {...field} /></FormControl>
                    <FormDescription className="text-xs">输入自定义列表的描述或员工组的标识。</FormDescription>
                    <FormMessage/></FormItem>
                )}/>
            )}


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
             <FormField control={form.control} name="callContentSummary" render={({field}) => (
                <FormItem><FormLabel>外呼内容摘要 (可选)</FormLabel><FormControl><Textarea rows={3} placeholder="简述外呼的主要内容或脚本要点。" {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="sopServiceId" render={({ field }) => (
                    <FormItem> <FormLabel>关联SOP服务 (可选)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="选择一个SOP服务 (若为自动任务)" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="">不关联</SelectItem>
                                {allSopServices.map(s => (<SelectItem key={s.id} value={s.id}>{s.name} ({s.type})</SelectItem>))}
                            </SelectContent>
                        </Select><FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="assignedToEmployeeId" render={({field}) => (
                     <FormItem> <FormLabel>分配给 (员工, 可选)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedEnterpriseId && employeesOfSelectedEnterprise.length === 0}>
                            <FormControl><SelectTrigger><SelectValue placeholder="选择执行员工 (若为手动任务)" /></SelectTrigger></FormControl>
                            <SelectContent>
                                 <SelectItem value="">不分配/系统执行</SelectItem>
                                {employeesOfSelectedEnterprise.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
                            </SelectContent>
                        </Select><FormMessage />
                    </FormItem>
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

