
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import type { SingleOutboundCallTask, DoctorPatient } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { SinglePatientTaskFormDialog } from "./SinglePatientTaskFormDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Mock patient data (reuse or adapt from existing mock data)
const mockPatients: DoctorPatient[] = [
  { id: "pat001", name: "张三", age: 45, gender: "男", diagnosis: "高血压", lastVisit: "2023-01-01" },
  { id: "pat002", name: "李四", age: 62, gender: "女", diagnosis: "糖尿病", lastVisit: "2023-01-05" },
  { id: "pat003", name: "王五", age: 50, gender: "男", diagnosis: "高血脂", lastVisit: "2023-01-10" },
];

const initialSingleTasks: SingleOutboundCallTask[] = [
  { id: "sot-001", patientId: "pat001", patientName: "张三", content: "提醒复诊，时间本周五下午3点。", scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), callAttempts: 0, maxCallAttempts: 3, recurrence: "none", wechatInfo: "张三微信", status: "scheduled", creationDate: new Date().toISOString() },
  { id: "sot-002", patientId: "pat002", patientName: "李四", content: "询问近期血糖情况，并提醒饮食注意事项。", scheduledTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), callAttempts: 1, maxCallAttempts: 2, recurrence: "none", wechatInfo: "李四家属群", status: "in_progress", creationDate: new Date().toISOString(), lastAttemptTime: new Date().toISOString() },
];

export function SinglePatientOutboundTab() {
  const [tasks, setTasks] = useState<SingleOutboundCallTask[]>(initialSingleTasks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<SingleOutboundCallTask | null>(null);
  const { toast } = useToast();

  const handleAddNewTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: SingleOutboundCallTask) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm("确定要删除此单人外呼任务吗？")) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast({ title: "任务已删除", description: "单人外呼任务已成功删除。" });
    }
  };

  const handleSaveTask = (taskData: Omit<SingleOutboundCallTask, 'id' | 'creationDate' | 'status' | 'callAttempts'> & { id?: string; status?: SingleOutboundCallTask['status']; callAttempts?: number }) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...editingTask, ...taskData, id: editingTask.id, status: taskData.status || editingTask.status } : t));
      toast({ title: "任务已更新", description: `针对患者 ${taskData.patientName} 的外呼任务已更新。` });
    } else {
      const newTask: SingleOutboundCallTask = {
        ...taskData,
        id: `sot-${Date.now().toString()}`,
        creationDate: new Date().toISOString(),
        status: taskData.status || 'pending',
        callAttempts: 0,
      };
      setTasks(prev => [newTask, ...prev]);
      toast({ title: "任务已创建", description: `针对患者 ${taskData.patientName} 的新外呼任务已创建。` });
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };
  
  const getStatusBadge = (status: SingleOutboundCallTask['status']) => {
    switch (status) {
      case 'pending': return <Badge variant="outline">待处理</Badge>;
      case 'scheduled': return <Badge variant="secondary">已安排</Badge>;
      case 'in_progress': return <Badge className="bg-blue-500 hover:bg-blue-600">进行中</Badge>;
      case 'completed': return <Badge className="bg-green-500 hover:bg-green-600">已完成</Badge>;
      case 'failed': return <Badge variant="destructive">失败</Badge>;
      case 'cancelled': return <Badge variant="outline" className="text-gray-500 border-gray-400">已取消</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-xl">单个病人外呼任务</CardTitle>
          <CardDescription>为特定病人制定外呼任务。</CardDescription>
        </div>
        <Button onClick={handleAddNewTask}>
          <PlusCircle className="mr-2 h-4 w-4" /> 新建单人任务
        </Button>
      </CardHeader>
      <CardContent>
        {tasks.length > 0 ? (
          <ScrollArea className="h-[400px] md:h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>病人姓名</TableHead>
                  <TableHead>计划时间</TableHead>
                  <TableHead>内容摘要</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>微信通知</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map(task => (
                  <TableRow key={task.id}>
                    <TableCell>{task.patientName}</TableCell>
                    <TableCell>{format(parseISO(task.scheduledTime), "yyyy-MM-dd HH:mm")}</TableCell>
                    <TableCell className="max-w-xs truncate" title={task.content}>{task.content}</TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell>{task.wechatInfo}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTask(task)} className="mr-1">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {tasks.length > 5 && <TableCaption>共 {tasks.length} 条单人外呼任务。</TableCaption>}
            </Table>
          </ScrollArea>
        ) : (
          <p className="text-center text-muted-foreground py-4">暂无单个病人外呼任务。</p>
        )}
      </CardContent>

      <SinglePatientTaskFormDialog
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        task={editingTask}
        patients={mockPatients}
      />
    </Card>
  );
}
