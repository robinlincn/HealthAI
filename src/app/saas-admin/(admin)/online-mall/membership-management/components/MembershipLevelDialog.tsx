
'use client';

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import type { SaasMembershipLevel } from '@/lib/types';

const levelSchema = z.object({
  name: z.string().min(2, { message: "等级名称至少需要2个字符。" }),
  minPoints: z.coerce.number().int().min(0, "所需积分不能为负。").optional(),
  discountPercentage: z.coerce.number().min(0, "折扣不能为负。").max(100, "折扣不能超过100%").optional(),
  description: z.string().optional(),
  permissions: z.string().optional().describe("多个权限用逗号分隔"),
});

type LevelFormValues = z.infer<typeof levelSchema>;

interface MembershipLevelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Pick<SaasMembershipLevel, 'name' | 'minPoints' | 'discountPercentage' | 'description' | 'permissions'> & { id?: string }) => void;
  level?: SaasMembershipLevel | null;
  enterpriseId: string; // To associate level with an enterprise
}

export function MembershipLevelDialog({ isOpen, onClose, onSubmit, level, enterpriseId }: MembershipLevelDialogProps) {
  const form = useForm<LevelFormValues>({
    resolver: zodResolver(levelSchema),
    defaultValues: level ? {
      name: level.name,
      minPoints: level.minPoints || undefined,
      discountPercentage: level.discountPercentage ? level.discountPercentage * 100 : undefined,
      description: level.description || '',
      permissions: level.permissions?.join(', ') || '',
    } : {
      name: '',
      minPoints: undefined,
      discountPercentage: undefined,
      description: '',
      permissions: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (level) {
        form.reset({
          name: level.name,
          minPoints: level.minPoints || undefined,
          discountPercentage: level.discountPercentage ? level.discountPercentage * 100 : undefined,
          description: level.description || '',
          permissions: level.permissions?.join(', ') || '',
        });
      } else {
        form.reset({ name: '', minPoints: undefined, discountPercentage: undefined, description: '', permissions: '' });
      }
    }
  }, [level, form, isOpen]);

  const handleFormSubmit: SubmitHandler<LevelFormValues> = (data) => {
    const levelToSubmit: Pick<SaasMembershipLevel, 'name' | 'minPoints' | 'discountPercentage' | 'description' | 'permissions'> & { id?: string, enterpriseId: string } = {
      id: level?.id,
      enterpriseId,
      name: data.name,
      minPoints: data.minPoints,
      discountPercentage: data.discountPercentage ? data.discountPercentage / 100 : undefined,
      description: data.description || undefined,
      permissions: data.permissions?.split(',').map(p => p.trim()).filter(p => p) || [],
    };
    // The onSubmit prop expects SaasMembershipLevel without enterpriseId in its Pick. We'll let the parent handle adding it if needed for API.
    // For local state management, enterpriseId is crucial. Let's adjust the type in onSubmit prop or handle it in the parent.
    // For now, let's assume parent expects these core fields + id.
    const { enterpriseId: _, ...submitData } = levelToSubmit; // Exclude enterpriseId from this direct submission data
    onSubmit(submitData as any); // Cast as any if type mismatch after exclusion
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{level ? '编辑会员等级' : '新增会员等级'}</DialogTitle>
          <DialogDescription>
            {level ? '修改会员等级的详细信息。' : '为当前企业创建一个新的会员等级。'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({field}) => (
              <FormItem><FormLabel>等级名称</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="minPoints" render={({field}) => (
                <FormItem><FormLabel>所需积分 (可选)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="discountPercentage" render={({field}) => (
                <FormItem><FormLabel>折扣 (%) (可选)</FormLabel><FormControl><Input type="number" min="0" max="100" step="0.01" {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
            </div>
            <FormField control={form.control} name="description" render={({field}) => (
              <FormItem><FormLabel>描述 (可选)</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
             <FormField control={form.control} name="permissions" render={({field}) => (
              <FormItem>
                <FormLabel>权限标识 (可选, 逗号分隔)</FormLabel>
                <FormControl><Input placeholder="e.g., exclusive_products, priority_support" {...field} /></FormControl>
                <FormDescription className="text-xs">定义此等级会员享有的特殊权限标识。</FormDescription>
                <FormMessage/>
              </FormItem>
            )}/>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{level ? '保存更改' : '创建等级'}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}

    