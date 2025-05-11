
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SaasOutboundCallTask } from '@/lib/types';
import { Send, PlusCircle, Search, Filter, CalendarDays, Users, Bot } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import type { DateRange } from 'react-day-picker';
import { OutboundCallTaskTable } from './components/OutboundCallTaskTable';
import { OutboundCallTaskDialog } from './components/OutboundCallTaskDialog';
import { subDays, format } from 'date-fns';

const mockInitialTasks: SaasOutboundCallTask[] = [
  { id: 'task-001', name: '季度健康回访', targetType: 'customer_segment', targetDetails: '高血压风险人群', status: 'scheduled', creationDate: subDays(new Date(), 10).toISOString(), scheduledTime: new Date().toISOString(), callCount: 50, successCount: 35 },
  { id: 'task-002', name: '新服务推广', targetType: 'custom_list', targetDetails: 'VIP客户列表', status: 'in_progress', creationDate: subDays(new Date(), 5).toISOString(), assignedTo: 'emp-001a', callCount: 20, successCount: 8 },
  { id: 'task-003', name: '用药提醒确认', targetType: 'individual_patient', targetDetails: 'pat-saas-001', status: 'completed', creationDate: subDays(new Date(), 2).toISOString(), callCount:1, successCount:1, notes: '病人已确认按时服药'},
];

export default function OutboundCallTasksPage() {
  const [tasks, setTasks] = useState<SaasOutboundCallTask[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<SaasOutboundCallTask | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<SaasOutboundCallTask['status'] | "all">("all");
  const [filterType, setFilterType] = useState<SaasOutboundCallTask['targetType'] | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setTasks(mockInitialTasks);
  }, []);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: SaasOutboundCallTask) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('确定要删除此外呼任务吗？此操作不可撤销。')) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast({ title: '删除成功', description: '外呼任务已删除。' });
    }
  };

  const handleDialogSubmit = (data: SaasOutboundCallTask) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => (t.id === editingTask.id ? { ...t, ...data } : t)));
      toast({ title: '更新成功', description: `外呼任务 "${data.name}" 信息已更新。`});
    } else {
      const newTask = { ...data, id: `task-${Date.now().toString()}`, creationDate: new Date().toISOString() };
      setTasks(prev => [newTask, ...prev]);
      toast({ title: '创建成功', description: `新外呼任务 "${data.name}" 已添加。`});
    }
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const searchMatch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.targetDetails.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = filterStatus === "all" || task.status === filterStatus;
      const typeMatch = filterType === "all" || task.targetType === filterType;
      
      let dateMatch = true;
      if (dateRange?.from && task.creationDate) {
        dateMatch = new Date(task.creationDate) >= dateRange.from;
      }
      if (dateRange?.to && task.creationDate && dateMatch) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        dateMatch = new Date(task.creationDate) <= toDate;
      }
      return searchMatch && statusMatch && typeMatch && dateMatch;
    });
  }, [tasks, searchTerm, filterStatus, filterType, dateRange]);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>外呼任务</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载外呼任务数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Send className="h-6 w-6 text-primary" />
            外呼任务管理
          </CardTitle>
          <CardDescription>
            设置和管理自动或人工外呼任务，用于客户回访、业务推广、通知提醒等。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-grow">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="搜索任务名称、目标..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as SaasOutboundCallTask['status'] | "all")}>
                  <SelectTrigger><Filter className="mr-2 h-4 w-4"/>任务状态</SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">所有状态</SelectItem>
                      <SelectItem value="pending_schedule">待安排</SelectItem>
                      <SelectItem value="scheduled">已安排</SelectItem>
                      <SelectItem value="in_progress">进行中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="failed">失败</SelectItem>
                      <SelectItem value="cancelled">已取消</SelectItem>
                  </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={(value) => setFilterType(value as SaasOutboundCallTask['targetType'] | "all")}>
                  <SelectTrigger><Filter className="mr-2 h-4 w-4"/>目标类型</SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">所有类型</SelectItem>
                      <SelectItem value="customer_segment">客户分群</SelectItem>
                      <SelectItem value="employee_group">员工组</SelectItem>
                      <SelectItem value="custom_list">自定义列表</SelectItem>
                      <SelectItem value="individual_patient">单个病人</SelectItem>
                  </SelectContent>
              </Select>
              <div className="md:col-span-3">
                <DatePickerWithRange date={dateRange} onDateChange={setDateRange} className="w-full" />
              </div>
            </div>
            <Button onClick={handleAddTask} className="w-full sm:w-auto mt-2 md:mt-0">
                <PlusCircle className="mr-2 h-4 w-4" /> 新建外呼任务
            </Button>
          </div>
          
          <OutboundCallTaskTable 
            tasks={filteredTasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask} 
          />
        </CardContent>
      </Card>

      <OutboundCallTaskDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleDialogSubmit}
        task={editingTask}
      />
    </div>
  );
}
