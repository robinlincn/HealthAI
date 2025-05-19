
'use client';

import type { SaasOutboundCallTask, SaasEnterprise, SaasEmployee } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, PlayCircle, CheckCircle, XCircle, AlertTriangle, Clock, Users, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

interface OutboundCallTaskTableProps {
  tasks: SaasOutboundCallTask[];
  enterprises: SaasEnterprise[];
  employees: SaasEmployee[];
  onEdit: (task: SaasOutboundCallTask) => void;
  onDelete: (taskId: string) => void;
  onChangeStatus?: (taskId: string, newStatus: SaasOutboundCallTask['status']) => void;
}

export function OutboundCallTaskTable({ tasks, enterprises, employees, onEdit, onDelete, onChangeStatus }: OutboundCallTaskTableProps) {

  const getStatusBadge = (status: SaasOutboundCallTask['status']) => {
    switch (status) {
      case 'pending_schedule': return <Badge variant="outline"><Clock className="h-3 w-3 mr-1"/>待安排</Badge>;
      case 'scheduled': return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1"/>已安排</Badge>;
      case 'in_progress': return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600"><PlayCircle className="h-3 w-3 mr-1"/>进行中</Badge>;
      case 'completed': return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1"/>已完成</Badge>;
      case 'failed': return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1"/>失败</Badge>;
      case 'cancelled': return <Badge variant="outline" className="text-gray-500 border-gray-400"><XCircle className="h-3 w-3 mr-1"/>已取消</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getTargetTypeText = (type: SaasOutboundCallTask['targetType']) => {
    const map = {
      customer_segment: '客户分群',
      employee_group: '员工组',
      custom_list: '自定义列表',
      individual_patient: '单个病人',
      patient_group: '病人组'
    };
    return map[type] || type;
  };

  const getEnterpriseName = (enterpriseId?: string) => {
    if (!enterpriseId) return '平台级';
    return enterprises.find(e => e.id === enterpriseId)?.name || '未知企业';
  };
  
  const getEmployeeName = (employeeId?: string) => {
    if (!employeeId) return '系统/自动';
    return employees.find(e => e.id === employeeId)?.name || '未知员工';
  };


  if (tasks.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">暂无外呼任务数据。请添加新任务。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>任务名称</TableHead>
            <TableHead>所属企业</TableHead>
            <TableHead>目标类型</TableHead>
            <TableHead>目标</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>计划时间</TableHead>
            <TableHead>分配给/创建者</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.name}</TableCell>
              <TableCell>{getEnterpriseName(task.enterpriseId)}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {task.targetType === 'individual_patient' && <User className="h-3 w-3 mr-1"/>}
                  {task.targetType === 'patient_group' && <Users className="h-3 w-3 mr-1"/>}
                  {getTargetTypeText(task.targetType)}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[150px] truncate text-xs" title={task.targetDescription || task.targetDetails}>
                {task.targetDescription || task.targetDetails}
              </TableCell>
              <TableCell>{getStatusBadge(task.status)}</TableCell>
              <TableCell className="text-xs">{task.scheduledTime ? format(parseISO(task.scheduledTime), 'yy-MM-dd HH:mm') : '-'}</TableCell>
              <TableCell className="text-xs">
                {task.assignedToEmployeeId ? `分配: ${getEmployeeName(task.assignedToEmployeeId)}` : 
                 task.creatingDoctorId ? `医生: ${getEmployeeName(task.creatingDoctorId)}` :
                 task.creatingSaasAdminId ? `SAAS管理员: ${getEmployeeName(task.creatingSaasAdminId)}` : '系统'}
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
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <Edit className="mr-2 h-4 w-4" />编辑任务
                    </DropdownMenuItem>
                    {onChangeStatus && task.status !== 'completed' && task.status !== 'cancelled' && (
                        <DropdownMenuItem onClick={() => onChangeStatus(task.id, 'cancelled')}>
                            <XCircle className="mr-2 h-4 w-4 text-orange-600"/>取消任务
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />删除任务
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {tasks.length > 5 && (
            <TableCaption>共 {tasks.length} 条外呼任务记录。</TableCaption>
        )}
      </Table>
    </div>
  );
}

