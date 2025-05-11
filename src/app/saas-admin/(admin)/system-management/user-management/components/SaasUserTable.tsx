
'use client';

import type { SaasSystemUser, SaasSystemRole } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, UserCircle, Shield, ToggleRight, ToggleLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface SaasUserTableProps {
  users: SaasSystemUser[];
  roles: SaasSystemRole[];
  onEdit: (user: SaasSystemUser) => void;
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string) => void;
}

export function SaasUserTable({ users, roles, onEdit, onDelete, onToggleStatus }: SaasUserTableProps) {

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : '未知角色';
  };

  const getStatusChip = (status: SaasSystemUser['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full inline-flex items-center"><ToggleRight className="h-3 w-3 mr-1"/>已激活</span>;
      case 'disabled':
        return <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full inline-flex items-center"><ToggleLeft className="h-3 w-3 mr-1"/>已禁用</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">{status}</span>;
    }
  };

  if (users.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">暂无SAAS管理员账户。请添加新管理员。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead>邮箱</TableHead>
            <TableHead>系统角色</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>上次登录</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span className="inline-flex items-center">
                  <Shield className="h-3.5 w-3.5 mr-1 text-muted-foreground"/>
                  {getRoleName(user.systemRoleId)}
                </span>
              </TableCell>
              <TableCell>{getStatusChip(user.status)}</TableCell>
              <TableCell>{user.lastLogin ? format(parseISO(user.lastLogin), 'yyyy-MM-dd HH:mm') : '从未登录'}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                       <span className="sr-only">操作</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Edit className="mr-2 h-4 w-4" />编辑
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onToggleStatus(user.id)}>
                       {user.status === 'active' ? <ToggleLeft className="mr-2 h-4 w-4" /> : <ToggleRight className="mr-2 h-4 w-4" />}
                        {user.status === 'active' ? '禁用' : '启用'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(user.id)} className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {users.length > 5 && (
            <TableCaption>共 {users.length} 条SAAS管理员记录。</TableCaption>
        )}
      </Table>
    </div>
  );
}
