
'use client';

import type { SaasCommunityGroup, SaasEnterprise, SaasEmployee } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, MessageCircle, Users, Briefcase, CheckCircle, XCircle, AlertTriangle, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

interface CommunityGroupTableProps {
  groups: SaasCommunityGroup[];
  enterprises: SaasEnterprise[];
  employees: SaasEmployee[];
  onEdit: (group: SaasCommunityGroup) => void;
  onDelete: (groupId: string) => void;
  onViewMembers?: (group: SaasCommunityGroup) => void; // Placeholder for future
  onViewLogs?: (groupId: string) => void; // Placeholder for future
  onSyncLogs?: (groupId: string) => void; // Placeholder for future
}

export function CommunityGroupTable({ groups, enterprises, employees, onEdit, onDelete, onViewMembers, onViewLogs, onSyncLogs }: CommunityGroupTableProps) {

  const getEnterpriseName = (enterpriseId: string) => {
    return enterprises.find(e => e.id === enterpriseId)?.name || 'N/A';
  };

  const getEmployeeName = (employeeId?: string) => {
    if (!employeeId) return '未分配';
    return employees.find(e => e.id === employeeId)?.name || '未知员工';
  };

  const getGroupTypeText = (type: SaasCommunityGroup['type']) => {
    const map = {
      personal_wechat_group: '个人微信群',
      enterprise_wechat_group: '企业微信群',
      other_platform_group: '其他平台群'
    };
    return map[type] || type;
  };
  
  const getConnectionStatusBadge = (status: SaasCommunityGroup['connectionStatus']) => {
    switch (status) {
      case 'active_sync': return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1"/>已同步</Badge>;
      case 'inactive_sync': return <Badge variant="outline"><XCircle className="h-3 w-3 mr-1"/>未同步</Badge>;
      case 'error_sync': return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1"/>同步错误</Badge>;
      case 'not_monitored': return <Badge variant="secondary">未监控</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };


  if (groups.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">暂无社群数据。请添加新社群。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>群名称</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>所属企业</TableHead>
            <TableHead>管理员工</TableHead>
            <TableHead>成员数</TableHead>
            <TableHead>连接状态</TableHead>
            <TableHead>上次同步</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.id}>
              <TableCell className="font-medium">
                <span className="inline-flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1.5 text-primary"/>
                  {group.name}
                </span>
              </TableCell>
              <TableCell>{getGroupTypeText(group.type)}</TableCell>
              <TableCell>
                <span className="inline-flex items-center text-xs">
                  <Briefcase className="h-3 w-3 mr-1 text-muted-foreground"/>
                  {getEnterpriseName(group.enterpriseId)}
                </span>
              </TableCell>
              <TableCell className="text-xs">{getEmployeeName(group.managingEmployeeId)}</TableCell>
              <TableCell className="text-center">
                <Badge variant="outline">
                  <Users className="h-3 w-3 mr-1"/>{group.patientCount || (group.memberPatientIds?.length || 0)}
                </Badge>
              </TableCell>
              <TableCell>{getConnectionStatusBadge(group.connectionStatus)}</TableCell>
              <TableCell className="text-xs">{group.lastLogSync ? format(parseISO(group.lastLogSync), 'yy-MM-dd HH:mm') : '-'}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                       <span className="sr-only">操作</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(group)}>
                      <Edit className="mr-2 h-4 w-4" />编辑信息
                    </DropdownMenuItem>
                    {onViewMembers && <DropdownMenuItem onClick={() => onViewMembers(group)} disabled>
                        <Users className="mr-2 h-4 w-4" />查看成员
                    </DropdownMenuItem>}
                    {onViewLogs && <DropdownMenuItem onClick={() => onViewLogs(group.id)} disabled>
                        <ListFilter className="mr-2 h-4 w-4" />查看日志
                    </DropdownMenuItem>}
                    {onSyncLogs && group.connectionStatus !== 'not_monitored' && 
                      <DropdownMenuItem onClick={() => onSyncLogs(group.id)}>
                        <RotateCcw className="mr-2 h-4 w-4" />立即同步
                    </DropdownMenuItem>}
                    <DropdownMenuItem onClick={() => onDelete(group.id)} className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />删除社群
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {groups.length > 5 && (
            <TableCaption>共 {groups.length} 条社群记录。</TableCaption>
        )}
      </Table>
    </div>
  );
}

