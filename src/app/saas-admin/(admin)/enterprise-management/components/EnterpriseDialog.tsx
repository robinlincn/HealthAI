
'use client';

import { useEffect } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form'; // Added Controller
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormControl } from "@/components/ui/form"; // Added FormField, FormItem, FormControl
import type { SaasEnterprise } from '@/lib/types';

const enterpriseSchema = z.object({
  name: z.string().min(2, { message: "企业名称至少需要2个字符。" }),
  contactPerson: z.string().min(2, { message: "联系人姓名至少需要2个字符。" }),
  contactEmail: z.string().email({ message: "请输入有效的邮箱地址。" }),
  contactPhone: z.string().regex(/^1[3-9]\d{9}$/, { message: "请输入有效的中国大陆手机号码。" }),
  address: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending_approval', 'suspended']),
  assignedResources: z.object({
    maxUsers: z.coerce.number().min(1, {message: "用户数至少为1"}).positive({message: "用户数必须为正数"}),
    maxStorageGB: z.coerce.number().min(1, {message: "存储空间至少为1GB"}).positive({message: "存储空间必须为正数"}),
    maxPatients: z.coerce.number().min(1, {message: "病人额度至少为1"}).positive({message: "病人额度必须为正数"}),
  }),
  notes: z.string().optional(),
});

type EnterpriseFormValues = z.infer<typeof enterpriseSchema>;

interface EnterpriseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaasEnterprise) => void;
  enterprise?: SaasEnterprise | null;
}

export function EnterpriseDialog({ isOpen, onClose, onSubmit, enterprise }: EnterpriseDialogProps) {
  const { register, handleSubmit, reset, formState: { errors }, control } = useForm<EnterpriseFormValues>({
    resolver: zodResolver(enterpriseSchema),
    defaultValues: enterprise ? {
      ...enterprise,
      assignedResources: {
        maxUsers: enterprise.assignedResources?.maxUsers || 10,
        maxStorageGB: enterprise.assignedResources?.maxStorageGB || 5,
        maxPatients: enterprise.assignedResources?.maxPatients || 100,
      }
    } : {
      name: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      status: 'pending_approval',
      assignedResources: { maxUsers: 10, maxStorageGB: 5, maxPatients: 100 },
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) { 
        if (enterprise) {
        reset({
            ...enterprise,
            assignedResources: {
            maxUsers: enterprise.assignedResources?.maxUsers || 10,
            maxStorageGB: enterprise.assignedResources?.maxStorageGB || 5,
            maxPatients: enterprise.assignedResources?.maxPatients || 100,
            }
        });
        } else {
        reset({
            name: '',
            contactPerson: '',
            contactEmail: '',
            contactPhone: '',
            address: '',
            status: 'pending_approval',
            assignedResources: { maxUsers: 10, maxStorageGB: 5, maxPatients: 100 },
            notes: '',
        });
        }
    }
  }, [enterprise, reset, isOpen]);

  const handleFormSubmit: SubmitHandler<EnterpriseFormValues> = (data) => {
    const enterpriseToSubmit: SaasEnterprise = {
      ...enterprise, 
      id: enterprise?.id || `ent-${Date.now().toString()}`, 
      creationDate: enterprise?.creationDate || new Date().toISOString(), 
      ...data,
    };
    onSubmit(enterpriseToSubmit);
    // onClose(); // Moved to parent to control dialog state after submission
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{enterprise ? '编辑企业账户' : '新增企业账户'}</DialogTitle>
          <DialogDescription>
            {enterprise ? '修改企业账户的详细信息。' : '填写以下信息以创建一个新的企业账户。'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <Label htmlFor="name">企业名称</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="contactPerson">联系人</Label>
            <Input id="contactPerson" {...register('contactPerson')} />
            {errors.contactPerson && <p className="text-sm text-destructive mt-1">{errors.contactPerson.message}</p>}
          </div>
          <div>
            <Label htmlFor="contactEmail">联系邮箱</Label>
            <Input id="contactEmail" type="email" {...register('contactEmail')} />
            {errors.contactEmail && <p className="text-sm text-destructive mt-1">{errors.contactEmail.message}</p>}
          </div>
          <div>
            <Label htmlFor="contactPhone">联系电话</Label>
            <Input id="contactPhone" type="tel" {...register('contactPhone')} />
            {errors.contactPhone && <p className="text-sm text-destructive mt-1">{errors.contactPhone.message}</p>}
          </div>
          <div>
            <Label htmlFor="address">地址 (可选)</Label>
            <Input id="address" {...register('address')} />
            {errors.address && <p className="text-sm text-destructive mt-1">{errors.address.message}</p>}
          </div>
          
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
                <FormItem>
                    <Label htmlFor="status-select">账户状态</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value} name="status-select">
                        <FormControl>
                            <SelectTrigger id="status-select">
                                <SelectValue placeholder="选择状态" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="pending_approval">待审批</SelectItem>
                            <SelectItem value="active">已激活</SelectItem>
                            <SelectItem value="inactive">未激活</SelectItem>
                            <SelectItem value="suspended">已暂停</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
                </FormItem>
            )}
            />

          <fieldset className="border p-3 rounded-md">
            <legend className="text-sm font-medium px-1">资源分配</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              <div>
                <Label htmlFor="maxUsers">最大用户数</Label>
                <Input id="maxUsers" type="number" {...register('assignedResources.maxUsers')} />
                {errors.assignedResources?.maxUsers && <p className="text-sm text-destructive mt-1">{errors.assignedResources.maxUsers.message}</p>}
              </div>
              <div>
                <Label htmlFor="maxStorageGB">最大存储 (GB)</Label>
                <Input id="maxStorageGB" type="number" {...register('assignedResources.maxStorageGB')} />
                 {errors.assignedResources?.maxStorageGB && <p className="text-sm text-destructive mt-1">{errors.assignedResources.maxStorageGB.message}</p>}
              </div>
              <div>
                <Label htmlFor="maxPatients">最大病人额度</Label>
                <Input id="maxPatients" type="number" {...register('assignedResources.maxPatients')} />
                {errors.assignedResources?.maxPatients && <p className="text-sm text-destructive mt-1">{errors.assignedResources.maxPatients.message}</p>}
              </div>
            </div>
          </fieldset>
          <div>
            <Label htmlFor="notes">备注 (可选)</Label>
            <Textarea id="notes" {...register('notes')} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>取消</Button>
            <Button type="submit">{enterprise ? '保存更改' : '创建账户'}</Button>
          </DialogFooter>
        </form>
         <DialogClose asChild>
            <button type="button" className="sr-only">Close</button>
         </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
