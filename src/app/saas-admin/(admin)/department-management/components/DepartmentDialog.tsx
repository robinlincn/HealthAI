
'use client';

import { useEffect } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SaasDepartment, SaasEmployee } from '@/lib/types'; // Assuming SaasEmployee type exists

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
  enterpriseId: string; // To associate department with an enterprise
  existingDepartments: SaasDepartment[]; // For parent department selection
  enterpriseEmployees: SaasEmployee[]; // For head employee selection
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
  const { register, handleSubmit, reset, formState: { errors }, control } = useForm<DepartmentFormValues>({
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
        reset({
            name: department.name,
            parentDepartmentId: department.parentDepartmentId || null,
            headEmployeeId: department.headEmployeeId || null,
            description: department.description || '',
        });
        } else {
        reset({
            name: '',
            parentDepartmentId: null,
            headEmployeeId: null,
            description: '',
        });
        }
    }
  }, [department, reset, isOpen]);

  const handleFormSubmit: SubmitHandler<DepartmentFormValues> = (data) => {
    const departmentToSubmit: SaasDepartment = {
      ...department, 
      id: department?.id || Date.now().toString(), 
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
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <Label htmlFor="name">部门名称</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <Controller
            name="parentDepartmentId"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor="parentDepartmentId">上级部门 (可选)</Label>
                <Select onValueChange={(value) => field.onChange(value === 'none' ? null : value)} value={field.value || 'none'}>
                  <SelectTrigger id="parentDepartmentId">
                    <SelectValue placeholder="选择上级部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">无上级部门 (设为顶级)</SelectItem>
                    {existingDepartments
                      .filter(d => d.id !== department?.id) // Prevent self-referencing
                      .map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.parentDepartmentId && <p className="text-sm text-destructive mt-1">{errors.parentDepartmentId.message}</p>}
              </div>
            )}
          />
          
          <Controller
            name="headEmployeeId"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor="headEmployeeId">部门负责人 (可选)</Label>
                <Select onValueChange={(value) => field.onChange(value === 'none' ? null : value)} value={field.value || 'none'}>
                  <SelectTrigger id="headEmployeeId">
                    <SelectValue placeholder="选择部门负责人" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">暂不指定负责人</SelectItem>
                    {enterpriseEmployees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.name} ({emp.email})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.headEmployeeId && <p className="text-sm text-destructive mt-1">{errors.headEmployeeId.message}</p>}
              </div>
            )}
          />

          <div>
            <Label htmlFor="description">部门描述 (可选)</Label>
            <Textarea id="description" {...register('description')} />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>取消</Button>
            <Button type="submit">{department ? '保存更改' : '创建部门'}</Button>
          </DialogFooter>
        </form>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
