
'use client';

import type { SaasOutboundCallTask } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, PlayCircle, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

interface OutboundCallTaskTableProps {
  tasks: SaasOutboundCallTask[];
  onEdit: (task: SaasOutboundCallTask) => void;
  onDelete: (taskId: string) => void;
  // onStartTask?: (taskId: string) => void; // Future action
}

export function OutboundCallTaskTable({ tasks, onEdit, onDelete }: OutboundCallTaskTableProps) {

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
      individual_patient: '单个病人'
    };
    return map[type] || type;
  }

  if (tasks.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">暂无外呼任务数据。请添加新任务。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>任务名称</TableHead>
            <TableHead>目标类型</TableHead>
            <TableHead>目标详情</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>计划时间</TableHead>
            <TableHead>创建日期</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.name}</TableCell>
              <TableCell>{getTargetTypeText(task.targetType)}</TableCell>
              <TableCell className="max-w-xs truncate" title={task.targetDetails}>{task.targetDetails}</TableCell>
              <TableCell>{getStatusBadge(task.status)}</TableCell>
              <TableCell>{task.scheduledTime ? format(parseISO(task.scheduledTime), 'yyyy-MM-dd HH:mm') : '-'}</TableCell>
              <TableCell>{format(parseISO(task.creationDate), 'yyyy-MM-dd')}</TableCell>
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
                    {/* Add other actions like start task, view results etc. */}
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

