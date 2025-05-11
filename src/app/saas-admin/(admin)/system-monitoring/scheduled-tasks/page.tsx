
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Clock, PlusCircle, Search, Filter, Play, Pause, Edit, Trash2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ScheduledTask {
  id: string;
  name: string;
  type: 'data_backup' | 'report_generation' | 'notification_push' | 'system_cleanup';
  cronExpression: string; // e.g., "0 2 * * *" (daily at 2 AM)
  status: 'enabled' | 'disabled' | 'running' | 'error';
  lastRun?: string; // ISO date string
  nextRun?: string; // ISO date string
  description?: string;
}

const mockScheduledTasks: ScheduledTask[] = [
  { id: 'task-backup', name: '每日数据备份', type: 'data_backup', cronExpression: '0 2 * * *', status: 'enabled', lastRun: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), nextRun: new Date(Date.now() + 1000 * 60 * 60 * 1).toISOString(), description: '备份所有SAAS平台数据到云存储。'},
  { id: 'task-report', name: '月度运营报告', type: 'report_generation', cronExpression: '0 3 1 * *', status: 'enabled', nextRun: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1, 3, 0, 0).toISOString(), description: '生成上个月的平台运营和客户使用报告。'},
  { id: 'task-notify', name: '服务到期提醒', type: 'notification_push', cronExpression: '0 9 * * 1-5', status: 'disabled', description: '每周工作日提醒即将到期的企业服务。'},
  { id: 'task-cleanup', name: '临时文件清理', type: 'system_cleanup', cronExpression: '0 0 * * 0', status: 'running', lastRun: new Date(Date.now() - 1000*60*5).toISOString(), description: '每周日清理过期的临时文件和日志。'},
];

export default function ScheduledTasksPage() {
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | ScheduledTask['status']>('all');
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setTasks(mockScheduledTasks);
  }, []);

  const handleToggleStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: task.status === 'enabled' ? 'disabled' : 'enabled' } : task
    ));
    toast({ title: "任务状态已更新" });
  };
  
  const handleRunNow = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'running', lastRun: new Date().toISOString() } : t));
        toast({ title: "任务执行中", description: `任务 "${task.name}" 已开始执行 (模拟)。`});
        setTimeout(() => { // Simulate task completion
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'enabled' } : t)); // Reset to enabled or show actual result
            toast({ title: "任务执行完成", description: `任务 "${task.name}" 执行完毕。`});
        }, 3000);
    }
  };

  const getStatusBadge = (status: ScheduledTask['status']) => {
    switch(status) {
        case 'enabled': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3.5 w-3.5 mr-1"/>已启用</Badge>;
        case 'disabled': return <Badge variant="secondary"><XCircle className="h-3.5 w-3.5 mr-1"/>已禁用</Badge>;
        case 'running': return <Badge className="bg-blue-500 text-white hover:bg-blue-600 animate-pulse"><Play className="h-3.5 w-3.5 mr-1"/>运行中</Badge>;
        case 'error': return <Badge variant="destructive"><AlertTriangle className="h-3.5 w-3.5 mr-1"/>错误</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === 'all' || task.status === filterStatus)
    );
  }, [tasks, searchTerm, filterStatus]);

  if (!isClient) {
     return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>定时任务管理</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载定时任务数据...</p></CardContent></Card>
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
            <div className="flex gap-2 w-full sm:w-auto">
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
                <Button disabled className="w-full sm:w-auto"><PlusCircle className="mr-2 h-4 w-4" /> 新建任务 (开发中)</Button>
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
                    <TableCell className="font-medium">{task.name}</TableCell>
                    <TableCell>{task.type}</TableCell>
                    <TableCell className="font-mono text-xs">{task.cronExpression}</TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell>{task.lastRun ? format(parseISO(task.lastRun), 'yyyy-MM-dd HH:mm') : '-'}</TableCell>
                    <TableCell>{task.nextRun ? format(parseISO(task.nextRun), 'yyyy-MM-dd HH:mm') : '-'}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleRunNow(task.id)} disabled={task.status === 'running' || task.status === 'disabled'}>
                          <Play className="mr-1 h-3 w-3" /> 立即执行
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(task.id)} className={task.status === 'enabled' || task.status === 'running' ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}>
                        {task.status === 'enabled' || task.status === 'running' ? <Pause className="mr-1 h-3 w-3"/> : <Play className="mr-1 h-3 w-3"/>}
                        {task.status === 'enabled' || task.status === 'running' ? '禁用' : '启用'}
                      </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                        <Edit className="h-4 w-4" /> <span className="sr-only">编辑</span>
                      </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" disabled>
                        <Trash2 className="h-4 w-4" /> <span className="sr-only">删除</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
               {filteredTasks.length === 0 && (
                    <TableCaption>未找到匹配的定时任务。</TableCaption>
               )}
            </Table>
          </div>
           <CardFooter className="pt-4">
                <p className="text-xs text-muted-foreground">任务编辑、删除和日志查看功能正在建设中。</p>
           </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}

