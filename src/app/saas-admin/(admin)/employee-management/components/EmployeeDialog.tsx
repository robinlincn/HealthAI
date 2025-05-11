
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
import type { SaasEmployee, SaasDepartment } from '@/lib/types';
import { format, parseISO } from 'date-fns';

const NO_DEPARTMENT_VALUE = "__NO_DEPARTMENT__";

const employeeSchema = z.object({
  name: z.string().min(2, { message: "员工姓名至少需要2个字符。" }),
  email: z.string().email({ message: "请输入有效的邮箱地址。" }),
  phone: z.string().regex(/^1[3-9]\d{9}$/, { message: "请输入有效的中国大陆手机号码。" }).optional().or(z.literal('')),
  employeeNumber: z.string().optional(),
  departmentId: z.string().optional(),
  roleTitle: z.string().optional(), // Descriptive role within the enterprise
  status: z.enum(['active', 'invited', 'disabled']),
  joinDate: z.string().refine((date) => !isNaN(parseISO(date).valueOf()), {message: "请输入有效的日期"}),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaasEmployee) => void;
  employee?: SaasEmployee | null;
  enterpriseId: string; 
  departments: SaasDepartment[]; 
}

export function EmployeeDialog({ 
    isOpen, 
    onClose, 
    onSubmit, 
    employee, 
    enterpriseId,
    departments 
}: EmployeeDialogProps) {

  const defaultJoinDate = employee?.joinDate ? format(parseISO(employee.joinDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
  
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee ? {
      ...employee,
      phone: employee.phone || '',
      employeeNumber: employee.employeeNumber || '',
      departmentId: employee.departmentId ?? undefined,
      roleTitle: employee.roleTitle || '',
      joinDate: defaultJoinDate,
    } : {
      name: '',
      email: '',
      phone: '',
      employeeNumber: '',
      departmentId: undefined,
      roleTitle: '',
      status: 'active',
      joinDate: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  useEffect(() => {
    if (isOpen) {
      const joinDateFormatted = employee?.joinDate ? format(parseISO(employee.joinDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
      if (employee) {
        form.reset({
            ...employee,
            phone: employee.phone || '',
            employeeNumber: employee.employeeNumber || '',
            departmentId: employee.departmentId ?? undefined,
            roleTitle: employee.roleTitle || '',
            joinDate: joinDateFormatted,
        });
      } else {
        form.reset({
            name: '',
            email: '',
            phone: '',
            employeeNumber: '',
            departmentId: undefined,
            roleTitle: '',
            status: 'active',
            joinDate: format(new Date(), 'yyyy-MM-dd'),
        });
      }
    }
  }, [employee, form, isOpen]);

  const handleFormSubmit: SubmitHandler<EmployeeFormValues> = (data) => {
    const employeeToSubmit: SaasEmployee = {
      ...employee, 
      id: employee?.id || `emp-${Date.now().toString()}`, 
      enterpriseId: enterpriseId,
      ...data,
      departmentId: data.departmentId === NO_DEPARTMENT_VALUE || !data.departmentId ? null : data.departmentId,
      joinDate: parseISO(data.joinDate).toISOString(), // Ensure stored as ISO string
      phone: data.phone || undefined,
      employeeNumber: data.employeeNumber || undefined,
      roleTitle: data.roleTitle || undefined,
    };
    onSubmit(employeeToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{employee ? '编辑员工' : '新增员工'}</DialogTitle>
          <DialogDescription>
            {employee ? '修改员工的详细信息。' : '为当前企业添加一个新的员工账户。'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({field}) => (
                <FormItem><FormLabel>姓名</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="email" render={({field}) => (
                <FormItem><FormLabel>邮箱</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="phone" render={({field}) => (
                <FormItem><FormLabel>电话 (可选)</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="employeeNumber" render={({field}) => (
                <FormItem><FormLabel>工号 (可选)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="departmentId" render={({ field }) => (
                <FormItem>
                  <FormLabel>所属部门 (可选)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="选择部门" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value={NO_DEPARTMENT_VALUE}>未分配部门</SelectItem>
                      {departments.map(d => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="roleTitle" render={({field}) => (
                <FormItem><FormLabel>职位/角色名称 (可选)</FormLabel><FormControl><Input placeholder="例如：主任医师、护士" {...field} /></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>账户状态</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="选择状态" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="active">已激活</SelectItem>
                      <SelectItem value="invited">已邀请 (待激活)</SelectItem>
                      <SelectItem value="disabled">已禁用</SelectItem>
                    </SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )}/>
               <FormField control={form.control} name="joinDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>入职日期</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{employee ? '保存更改' : '创建员工'}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
