
'use client';

import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// Ensure this imports from saas-admin's local Select component which renders a native select.
// The path alias `@/components/ui/select` inside saas-admin resolves to `saas-admin/src/components/ui/Select.tsx`.
import { Select, SelectItem } from "@/components/ui/select"; 
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
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
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: department ? {
      name: department.name,
      parentDepartmentId: department.parentDepartmentId || '', // Use empty string for native select if no value
      headEmployeeId: department.headEmployeeId || '', // Use empty string for native select if no value
      description: department.description || '',
    } : {
      name: '',
      parentDepartmentId: '',
      headEmployeeId: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
        if (department) {
        form.reset({
            name: department.name,
            parentDepartmentId: department.parentDepartmentId || '',
            headEmployeeId: department.headEmployeeId || '',
            description: department.description || '',
        });
        } else {
        form.reset({
            name: '',
            parentDepartmentId: '',
            headEmployeeId: '',
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
      parentDepartmentId: data.parentDepartmentId === '' ? null : data.parentDepartmentId,
      headEmployeeId: data.headEmployeeId === '' ? null : data.headEmployeeId,
      description: data.description,
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
                        <Label htmlFor={field.name}>部门名称</Label>
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
                  <Label htmlFor={field.name}>上级部门 (可选)</Label>
                  <FormControl>
                    <Select // This is saas-admin's custom Select which renders a native <select>
                      {...field} // Spreads RHF field props (value, onChange, onBlur, name, ref)
                      id={field.name} // Ensure id is passed to the underlying select for the label
                      value={field.value || ''} // Native select expects string values, use empty for "no selection"
                      onChange={(e) => { // Adapt native select's onChange
                        const selectedValue = e.target.value;
                        field.onChange(selectedValue === '' ? null : selectedValue); // RHF expects null for optional empty
                      }}
                    >
                      <SelectItem value="">无上级部门 (设为顶级)</SelectItem>
                      {existingDepartments
                        .filter(d => d.id !== department?.id) 
                        .map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="headEmployeeId"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor={field.name}>部门负责人 (可选)</Label>
                  <FormControl>
                     <Select // This is saas-admin's custom Select
                      {...field}
                      id={field.name}
                      value={field.value || ''}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        field.onChange(selectedValue === '' ? null : selectedValue);
                      }}
                    >
                      <SelectItem value="">暂不指定负责人</SelectItem>
                      {enterpriseEmployees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.name} ({emp.email})</SelectItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                 </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="description"
                render={({field}) => (
                     <FormItem>
                        <Label htmlFor={field.name}>部门描述 (可选)</Label>
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
