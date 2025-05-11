
'use client';

import type { SaasEmployee, SaasDepartment } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, UserCircle, Building } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface EmployeeTableProps {
  employees: SaasEmployee[];
  departments: SaasDepartment[];
  onEdit: (employee: SaasEmployee) => void;
  onDelete: (employeeId: string) => void;
}

export function EmployeeTable({ employees, departments, onEdit, onDelete }: EmployeeTableProps) {

  const getDepartmentName = (departmentId?: string | null) => {
    if (!departmentId) return '未分配';
    const dept = departments.find(d => d.id === departmentId);
    return dept ? dept.name : '未知部门';
  };

  const getStatusChip = (status: SaasEmployee['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">已激活</span>;
      case 'invited':
        return <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">已邀请</span>;
      case 'disabled':
        return <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">已禁用</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">{status}</span>;
    }
  };

  if (employees.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">此企业暂无员工数据。请添加新员工。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead>邮箱</TableHead>
            <TableHead>电话</TableHead>
            <TableHead>部门</TableHead>
            <TableHead>职位</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>入职日期</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.phone || '-'}</TableCell>
              <TableCell>
                <span className="inline-flex items-center">
                  {employee.departmentId && <Building className="h-3.5 w-3.5 mr-1 text-muted-foreground"/>}
                  {getDepartmentName(employee.departmentId)}
                </span>
              </TableCell>
              <TableCell>{employee.roleTitle || '-'}</TableCell>
              <TableCell>{getStatusChip(employee.status)}</TableCell>
              <TableCell>{format(parseISO(employee.joinDate), 'yyyy-MM-dd')}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                       <span className="sr-only">操作</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(employee)}>
                      <Edit className="mr-2 h-4 w-4" />编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(employee.id)} className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {employees.length > 5 && (
            <TableCaption>共 {employees.length} 条员工记录。</TableCaption>
        )}
      </Table>
    </div>
  );
}
