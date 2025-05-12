
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Users as UsersIcon, ListFilter } from "lucide-react";
import type { OutboundCallGroup, GroupOutboundCallTask, DoctorPatient } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { OutboundGroupFormDialog } from "./OutboundGroupFormDialog";
import { GroupCallTaskFormDialog } from "./GroupCallTaskFormDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


// Mock patient data
const mockPatients: DoctorPatient[] = [
  { id: "pat001", name: "张三", age: 45, gender: "男", diagnosis: "高血压", lastVisit: "2023-01-01" },
  { id: "pat002", name: "李四", age: 62, gender: "女", diagnosis: "糖尿病", lastVisit: "2023-01-05" },
  { id: "pat003", name: "王五", age: 50, gender: "男", diagnosis: "高血脂", lastVisit: "2023-01-10" },
  { id: "pat004", name: "赵六", age: 71, gender: "男", diagnosis: "高血压", lastVisit: "2023-01-12" },
];

const initialGroups: OutboundCallGroup[] = [
  { id: "grp-001", name: "高血压随访组", description: "定期随访高血压患者", patientIds: ["pat001", "pat004"], memberCount: 2, creationDate: new Date().toISOString() },
  { id: "grp-002", name: "糖尿病教育组", description: "发送糖尿病教育材料和提醒", patientIds: ["pat002"], memberCount: 1, creationDate: new Date().toISOString() },
];

const initialGroupTasks: GroupOutboundCallTask[] = [
  { id: "gtsk-001", groupId: "grp-001", groupName: "高血压随访组", content: "提醒测量血压并上传数据。", scheduledTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), callAttempts: 0, maxCallAttempts: 1, recurrence: "weekly", wechatInfo: "高血压健康群", status: "scheduled", creationDate: new Date().toISOString() },
];

