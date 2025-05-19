
'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import type { SaasCommunityGroup, SaasEnterprise, SaasEmployee, SaasPatient, SaasPlatformConnection } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const communityGroupSchema = z.object({
  name: z.string().min(2, { message: "群名称至少需要2个字符。" }),
  enterpriseId: z.string().min(1, "必须选择所属企业。"),
  managingEmployeeId: z.string().optional(),
  type: z.enum(['personal_wechat_group', 'enterprise_wechat_group', 'other_platform_group']),
  platformGroupId: z.string().optional().describe("微信群的外部ID"),
  description: z.string().optional(),
  memberPatientIds: z.array(z.string()).optional().default([]),
  platformConnectionId: z.string().optional(),
  connectionStatus: z.enum(['active_sync', 'inactive_sync', 'error_sync', 'not_monitored']),
  tags: z.string().optional().describe("多个标签用逗号分隔"),
});

type CommunityGroupFormValues = z.infer<typeof communityGroupSchema>;

interface CommunityGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaasCommunityGroup) => void;
  group?: SaasCommunityGroup | null;
  enterprises: SaasEnterprise[];
  allEmployees: SaasEmployee[]; // All employees for dropdown filtering
  allPatients: SaasPatient[]; // All patients for dropdown filtering
  platformConnections: SaasPlatformConnection[];
}

