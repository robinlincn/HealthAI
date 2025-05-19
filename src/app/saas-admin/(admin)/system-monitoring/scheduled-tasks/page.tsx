
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, PlusCircle, Search, Filter, Play, Pause, Edit, Trash2, CheckCircle, XCircle, AlertTriangle, ListChecks, Loader2 } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { format, parseISO, subDays, addMinutes } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ScheduledTask {
  id: string;
  name: string;
  type: 'data_backup' | 'report_generation' | 'notification_push' | 'system_cleanup';
  cronExpression: string;
  status: 'enabled' | 'disabled' | 'running' | 'error';
  lastRun?: string; 
  nextRun?: string; 
  description?: string;
}

const initialScheduledTasks: ScheduledTask[] = [
  { id: 'task-backup', name: '每日数据备份', type: 'data_backup', cronExpression: '0 2 * * *', status: 'enabled', lastRun: subDays(new Date(),1).toISOString(), nextRun: addMinutes(new Date(), 60 * 22).toISOString(), description: '备份所有SAAS平台数据到云存储。'},
  { id: 'task-report', name: '月度运营报告', type: 'report_generation', cronExpression: '0 3 1 * *', status: 'enabled', nextRun: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1, 3, 0, 0).toISOString(), description: '生成上个月的平台运营和客户使用报告。'},
  { id: 'task-notify', name: '服务到期提醒', type: 'notification_push', cronExpression: '0 9 * * 1-5', status: 'disabled', description: '每周工作日提醒即将到期的企业服务。'},
  { id: 'task-cleanup', name: '临时文件清理', type: 'system_cleanup', cronExpression: '0 0 * * 0', status: 'enabled', lastRun: subDays(new Date(), 7).toISOString(), nextRun: addMinutes(new Date(), 60*24*6).toISOString(), description: '每周日清理过期的临时文件和日志。'},
  { id: 'task-error-example', name: '错误任务示例', type: 'system_cleanup', cronExpression: '0 1 * * *', status: 'error', lastRun: subDays(new Date(),2).toISOString(), description: '演示一个出错的任务。'},
];

