
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
import type { SaasDepartment, SaasEmployee } from '@/lib/types'; 

const NO_PARENT_VALUE = "__NO_PARENT_DEPARTMENT__";
const NO_HEAD_VALUE = "__NO_DEPARTMENT_HEAD__";

const departmentSchema = z.object({
  name: z.string().min(2, { message: "部门名称至少需要2个字符。" }),
  parentDepartmentId: z.string().optional(), 
  headEmployeeId: z.string().optional(),     
  description: z.string().optional(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface DepartmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaasDepartment) => void;
  department?: SaasDepartment | null;
  enterpriseId: string; 
  existingDepartments: SaasDepartment[]; 
  enterpriseEmployees: SaasEmployee[]; 
}

export function DepartmentDialog({ 
    isOpen, 
    onClose, 
    onSubmit, 
    department, 
    enterpriseId,
    existingDepartments,
    enterpriseEmployees 
}: DepartmentDialogProps) {
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: department ? {
      name: department.name,
      parentDepartmentId: department.parentDepartmentId ?? undefined,
      headEmployeeId: department.headEmployeeId ?? undefined,
      description: department.description || '',
    } : {
      name: '',
      parentDepartmentId: undefined,
      headEmployeeId: undefined,
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
        if (department) {
        form.reset({
            name: department.name,
            parentDepartmentId: department.parentDepartmentId ?? undefined,
            headEmployeeId: department.headEmployeeId ?? undefined,
            description: department.description || '',
        });
        } else {
        form.reset({
            name: '',
            parentDepartmentId: undefined,
            headEmployeeId: undefined,
            description: '',
        });
        }
    }
  }, [department, form, isOpen]);

  const handleFormSubmit: SubmitHandler<DepartmentFormValues> = (data) => {
    const departmentToSubmit: SaasDepartment = {
      ...department, 
      id: department?.id || `dept-${Date.now().toString()}`, 
      creationDate: department?.creationDate || new Date().toISOString(),
      enterpriseId: enterpriseId, 
      name: data.name,
      parentDepartmentId: data.parentDepartmentId === NO_PARENT_VALUE || !data.parentDepartmentId ? null : data.parentDepartmentId,
      headEmployeeId: data.headEmployeeId === NO_HEAD_VALUE || !data.headEmployeeId ? null : data.headEmployeeId,
      description: data.description || undefined,
    };
    onSubmit(departmentToSubmit);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{department ? '编辑部门' : '新增部门'}</DialogTitle>
          <DialogDescription>
            {department ? '修改部门的详细信息。' : '为当前企业创建一个新的部门或科室。'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>部门名称</FormLabel>
                        <FormControl>
                             <Input id={field.name} {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="parentDepartmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>上级部门 (可选)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                  >
                    <FormControl>
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="无上级部门 (设为顶级)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NO_PARENT_VALUE}>无上级部门 (设为顶级)</SelectItem>
                      {existingDepartments
                        .filter(d => d.id !== department?.id) 
                        .map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="headEmployeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>部门负责人 (可选)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="暂不指定负责人" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NO_HEAD_VALUE}>暂不指定负责人</SelectItem>
                      {enterpriseEmployees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.name} ({emp.email})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                 </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="description"
                render={({field}) => (
                     <FormItem>
                        <FormLabel>部门描述 (可选)</FormLabel>
                        <FormControl>
                            <Textarea id={field.name} {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>取消</Button>
              <Button type="submit">{department ? '保存更改' : '创建部门'}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
