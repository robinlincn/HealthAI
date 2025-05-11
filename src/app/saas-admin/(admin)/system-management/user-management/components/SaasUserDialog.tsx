
'use client';

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import type { SaasSystemUser, SaasSystemRole } from '@/lib/types';

const saasUserSchema = z.object({
  name: z.string().min(2, { message: "管理员姓名至少需要2个字符。" }),
  email: z.string().email({ message: "请输入有效的邮箱地址。" }),
  systemRoleId: z.string().min(1, { message: "必须为管理员选择一个系统角色。"}),
  status: z.enum(['active', 'disabled']),
  // Password field is intentionally omitted here for simplicity.
  // In a real app, password handling (creation/reset) would be separate and secure.
});

type SaasUserFormValues = z.infer<typeof saasUserSchema>;

interface SaasUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaasSystemUser) => void;
  user?: SaasSystemUser | null;
  roles: SaasSystemRole[]; // For role selection dropdown
}

export function SaasUserDialog({ isOpen, onClose, onSubmit, user, roles }: SaasUserDialogProps) {
  const form = useForm<SaasUserFormValues>({
    resolver: zodResolver(saasUserSchema),
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      systemRoleId: user.systemRoleId,
      status: user.status,
    } : {
      name: '',
      email: '',
      systemRoleId: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (user) {
        form.reset({
          name: user.name,
          email: user.email,
          systemRoleId: user.systemRoleId,
          status: user.status,
        });
      } else {
        form.reset({
          name: '', email: '', systemRoleId: roles.length > 0 ? roles[0].id : '', status: 'active',
        });
      }
    }
  }, [user, form, isOpen, roles]);

  const handleFormSubmit: SubmitHandler<SaasUserFormValues> = (data) => {
    const userToSubmit: SaasSystemUser = {
      ...user, 
      id: user?.id || `su-${Date.now().toString()}`,
      ...data,
      // lastLogin is not part of the form, it would be updated by the system
    };
    onSubmit(userToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{user ? '编辑SAAS管理员' : '新增SAAS管理员'}</DialogTitle>
          <DialogDescription>
            {user ? '修改管理员的详细信息。' : '创建一个新的SAAS平台管理员账户。'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField control={form.control} name="name" render={({field}) => (
              <FormItem><FormLabel>姓名</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField control={form.control} name="email" render={({field}) => (
              <FormItem><FormLabel>邮箱</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage/></FormItem>
            )}/>
            <FormField control={form.control} name="systemRoleId" render={({ field }) => (
              <FormItem>
                <FormLabel>系统角色</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="选择系统角色" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {roles.map(role => (<SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>))}
                  </SelectContent>
                </Select><FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>账户状态</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="选择状态" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="active">已激活</SelectItem>
                    <SelectItem value="disabled">已禁用</SelectItem>
                  </SelectContent>
                </Select><FormMessage />
              </FormItem>
            )}/>
             <FormItem>
                <FormLabel>密码</FormLabel>
                <Input type="password" value="********" disabled placeholder="密码在此处不可编辑" />
                <FormMessage />
                <p className="text-xs text-muted-foreground">
                  {user ? "如需重置密码，请使用密码重置功能。" : "初始密码将通过安全方式发送给用户。"}
                </p>
            </FormItem>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{user ? '保存更改' : '创建管理员'}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
