
'use client';

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import type { SaasSystemRole } from '@/lib/types';

const roleSchema = z.object({
  name: z.string().min(2, { message: "角色名称至少需要2个字符。" }),
  description: z.string().optional(),
  permissions: z.string().min(1, {message: "至少需要一个权限定义。"}), // Comma-separated string
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaasSystemRole) => void;
  role?: SaasSystemRole | null;
}

export function RoleDialog({ isOpen, onClose, onSubmit, role }: RoleDialogProps) {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: role ? {
      name: role.name,
      description: role.description || '',
      permissions: role.permissions.join(', '),
    } : {
      name: '',
      description: '',
      permissions: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (role) {
        form.reset({
          name: role.name,
          description: role.description || '',
          permissions: role.permissions.join(', '),
        });
      } else {
        form.reset({ name: '', description: '', permissions: '' });
      }
    }
  }, [role, form, isOpen]);

  const handleFormSubmit: SubmitHandler<RoleFormValues> = (data) => {
    const roleToSubmit: SaasSystemRole = {
      ...role, 
      id: role?.id || `role-${Date.now().toString()}`,
      name: data.name,
      description: data.description || undefined,
      permissions: data.permissions.split(',').map(p => p.trim()).filter(p => p),
    };
    onSubmit(roleToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{role ? '编辑系统角色' : '新增系统角色'}</DialogTitle>
          <DialogDescription>
            {role ? '修改角色的详细信息和权限。' : '定义一个新的SAAS平台系统角色。'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField control={form.control} name="name" render={({field}) => (
              <FormItem><FormLabel>角色名称</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({field}) => (
              <FormItem><FormLabel>角色描述 (可选)</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField control={form.control} name="permissions" render={({field}) => (
              <FormItem>
                <FormLabel>权限列表 (逗号分隔)</FormLabel>
                <FormControl><Textarea rows={4} placeholder="例如：manage_users, view_reports, edit_settings" {...field} /></FormControl>
                <FormMessage/>
                <p className="text-xs text-muted-foreground">输入权限标识符，用逗号分隔。例如："manage_enterprises", "view_analytics".</p>
              </FormItem>
            )}/>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{role ? '保存更改' : '创建角色'}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
