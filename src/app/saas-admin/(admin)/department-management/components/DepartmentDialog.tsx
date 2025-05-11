
'use client';

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form'; // Removed Controller, not needed if using FormField
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"; // Adjusted path
import { Button } from '@/components/ui/button'; // Adjusted path
import { Input } from '@/components/ui/input'; // Adjusted path
import { Label } from '@/components/ui/label'; // Adjusted path
import { Textarea } from '@/components/ui/textarea'; // Adjusted path
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Adjusted path
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"; // Added Form, FormMessage
import type { SaasDepartment, SaasEmployee } from '@/lib/types'; 

const departmentSchema = z.object({
  name: z.string().min(2, { message: "部门名称至少需要2个字符。" }),
  parentDepartmentId: z.string().nullable().optional(),
  headEmployeeId: z.string().nullable().optional(),
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
  const form = useForm<DepartmentFormValues>({ // Changed to 'form'
    resolver: zodResolver(departmentSchema),
    defaultValues: department ? {
      name: department.name,
      parentDepartmentId: department.parentDepartmentId || null,
      headEmployeeId: department.headEmployeeId || null,
      description: department.description || '',
    } : {
      name: '',
      parentDepartmentId: null,
      headEmployeeId: null,
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
        if (department) {
        form.reset({ // Use form.reset
            name: department.name,
            parentDepartmentId: department.parentDepartmentId || null,
            headEmployeeId: department.headEmployeeId || null,
            description: department.description || '',
        });
        } else {
        form.reset({ // Use form.reset
            name: '',
            parentDepartmentId: null,
            headEmployeeId: null,
            description: '',
        });
        }
    }
  }, [department, form.reset, isOpen, form]); // Added form to dependencies

  const handleFormSubmit: SubmitHandler<DepartmentFormValues> = (data) => {
    const departmentToSubmit: SaasDepartment = {
      ...department, 
      id: department?.id || `dept-${Date.now().toString()}`, 
      creationDate: department?.creationDate || new Date().toISOString(),
      enterpriseId: enterpriseId, 
      ...data,
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
        <Form {...form}> {/* Wrap with Form provider */}
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <Label htmlFor="name">部门名称</Label> {/* Standard Label */}
                        <FormControl>
                             <Input id="name" {...field} />
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
                  <Label htmlFor="parentDepartmentId-select">上级部门 (可选)</Label> {/* Standard Label */}
                  <Select onValueChange={(value) => field.onChange(value === 'none' ? null : value)} value={field.value || 'none'}>
                    <FormControl> {/* This FormControl now gets context */}
                      <SelectTrigger id="parentDepartmentId-select">
                          <SelectValue placeholder="选择上级部门" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">无上级部门 (设为顶级)</SelectItem>
                      {existingDepartments
                        .filter(d => d.id !== department?.id) 
                        .map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage /> {/* Use FormMessage from ui/form */}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="headEmployeeId"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="headEmployeeId-select">部门负责人 (可选)</Label> {/* Standard Label */}
                  <Select onValueChange={(value) => field.onChange(value === 'none' ? null : value)} value={field.value || 'none'}>
                      <FormControl> {/* This FormControl now gets context */}
                          <SelectTrigger id="headEmployeeId-select">
                              <SelectValue placeholder="选择部门负责人" />
                          </SelectTrigger>
                      </FormControl>
                    <SelectContent>
                      <SelectItem value="none">暂不指定负责人</SelectItem>
                      {enterpriseEmployees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.name} ({emp.email})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage /> {/* Use FormMessage from ui/form */}
                 </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="description"
                render={({field}) => (
                     <FormItem>
                        <Label htmlFor="description">部门描述 (可选)</Label> {/* Standard Label */}
                        <FormControl>
                            <Textarea id="description" {...field} />
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
