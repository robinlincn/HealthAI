
'use client';

import type { SaasSystemRole } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, ShieldCheck, List } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RoleTableProps {
  roles: SaasSystemRole[];
  onEdit: (role: SaasSystemRole) => void;
  onDelete: (roleId: string) => void;
}

export function RoleTable({ roles, onEdit, onDelete }: RoleTableProps) {

  if (roles.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">暂无系统角色。请添加新角色。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>角色名称</TableHead>
            <TableHead>描述</TableHead>
            <TableHead>权限数量</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">
                <span className="inline-flex items-center">
                  <ShieldCheck className="h-4 w-4 mr-2 text-primary"/>
                  {role.name}
                </span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground truncate max-w-md">{role.description || '-'}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  <List className="h-3 w-3 mr-1" /> {role.permissions.length} 项
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                       <span className="sr-only">操作</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(role)}>
                      <Edit className="mr-2 h-4 w-4" />编辑角色/权限
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(role.id)} className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />删除角色
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {roles.length > 5 && (
            <TableCaption>共 {roles.length} 个系统角色。</TableCaption>
        )}
      </Table>
    </div>
  );
}
