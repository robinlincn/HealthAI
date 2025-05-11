
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
import { Checkbox } from "@/components/ui/checkbox";
import type { SaasServicePackage } from '@/lib/types';

const servicePackageSchema = z.object({
  name: z.string().min(2, { message: "服务包名称至少需要2个字符。" }),
  type: z.enum(['basic', 'standard', 'premium', 'custom']),
  priceMonthly: z.coerce.number().min(0, { message: "月度价格不能为负。" }),
  priceAnnually: z.coerce.number().min(0, { message: "年度价格不能为负。" }).optional(),
  features: z.string().min(5, { message: "功能特性描述至少5个字符。" }), // Will be split by newline
  highlights: z.string().optional(),
  maxUsers: z.coerce.number().int().min(1, { message: "用户数至少为1。" }),
  maxStorageGB: z.coerce.number().int().min(1, { message: "存储至少为1GB。" }),
  maxPatients: z.coerce.number().int().min(1, { message: "病人额度至少为1。" }),
  isEnabled: z.boolean().default(true),
});

type ServicePackageFormValues = z.infer<typeof servicePackageSchema>;

interface ServicePackageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaasServicePackage) => void;
  servicePackage?: SaasServicePackage | null;
}

export function ServicePackageDialog({ isOpen, onClose, onSubmit, servicePackage }: ServicePackageDialogProps) {
  const form = useForm<ServicePackageFormValues>({
    resolver: zodResolver(servicePackageSchema),
    defaultValues: servicePackage ? {
      ...servicePackage,
      features: servicePackage.features.join('\n'),
      priceAnnually: servicePackage.priceAnnually ?? undefined,
    } : {
      name: '',
      type: 'basic',
      priceMonthly: 0,
      priceAnnually: undefined,
      features: '',
      highlights: '',
      maxUsers: 10,
      maxStorageGB: 20,
      maxPatients: 100,
      isEnabled: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (servicePackage) {
        form.reset({
          ...servicePackage,
          features: servicePackage.features.join('\n'),
          priceAnnually: servicePackage.priceAnnually ?? undefined,
        });
      } else {
        form.reset({
          name: '', type: 'basic', priceMonthly: 0, priceAnnually: undefined,
          features: '', highlights: '', maxUsers: 10, maxStorageGB: 20, maxPatients: 100, isEnabled: true,
        });
      }
    }
  }, [servicePackage, form, isOpen]);

  const handleFormSubmit: SubmitHandler<ServicePackageFormValues> = (data) => {
    const packageToSubmit: SaasServicePackage = {
      ...servicePackage, 
      id: servicePackage?.id || `pkg-${Date.now().toString()}`,
      ...data,
      features: data.features.split('\n').map(f => f.trim()).filter(f => f), // Split features string into array
      priceAnnually: data.priceAnnually || undefined,
    };
    onSubmit(packageToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{servicePackage ? '编辑服务包' : '新增服务包'}</DialogTitle>
          <DialogDescription>
            {servicePackage ? '修改服务包的详细信息。' : '创建一个新的服务包。'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({field}) => (
                <FormItem><FormLabel>服务包名称</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>类型</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="basic">基础版</SelectItem>
                      <SelectItem value="standard">标准版</SelectItem>
                      <SelectItem value="premium">高级版</SelectItem>
                      <SelectItem value="custom">自定义</SelectItem>
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField control={form.control} name="priceMonthly" render={({field}) => (
                <FormItem><FormLabel>月度价格 (元)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="priceAnnually" render={({field}) => (
                <FormItem><FormLabel>年度价格 (元, 可选)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
            </div>
            <FormField control={form.control} name="features" render={({field}) => (
              <FormItem><FormLabel>功能特性 (每行一项)</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField control={form.control} name="highlights" render={({field}) => (
              <FormItem><FormLabel>亮点说明 (可选)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <fieldset className="border p-3 rounded-md">
              <legend className="text-sm font-medium px-1">资源限制</legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                <FormField control={form.control} name="maxUsers" render={({field}) => (
                  <FormItem><FormLabel>最大用户数</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="maxStorageGB" render={({field}) => (
                  <FormItem><FormLabel>最大存储 (GB)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
                <FormField control={form.control} name="maxPatients" render={({field}) => (
                  <FormItem><FormLabel>最大病人额度</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>
                )}/>
              </div>
            </fieldset>
             <FormField control={form.control} name="isEnabled" render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>启用服务包</FormLabel>
                  <FormMessage />
                </div>
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )}/>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{servicePackage ? '保存更改' : '创建服务包'}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