export default function ScheduledTasksPage() {
  const [tasks, setTasks] = useState<ScheduledTask[]>(initialScheduledTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | ScheduledTask['status']>('all');
  const [filterType, setFilterType] = useState<'all' | ScheduledTask['type']>('all');
  const [isLoadingAction, setIsLoadingAction] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleToggleStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: task.status === 'enabled' ? 'disabled' : (task.status === 'disabled' ? 'enabled' : task.status) } : task
    ));
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast({ title: "任务状态已更新", description: `任务 "${task.name}" 状态已切换。` });
    }
  };
  
  const handleRunNow = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        setIsLoadingAction(prev => ({...prev, [taskId]: true}));
        toast({ title: "任务执行中", description: `任务 "${task.name}" 已开始执行 (模拟)。`});
        setTimeout(() => { 
            const success = Math.random() > 0.2; 
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: success ? (t.status === 'running' ? 'enabled' : t.status) : 'error', lastRun: new Date().toISOString() } : t)); 
            setIsLoadingAction(prev => ({...prev, [taskId]: false}));
            toast({ title: "任务执行完成", description: `任务 "${task.name}" 执行${success ? '成功' : '失败'}。`});
        }, 3000);
    }
  };

  const getStatusBadge = (status: ScheduledTask['status']) => {
    switch(status) {
        case 'enabled': return <Badge className="bg-green-100 text-green-700 border-green-300"><CheckCircle className="h-3.5 w-3.5 mr-1"/>已启用</Badge>;
        case 'disabled': return <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-300"><XCircle className="h-3.5 w-3.5 mr-1"/>已禁用</Badge>;
        case 'running': return <Badge className="bg-blue-100 text-blue-700 border-blue-300 animate-pulse"><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin"/>运行中</Badge>;
        case 'error': return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-300"><AlertTriangle className="h-3.5 w-3.5 mr-1"/>错误</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTaskTypeLabel = (type: ScheduledTask['type']) => {
    const map = {
        'data_backup': '数据备份',
        'report_generation': '报告生成',
        'notification_push': '通知推送',
        'system_cleanup': '系统清理'
    };
    return map[type] || type;
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === 'all' || task.status === filterStatus) &&
      (filterType === 'all' || task.type === filterType)
    );
  }, [tasks, searchTerm, filterStatus, filterType]);

  if (!isClient) {
     return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle className="text-xl">定时任务管理</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载定时任务数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Clock className="h-6 w-6 text-primary" />
            定时任务管理
          </CardTitle>
          <CardDescription>
            管理和监控系统中的后台定时任务，如数据备份、报告生成、消息推送等。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="搜索任务名称..."
                    className="pl-8 sm:w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                <Select value={filterType} onValueChange={(value) => setFilterType(value as 'all' | ScheduledTask['type'])}>
                    <SelectTrigger className="w-full sm:w-[160px]">
                        <ListChecks className="mr-2 h-4 w-4"/>
                        <SelectValue placeholder="筛选类型" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">所有类型</SelectItem>
                        <SelectItem value="data_backup">数据备份</SelectItem>
                        <SelectItem value="report_generation">报告生成</SelectItem>
                        <SelectItem value="notification_push">通知推送</SelectItem>
                        <SelectItem value="system_cleanup">系统清理</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as 'all' | ScheduledTask['status'])}>
                    <SelectTrigger className="w-full sm:w-[160px]">
                        <Filter className="mr-2 h-4 w-4"/>
                        <SelectValue placeholder="筛选状态" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">所有状态</SelectItem>
                        <SelectItem value="enabled">已启用</SelectItem>
                        <SelectItem value="disabled">已禁用</SelectItem>
                        <SelectItem value="running">运行中</SelectItem>
                        <SelectItem value="error">错误</SelectItem>
                    </SelectContent>
                </Select>
                <Button disabled className="w-full sm:w-auto"><PlusCircle className="mr-2 h-4 w-4" /> 新建任务</Button>
            </div>
          </div>
          
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>任务名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>执行计划 (Cron)</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>上次运行</TableHead>
                  <TableHead>下次运行</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium" title={task.description || task.name}>{task.name}</TableCell>
                    <TableCell>{getTaskTypeLabel(task.type)}</TableCell>
                    <TableCell className="font-mono text-xs">{task.cronExpression}</TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell className="text-xs">{task.lastRun ? format(parseISO(task.lastRun), 'yyyy-MM-dd HH:mm') : '-'}</TableCell>
                    <TableCell className="text-xs">{task.nextRun ? format(parseISO(task.nextRun), 'yyyy-MM-dd HH:mm') : '-'}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleRunNow(task.id)} disabled={isLoadingAction[task.id] || task.status === 'disabled' || task.status === 'running'} className="h-7 px-2 text-xs">
                        {isLoadingAction[task.id] ? <Loader2 className="mr-1 h-3 w-3 animate-spin"/> : <Play className="mr-1 h-3 w-3" />}
                        {isLoadingAction[task.id] ? '执行中' : '立即执行'}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(task.id)} className={`${task.status === 'enabled' || task.status === 'running' ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'} h-7 px-2 text-xs`}>
                        {task.status === 'enabled' || task.status === 'running' ? <Pause className="mr-1 h-3 w-3"/> : <Play className="mr-1 h-3 w-3"/>}
                        {task.status === 'enabled' || task.status === 'running' ? '禁用' : '启用'}
                      </Button>
                       <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
                        <Edit className="h-4 w-4" /> <span className="sr-only">编辑</span>
                      </Button>
                       <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" disabled>
                        <Trash2 className="h-4 w-4" /> <span className="sr-only">删除</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
               {filteredTasks.length === 0 && (
                    <TableCaption>未找到匹配的定时任务。</TableCaption>
               )}
               {filteredTasks.length > 3 && (
                    <TableCaption>共 {filteredTasks.length} 条定时任务。</TableCaption>
               )}
            </Table>
          </div>
           <CardFooter className="pt-4 px-0">
                <p className="text-xs text-muted-foreground">任务编辑、删除和日志查看功能正在建设中。新建任务功能也待实现。</p>
           </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
