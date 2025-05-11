
'use client';

import type { SaasDepartment, SaasEmployee } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, UserCircle } from 'lucide-react';
import { format } from 'date-fns';

interface DepartmentTableProps {
  departments: SaasDepartment[];
  employees: SaasEmployee[]; // To display head employee name
  onEdit: (department: SaasDepartment) => void;
  onDelete: (departmentId: string) => void;
}

export function DepartmentTable({ departments, employees, onEdit, onDelete }: DepartmentTableProps) {

  const getEmployeeName = (employeeId?: string | null) => {
    if (!employeeId) return '未指定';
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : '未知员工';
  };
  
  const getParentDepartmentName = (parentId?: string | null) => {
    if (!parentId) return '顶级部门';
    const parentDept = departments.find(dept => dept.id === parentId);
    return parentDept ? parentDept.name : '未知上级';
  };

  if (departments.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">此企业暂无部门数据。请添加新部门。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>部门名称</TableHead>
            <TableHead>上级部门</TableHead>
            <TableHead>负责人</TableHead>
            <TableHead>创建日期</TableHead>
            <TableHead>描述</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((department) => (
            <TableRow key={department.id}>
              <TableCell className="font-medium">{department.name}</TableCell>
              <TableCell>{getParentDepartmentName(department.parentDepartmentId)}</TableCell>
              <TableCell>
                <span className="inline-flex items-center">
                  {department.headEmployeeId && <UserCircle className="h-4 w-4 mr-1 text-muted-foreground"/>}
                  {getEmployeeName(department.headEmployeeId)}
                </span>
                </TableCell>
              <TableCell>{format(new Date(department.creationDate), 'yyyy-MM-dd')}</TableCell>
              <TableCell className="truncate max-w-xs">{department.description || '-'}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                       <span className="sr-only">操作</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(department)}>
                      <Edit className="mr-2 h-4 w-4" />编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(department.id)} className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {departments.length > 5 && (
            <TableCaption>共 {departments.length} 条部门记录。</TableCaption>
        )}
      </Table>
    </div>
  );
}