export function OutboundGroupTab() {
  const [groups, setGroups] = useState<OutboundCallGroup[]>(initialGroups);
  const [groupTasks, setGroupTasks] = useState<GroupOutboundCallTask[]>(initialGroupTasks);
  
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<OutboundCallGroup | null>(null);
  
  const [isGroupTaskFormOpen, setIsGroupTaskFormOpen] = useState(false);
  const [editingGroupTask, setEditingGroupTask] = useState<GroupOutboundCallTask | null>(null);
  const [selectedGroupIdForNewTask, setSelectedGroupIdForNewTask] = useState<string | null>(null);

  const { toast } = useToast();

  // Group Management Handlers
  const handleAddNewGroup = () => {
    setEditingGroup(null);
    setIsGroupFormOpen(true);
  };

  const handleEditGroup = (group: OutboundCallGroup) => {
    setEditingGroup(group);
    setIsGroupFormOpen(true);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm("确定要删除此外呼组吗？组内相关的外呼任务也将被取消。")) {
      setGroups(prev => prev.filter(g => g.id !== groupId));
      setGroupTasks(prev => prev.filter(gt => gt.groupId !== groupId)); // Also remove tasks associated with this group
      toast({ title: "外呼组已删除", description: "外呼组及其关联任务已成功删除。" });
    }
  };

  const handleSaveGroup = (groupData: Omit<OutboundCallGroup, 'id' | 'creationDate' | 'memberCount'> & { id?: string }) => {
    if (editingGroup) {
      setGroups(prev => prev.map(g => g.id === editingGroup.id ? { ...editingGroup, ...groupData, id: editingGroup.id, memberCount: groupData.patientIds.length } : g));
      toast({ title: "外呼组已更新", description: `外呼组 "${groupData.name}" 已更新。` });
    } else {
      const newGroup: OutboundCallGroup = {
        ...groupData,
        id: `grp-${Date.now().toString()}`,
        creationDate: new Date().toISOString(),
        memberCount: groupData.patientIds.length,
      };
      setGroups(prev => [newGroup, ...prev]);
      toast({ title: "外呼组已创建", description: `新外呼组 "${groupData.name}" 已创建。` });
    }
    setIsGroupFormOpen(false);
    setEditingGroup(null);
  };

  // Group Task Management Handlers
  const handleAddNewGroupTask = (groupId?: string) => {
    if(groupId) setSelectedGroupIdForNewTask(groupId);
    else setSelectedGroupIdForNewTask(null); // For general new task if no group preselected
    setEditingGroupTask(null);
    setIsGroupTaskFormOpen(true);
  };

  const handleEditGroupTask = (task: GroupOutboundCallTask) => {
    setEditingGroupTask(task);
    setIsGroupTaskFormOpen(true);
  };

  const handleDeleteGroupTask = (taskId: string) => {
     if (window.confirm("确定要删除此组外呼任务吗？")) {
      setGroupTasks(prev => prev.filter(t => t.id !== taskId));
      toast({ title: "组任务已删除" });
    }
  };

  const handleSaveGroupTask = (taskData: Omit<GroupOutboundCallTask, 'id' | 'creationDate' | 'groupName' | 'callAttempts'> & { id?: string; groupName: string; callAttempts?:number; status?: GroupOutboundCallTask['status'] }) => {
    if (editingGroupTask) {
      setGroupTasks(prev => prev.map(t => t.id === editingGroupTask.id ? { ...editingGroupTask, ...taskData, id: editingGroupTask.id, status: taskData.status || editingGroupTask.status  } : t));
      toast({ title: "组任务已更新" });
    } else {
      const newTask: GroupOutboundCallTask = {
        ...taskData,
        id: `gtsk-${Date.now().toString()}`,
        creationDate: new Date().toISOString(),
        status: taskData.status || 'pending',
        callAttempts: 0,
      };
      setGroupTasks(prev => [newTask, ...prev]);
      toast({ title: "组任务已创建" });
    }
    setIsGroupTaskFormOpen(false);
    setEditingGroupTask(null);
    setSelectedGroupIdForNewTask(null);
  };

  const getStatusBadge = (status: GroupOutboundCallTask['status']) => {
    // (Same as in SinglePatientOutboundTab)
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
    <div className="grid md:grid-cols-2 gap-6">
      {/* Group Management Section */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-xl">外呼组管理</CardTitle>
            <CardDescription>创建和管理病人组。</CardDescription>
          </div>
          <Button onClick={handleAddNewGroup} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> 新建组
          </Button>
        </CardHeader>
        <CardContent>
          {groups.length > 0 ? (
            <ScrollArea className="h-[250px] md:h-[300px]">
              <Table>
                <TableHeader><TableRow><TableHead>组名</TableHead><TableHead>成员数</TableHead><TableHead className="text-right">操作</TableHead></TableRow></TableHeader>
                <TableBody>
                  {groups.map(group => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">{group.name}</TableCell>
                      <TableCell>{group.memberCount}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="xs" onClick={() => handleAddNewGroupTask(group.id)} className="mr-1 text-xs h-7">新建任务</Button>
                        <Button variant="ghost" size="xs" onClick={() => handleEditGroup(group)} className="mr-1 text-xs h-7"><Edit className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="xs" onClick={() => handleDeleteGroup(group.id)} className="text-destructive hover:text-destructive text-xs h-7"><Trash2 className="h-3 w-3" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <p className="text-center text-muted-foreground py-4">暂无外呼组。</p>
          )}
        </CardContent>
      </Card>

      {/* Group Task Management Section */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
           <div>
            <CardTitle className="text-xl">组外呼任务列表</CardTitle>
            <CardDescription>为外呼组安排任务。</CardDescription>
          </div>
           <Button onClick={() => handleAddNewGroupTask()} size="sm" variant="outline" disabled={groups.length === 0}>
            <PlusCircle className="mr-2 h-4 w-4" /> {groups.length === 0 ? '先建组再建任务' : '新建组任务'}
          </Button>
        </CardHeader>
        <CardContent>
          {groupTasks.length > 0 ? (
             <ScrollArea className="h-[250px] md:h-[300px]">
              <Table>
                <TableHeader><TableRow><TableHead>组名</TableHead><TableHead>计划时间</TableHead><TableHead>状态</TableHead><TableHead className="text-right">操作</TableHead></TableRow></TableHeader>
                <TableBody>
                  {groupTasks.map(task => (
                    <TableRow key={task.id}>
                      <TableCell>{task.groupName}</TableCell>
                      <TableCell>{format(parseISO(task.scheduledTime), "yyyy-MM-dd HH:mm")}</TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="xs" onClick={() => handleEditGroupTask(task)} className="mr-1 text-xs h-7"><Edit className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="xs" onClick={() => handleDeleteGroupTask(task.id)} className="text-destructive hover:text-destructive text-xs h-7"><Trash2 className="h-3 w-3" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <p className="text-center text-muted-foreground py-4">暂无组外呼任务。</p>
          )}
        </CardContent>
      </Card>

      <OutboundGroupFormDialog
        isOpen={isGroupFormOpen}
        onClose={() => { setIsGroupFormOpen(false); setEditingGroup(null); }}
        onSave={handleSaveGroup}
        group={editingGroup}
        allPatients={mockPatients}
      />
      
      <GroupCallTaskFormDialog
        isOpen={isGroupTaskFormOpen}
        onClose={() => { setIsGroupTaskFormOpen(false); setEditingGroupTask(null); setSelectedGroupIdForNewTask(null); }}
        onSave={handleSaveGroupTask}
        task={editingGroupTask}
        groups={groups}
        preselectedGroupId={selectedGroupIdForNewTask}
      />
    </div>
  );
}
