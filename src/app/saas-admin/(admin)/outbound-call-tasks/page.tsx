
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SaasOutboundCallTask, SaasEnterprise, SaasEmployee, OutboundCallGroup, SaasPatient, SaasSopService } from '@/lib/types';
import { Send, PlusCircle, Search, Filter, CalendarDays, Users, Bot, Briefcase } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import type { DateRange } from 'react-day-picker';
import { OutboundCallTaskTable } from './components/OutboundCallTaskTable';
import { OutboundCallTaskDialog } from './components/OutboundCallTaskDialog';
import { subDays, format, parseISO } from 'date-fns';
import { Label } from '@/components/ui/label';

const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
];
const mockEmployees: SaasEmployee[] = [
  { id: 'emp-001a', enterpriseId: 'ent-001', name: '王明医生', email: 'wm@hospitala.com', status: 'active', joinDate: new Date().toISOString(), creationDate: new Date().toISOString() },
  { id: 'emp-002b', enterpriseId: 'ent-002', name: '李芳护士', email: 'lf@healthb.com', status: 'active', joinDate: new Date().toISOString(), creationDate: new Date().toISOString() },
  { id: 'saas-admin-01', name: 'SAAS平台管理员A', email: 'admin@saas.com', enterpriseId: '', status: 'active', joinDate: new Date().toISOString(), creationDate: new Date().toISOString() }, 
];
const mockPatients: SaasPatient[] = [
  { id: 'pat-saas-001', enterpriseId: 'ent-001', name: '刘备', gender: 'male', dob: '1961-07-23', primaryDisease: '高血压', contactPhone: '13012340001' },
  { id: 'pat-saas-002', enterpriseId: 'ent-001', name: '关羽', gender: 'male', dob: '1960-08-12', primaryDisease: '2型糖尿病', contactPhone: '13012340002' },
  { id: 'pat-saas-003', enterpriseId: 'ent-002', name: '孙尚香', gender: 'female', dob: '1987-03-15', primaryDisease: '哮喘', contactPhone: '13012340003' },
];
const mockGroups: OutboundCallGroup[] = [
  { id: 'grp-hbp-001', enterpriseId: 'ent-001', name: '高血压随访组A院', patientIds: ['pat-saas-001'], memberCount: 1, creationDate: new Date().toISOString(), createdByUserId: 'emp-001a' },
  { id: 'grp-dm-001', enterpriseId: 'ent-001', name: '糖尿病教育组A院', patientIds: ['pat-saas-002'], memberCount: 1, creationDate: new Date().toISOString(), createdByUserId: 'emp-001a' },
  { id: 'grp-asthma-002', enterpriseId: 'ent-002', name: '哮喘关怀组B中心', patientIds: ['pat-saas-003'], memberCount: 1, creationDate: new Date().toISOString(), createdByUserId: 'emp-002b' },
];
const mockSopServices: SaasSopService[] = [
    {id: 'sop-coze-001', name: '智能健康问答Bot (Coze)', type: 'Coze', apiEndpoint: 'coze_endpoint', status: 'active', creationDate: new Date().toISOString()},
    {id: 'sop-dify-001', name: '用药提醒工作流 (Dify)', type: 'Dify', apiEndpoint: 'dify_endpoint', status: 'active', creationDate: new Date().toISOString()},
];


const mockInitialTasks: SaasOutboundCallTask[] = [
  { id: 'task-saas-001', name: '季度健康回访 (医院A高血压病人)', enterpriseId: 'ent-001', creatingDoctorId: 'emp-001a', targetType: 'patient_group', targetGroupId: 'grp-hbp-001', targetDescription: '高血压随访组A院', status: 'scheduled', creationDate: subDays(new Date(), 10).toISOString(), scheduledTime: new Date().toISOString(), callCountTotal: 50, callCountSuccess: 35 },
  { id: 'task-saas-002', name: '新服务推广 (平台级)', targetType: 'custom_list', targetDetails: 'VIP客户列表 (平台)', targetDescription: '平台VIP客户', status: 'in_progress', creationDate: subDays(new Date(), 5).toISOString(), assignedToEmployeeId: 'saas-admin-01', callCountTotal: 20, callCountSuccess: 8 },
  { id: 'task-saas-003', name: '用药提醒 (关羽)', enterpriseId: 'ent-001', creatingDoctorId: 'emp-001a', targetType: 'individual_patient', targetPatientId: 'pat-saas-002', targetDescription: '关羽', status: 'completed', creationDate: subDays(new Date(), 2).toISOString(), callCountTotal:1, callCountSuccess:1, notes: '病人已确认按时服药', callContentSummary: '提醒关羽按时服用降糖药，并询问有无不适。'},
];

