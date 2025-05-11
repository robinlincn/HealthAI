
'use client';

import { useEffect } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"; // Adjusted path
import { Button } from '@/components/ui/button'; // Adjusted path
import { Input } from '@/components/ui/input'; // Adjusted path
import { Label } from '@/components/ui/label'; // Adjusted path
import { Textarea } from '@/components/ui/textarea'; // Adjusted path
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Adjusted path
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"; // Added Form, FormMessage
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
  const form = useForm<EnterpriseFormValues>({ // Changed to 'form'
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
        form.reset({ // Use form.reset
            ...enterprise,
            assignedResources: {
            maxUsers: enterprise.assignedResources?.maxUsers || 10,
            maxStorageGB: enterprise.assignedResources?.maxStorageGB || 5,
            maxPatients: enterprise.assignedResources?.maxPatients || 100,
            }
        });
        } else {
        form.reset({ // Use form.reset
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
  }, [enterprise, form.reset, isOpen, form]); // Added form to dependencies

  const handleFormSubmit: SubmitHandler<EnterpriseFormValues> = (data) => {
    const enterpriseToSubmit: SaasEnterprise = {
      ...enterprise, 
      id: enterprise?.id || `ent-${Date.now().toString()}`, 
      creationDate: enterprise?.creationDate || new Date().toISOString(), 
      ...data,
    };
    onSubmit(enterpriseToSubmit);
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
        <Form {...form}> {/* Wrap with Form provider */}
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <Label htmlFor="name">企业名称</Label>
              <Input id="name" {...form.register('name')} />
              {form.formState.errors.name && <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="contactPerson">联系人</Label>
              <Input id="contactPerson" {...form.register('contactPerson')} />
              {form.formState.errors.contactPerson && <p className="text-sm text-destructive mt-1">{form.formState.errors.contactPerson.message}</p>}
            </div>
            <div>
              <Label htmlFor="contactEmail">联系邮箱</Label>
              <Input id="contactEmail" type="email" {...form.register('contactEmail')} />
              {form.formState.errors.contactEmail && <p className="text-sm text-destructive mt-1">{form.formState.errors.contactEmail.message}</p>}
            </div>
            <div>
              <Label htmlFor="contactPhone">联系电话</Label>
              <Input id="contactPhone" type="tel" {...form.register('contactPhone')} />
              {form.formState.errors.contactPhone && <p className="text-sm text-destructive mt-1">{form.formState.errors.contactPhone.message}</p>}
            </div>
            <div>
              <Label htmlFor="address">地址 (可选)</Label>
              <Input id="address" {...form.register('address')} />
              {form.formState.errors.address && <p className="text-sm text-destructive mt-1">{form.formState.errors.address.message}</p>}
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                  <FormItem>
                      <Label htmlFor="status-select">账户状态</Label> {/* Standard Label */}
                      <Select onValueChange={field.onChange} value={field.value} name="status-select">
                          <FormControl> {/* This FormControl now gets context */}
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
                      <FormMessage /> {/* Use FormMessage from ui/form */}
                  </FormItem>
              )}
            />

            <fieldset className="border p-3 rounded-md">
              <legend className="text-sm font-medium px-1">资源分配</legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                <div>
                  <Label htmlFor="maxUsers">最大用户数</Label>
                  <Input id="maxUsers" type="number" {...form.register('assignedResources.maxUsers')} />
                  {form.formState.errors.assignedResources?.maxUsers && <p className="text-sm text-destructive mt-1">{form.formState.errors.assignedResources.maxUsers.message}</p>}
                </div>
                <div>
                  <Label htmlFor="maxStorageGB">最大存储 (GB)</Label>
                  <Input id="maxStorageGB" type="number" {...form.register('assignedResources.maxStorageGB')} />
                  {form.formState.errors.assignedResources?.maxStorageGB && <p className="text-sm text-destructive mt-1">{form.formState.errors.assignedResources.maxStorageGB.message}</p>}
                </div>
                <div>
                  <Label htmlFor="maxPatients">最大病人额度</Label>
                  <Input id="maxPatients" type="number" {...form.register('assignedResources.maxPatients')} />
                  {form.formState.errors.assignedResources?.maxPatients && <p className="text-sm text-destructive mt-1">{form.formState.errors.assignedResources.maxPatients.message}</p>}
                </div>
              </div>
            </fieldset>
            <div>
              <Label htmlFor="notes">备注 (可选)</Label>
              <Textarea id="notes" {...form.register('notes')} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{enterprise ? '保存更改' : '创建账户'}</Button>
            </DialogFooter>
          </form>
        </Form>
         <DialogClose asChild>
            <button type="button" className="sr-only">Close</button>
         </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