export function CommunityGroupDialog({ 
    isOpen, 
    onClose, 
    onSubmit, 
    group, 
    enterprises,
    allEmployees,
    allPatients,
    platformConnections
}: CommunityGroupDialogProps) {
  const form = useForm<CommunityGroupFormValues>({
    resolver: zodResolver(communityGroupSchema),
    defaultValues: group ? {
      ...group,
      memberPatientIds: group.memberPatientIds || [],
      tags: group.tags?.join(', ') || '',
    } : {
      name: '',
      enterpriseId: enterprises.length > 0 ? enterprises[0].id : '',
      managingEmployeeId: undefined,
      type: 'personal_wechat_group',
      platformGroupId: '',
      description: '',
      memberPatientIds: [],
      platformConnectionId: undefined,
      connectionStatus: 'not_monitored',
      tags: '',
    },
  });

  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const selectedEnterpriseId = form.watch('enterpriseId');

  const availableEmployees = allEmployees.filter(emp => emp.enterpriseId === selectedEnterpriseId);
  const availablePatients = allPatients.filter(pat => pat.enterpriseId === selectedEnterpriseId && 
    (pat.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) || (pat.contactPhone && pat.contactPhone.includes(patientSearchTerm)))
  );
  
  useEffect(() => {
    if (isOpen) {
        form.reset(group ? {
            ...group,
            memberPatientIds: group.memberPatientIds || [],
            tags: group.tags?.join(', ') || '',
        } : {
            name: '',
            enterpriseId: enterprises.length > 0 ? enterprises[0].id : '',
            managingEmployeeId: undefined,
            type: 'personal_wechat_group',
            platformGroupId: '',
            description: '',
            memberPatientIds: [],
            platformConnectionId: undefined,
            connectionStatus: 'not_monitored',
            tags: '',
        });
        setPatientSearchTerm('');
    }
  }, [group, isOpen, enterprises, form]);


  const handleFormSubmit: SubmitHandler<CommunityGroupFormValues> = (data) => {
    const groupToSubmit: SaasCommunityGroup = {
      ...group, 
      id: group?.id || `cg-${Date.now().toString()}`,
      creationDate: group?.creationDate || new Date().toISOString(),
      ...data,
      patientCount: data.memberPatientIds?.length || 0,
      tags: data.tags?.split(',').map(t => t.trim()).filter(t => t) || [],
    };
    onSubmit(groupToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{group ? '编辑社群' : '新增社群'}</DialogTitle>
          <DialogDescription>
            {group ? '修改社群的详细信息。' : '创建一个新的微信群组记录。'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({field}) => (
                <FormItem><FormLabel>群名称</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>群类型</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="personal_wechat_group">个人微信群</SelectItem>
                      <SelectItem value="enterprise_wechat_group">企业微信群</SelectItem>
                      <SelectItem value="other_platform_group">其他平台群</SelectItem>
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="enterpriseId" render={({ field }) => (
                    <FormItem>
                    <FormLabel>所属企业</FormLabel>
                    <Select onValueChange={(value) => { field.onChange(value); form.setValue('managingEmployeeId', undefined); form.setValue('memberPatientIds', []); }} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="选择企业" /></SelectTrigger></FormControl>
                        <SelectContent>
                        {enterprises.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
                        </SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="managingEmployeeId" render={({ field }) => (
                    <FormItem>
                    <FormLabel>管理员工 (可选)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedEnterpriseId || availableEmployees.length === 0}>
                        <FormControl><SelectTrigger><SelectValue placeholder="选择管理员工" /></SelectTrigger></FormControl>
                        <SelectContent>
                        <SelectItem value="">未指定</SelectItem>
                        {availableEmployees.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
                        </SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}/>
            </div>
            <FormField control={form.control} name="platformGroupId" render={({field}) => (
              <FormItem><FormLabel>平台群组ID (可选)</FormLabel><FormControl><Input placeholder="例如: 微信群的实际ID" {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({field}) => (
              <FormItem><FormLabel>描述 (可选)</FormLabel><FormControl><Textarea rows={2} placeholder="群用途、主要沟通内容等" {...field} /></FormControl><FormMessage/></FormItem>
            )}/>

            <FormField
              control={form.control}
              name="memberPatientIds"
              render={({ field: currentField }) => ( // Rename field to avoid conflict with outer scope
                <FormItem>
                  <FormLabel>群成员 (病人)</FormLabel>
                  <Input 
                    placeholder="搜索病人姓名或电话..." 
                    value={patientSearchTerm} 
                    onChange={(e) => setPatientSearchTerm(e.target.value)}
                    className="mb-2 h-9"
                    disabled={!selectedEnterpriseId}
                  />
                  <ScrollArea className="h-40 border rounded-md p-2">
                    {availablePatients.length > 0 ? availablePatients.map((patient) => (
                      <div key={patient.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`patient-${patient.id}`}
                          checked={currentField.value?.includes(patient.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? currentField.onChange([...(currentField.value || []), patient.id])
                              : currentField.onChange(
                                  (currentField.value || []).filter((id) => id !== patient.id)
                                );
                          }}
                        />
                        <label htmlFor={`patient-${patient.id}`} className="text-sm font-medium leading-none">
                          {patient.name}
                          {patient.contactPhone && <span className="text-xs text-muted-foreground ml-1">({patient.contactPhone})</span>}
                          {patient.primaryDisease && <Badge variant="outline" className="ml-2 text-xs">{patient.primaryDisease}</Badge>}
                        </label>
                      </div>
                    )) : <p className="text-xs text-muted-foreground text-center py-2">{!selectedEnterpriseId ? "请先选择企业" : "未找到病人或此企业无病人。"}</p>}
                  </ScrollArea>
                  {currentField.value && currentField.value.length > 0 && (
                     <div className="mt-1">
                        <Badge variant="secondary">已选: {currentField.value.length} 名病人</Badge>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="platformConnectionId" render={({ field }) => (
                    <FormItem>
                    <FormLabel>关联平台连接 (可选)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="选择一个平台连接" /></SelectTrigger></FormControl>
                        <SelectContent>
                        <SelectItem value="">不关联</SelectItem>
                        {platformConnections.filter(pc => pc.enterpriseId === selectedEnterpriseId || !pc.enterpriseId).map(pc => (<SelectItem key={pc.id} value={pc.id}>{pc.accountName} ({pc.platform})</SelectItem>))}
                        </SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="connectionStatus" render={({ field }) => (
                    <FormItem>
                    <FormLabel>群连接/同步状态</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                        <SelectItem value="active_sync">已连接并同步</SelectItem>
                        <SelectItem value="inactive_sync">已连接但未同步</SelectItem>
                        <SelectItem value="error_sync">同步错误</SelectItem>
                        <SelectItem value="not_monitored">未监控</SelectItem>
                        </SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}/>
            </div>
            <FormField control={form.control} name="tags" render={({field}) => (
              <FormItem><FormLabel>标签 (可选, 逗号分隔)</FormLabel><FormControl><Input placeholder="例如: 高血压患者, VIP服务群" {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{group ? '保存更改' : '创建社群'}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}