export default function OutboundCallTasksPage() {
  const [tasks, setTasks] = useState<SaasOutboundCallTask[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<SaasOutboundCallTask | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEnterprise, setFilterEnterprise] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<SaasOutboundCallTask['status'] | "all">("all");
  const [filterTargetType, setFilterTargetType] = useState<SaasOutboundCallTask['targetType'] | "all">("all");
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
      setTasks(prev => prev.map(t => (t.id === editingTask.id ? data : t)));
      toast({ title: '更新成功', description: `外呼任务 "${data.name}" 信息已更新。`});
    } else {
      setTasks(prev => [data, ...prev]);
      toast({ title: '创建成功', description: `新外呼任务 "${data.name}" 已添加。`});
    }
    setIsDialogOpen(false);
    setEditingTask(null);
  };
  
  const handleChangeStatus = (taskId: string, newStatus: SaasOutboundCallTask['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    toast({ title: '状态更新', description: `任务 ${taskId} 状态已更新为 ${newStatus}`});
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const searchMatch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (task.targetDescription && task.targetDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (task.targetDetails && task.targetDetails.toLowerCase().includes(searchTerm.toLowerCase()));
      const enterpriseMatch = filterEnterprise === "all" || task.enterpriseId === filterEnterprise || (filterEnterprise === "platform_level" && !task.enterpriseId);
      const statusMatch = filterStatus === "all" || task.status === filterStatus;
      const typeMatch = filterTargetType === "all" || task.targetType === filterTargetType;
      
      let dateMatch = true;
      if (dateRange?.from && task.creationDate) {
        dateMatch = new Date(task.creationDate) >= dateRange.from;
      }
      if (dateRange?.to && task.creationDate && dateMatch) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        dateMatch = new Date(task.creationDate) <= toDate;
      }
      return searchMatch && enterpriseMatch && statusMatch && typeMatch && dateMatch;
    });
  }, [tasks, searchTerm, filterEnterprise, filterStatus, filterTargetType, dateRange]);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>外呼任务管理</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载外呼任务数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Send className="h-6 w-6 text-primary" />
            外呼任务管理 (SAAS平台)
          </CardTitle>
          <CardDescription>
            查看和管理由医生端或平台发起的各类外呼任务。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border p-4 rounded-md space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative lg:col-span-2">
                <Label htmlFor="taskSearch" className="sr-only">搜索任务</Label>
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id="taskSearch"
                    type="search"
                    placeholder="任务名称, 目标..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterEnterprise} onValueChange={setFilterEnterprise}>
                  <SelectTrigger><Briefcase className="mr-2 h-4 w-4"/>企业筛选</SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">所有企业</SelectItem>
                      <SelectItem value="platform_level">平台级任务</SelectItem>
                      {mockEnterprises.map(ent => (<SelectItem key={ent.id} value={ent.id}>{ent.name}</SelectItem>))}
                  </SelectContent>
              </Select>
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
              <Select value={filterTargetType} onValueChange={(value) => setFilterTargetType(value as SaasOutboundCallTask['targetType'] | "all")}>
                  <SelectTrigger><Users className="mr-2 h-4 w-4"/>目标类型</SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">所有目标类型</SelectItem>
                      <SelectItem value="individual_patient">单个病人</SelectItem>
                      <SelectItem value="patient_group">病人组</SelectItem>
                      <SelectItem value="custom_list">自定义列表</SelectItem>
                      <SelectItem value="employee_group">员工组</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:max-w-md"> {/* Date picker on its own row, with max-width */}
              <Label htmlFor="taskDateRange" className="block text-xs font-medium mb-1 text-muted-foreground">创建日期范围</Label>
              <DatePickerWithRange id="taskDateRange" date={dateRange} onDateChange={setDateRange} className="w-full" />
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleAddTask} className="shrink-0">
                  <PlusCircle className="mr-2 h-4 w-4" /> 新建平台任务
              </Button>
            </div>
          </div>
          
          <OutboundCallTaskTable 
            tasks={filteredTasks}
            enterprises={mockEnterprises}
            employees={mockEmployees}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask} 
            onChangeStatus={handleChangeStatus}
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
        enterprises={mockEnterprises}
        allEmployees={mockEmployees}
        allPatients={mockPatients}
        allGroups={mockGroups}
        allSopServices={mockSopServices}
      />
    </div>
  );
}

