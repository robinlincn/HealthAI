
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Search, Filter, PlusCircle, ExternalLink, List, LogIn, CheckCircle, AlertTriangle, Briefcase, Users as UsersIcon, RotateCcw } from "lucide-react";
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range'; // Assuming this exists
import type { DateRange } from "react-day-picker";
import { useToast } from '@/hooks/use-toast'; 
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, subDays, parseISO } from 'date-fns';
import type { SaasCommunityGroup, SaasPlatformConnection, SaasEnterprise, SaasEmployee, SaasPatient, SaasCommunityMessageLog } from '@/lib/types';
import { CommunityGroupTable } from './components/CommunityGroupTable';
import { CommunityGroupDialog } from './components/CommunityGroupDialog';
import { Label } from '@/components/ui/label';


// Reusing mock enterprises, employees, patients from other pages, ensure consistency
const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三院长', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'13800000001', status: 'active', assignedResources: {maxUsers:10,maxStorageGB:10,maxPatients:100}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四主任', creationDate: new Date().toISOString(), contactEmail:'b@b.com', contactPhone:'13900000002', status: 'active', assignedResources: {maxUsers:10,maxStorageGB:10,maxPatients:100}},
];
const mockEmployees: SaasEmployee[] = [
    { id: 'emp-001a', enterpriseId: 'ent-001', departmentId: 'dept-001', name: '王明医生', email: 'wm@hospitala.com', status: 'active', joinDate: new Date().toISOString() },
    { id: 'emp-002a', enterpriseId: 'ent-001', departmentId: 'dept-002', name: '刘芳护士', email: 'lf@hospitala.com', status: 'active', joinDate: new Date().toISOString() },
    { id: 'emp-001b', enterpriseId: 'ent-002', departmentId: 'dept-003', name: '孙琳技师', email: 'sl@healthb.com', status: 'invited', joinDate: new Date().toISOString() },
];
const mockPatients: SaasPatient[] = [
  { id: 'pat-saas-001', enterpriseId: 'ent-001', name: '刘备', gender: 'male', dob: '1961-07-23', primaryDisease: '高血压', contactPhone: '13012340001' },
  { id: 'pat-saas-002', enterpriseId: 'ent-001', name: '关羽', gender: 'male', dob: '1960-08-12', primaryDisease: '2型糖尿病', contactPhone: '13012340002' },
  { id: 'pat-saas-003', enterpriseId: 'ent-002', name: '孙尚香', gender: 'female', dob: '1987-03-15', primaryDisease: '哮喘', contactPhone: '13012340003' },
];

const initialPlatformConnections: SaasPlatformConnection[] = [
  { id: 'wc-pers-001', platform: 'wechat_personal_bot', accountName: '健康助理小微 (员工王明)', enterpriseId: 'ent-001', associatedEmployeeId: 'emp-001a', status: 'connected', lastSync: subDays(new Date(), 1).toISOString() },
  { id: 'wc-ent-001', platform: 'wechat_enterprise_app', accountName: '示例医院A-企业微信', enterpriseId: 'ent-001', status: 'connected', lastSync: subDays(new Date(), 0.5).toISOString() },
  { id: 'wc-pers-002', platform: 'wechat_personal_bot', accountName: '健康顾问机器人 (员工刘芳)', enterpriseId: 'ent-001', associatedEmployeeId: 'emp-002a', status: 'disconnected' },
];

const initialCommunityGroups: SaasCommunityGroup[] = [
  { id: 'cg-001', name: 'VIP客户交流群 (示例医院A)', enterpriseId: 'ent-001', managingEmployeeId: 'emp-001a', type: 'personal_wechat_group', platformGroupId: 'wxid_grp_aaa', memberPatientIds: ['pat-saas-001'], patientCount: 1, platformConnectionId: 'wc-pers-001', connectionStatus: 'active_sync', lastLogSync: subDays(new Date(), 0.2).toISOString(), creationDate: subDays(new Date(), 10).toISOString(), tags: ['高血压', 'VIP'] },
  { id: 'cg-002', name: '糖尿病管理群 (示例医院A)', enterpriseId: 'ent-001', managingEmployeeId: 'emp-002a', type: 'enterprise_wechat_group', platformGroupId: 'qywx_grp_bbb', memberPatientIds: ['pat-saas-002'], patientCount: 1, platformConnectionId: 'wc-ent-001', connectionStatus: 'active_sync', lastLogSync: subDays(new Date(), 0.1).toISOString(), creationDate: subDays(new Date(), 5).toISOString(), tags: ['糖尿病', '教育'] },
  { id: 'cg-003', name: '健康中心B哮喘互助', enterpriseId: 'ent-002', type: 'personal_wechat_group', patientCount: 1, memberPatientIds: ['pat-saas-003'], connectionStatus: 'not_monitored', creationDate: subDays(new Date(), 20).toISOString() },
];


export default function CommunityManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>("all");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("all");
  const [filterGroupType, setFilterGroupType] = useState<SaasCommunityGroup['type'] | "all">("all");
  const [filterConnectionStatus, setFilterConnectionStatus] = useState<SaasCommunityGroup['connectionStatus'] | "all">("all");
  
  const [platformConnections, setPlatformConnections] = useState<SaasPlatformConnection[]>(initialPlatformConnections);
  const [communityGroups, setCommunityGroups] = useState<SaasCommunityGroup[]>(initialCommunityGroups);
  
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SaasCommunityGroup | null>(null);

  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const availableEmployeesForFilter = useMemo(() => {
    if (selectedEnterpriseId === "all") return allEmployees;
    return allEmployees.filter(emp => emp.enterpriseId === selectedEnterpriseId);
  }, [selectedEnterpriseId]);

  const filteredCommunityGroups = useMemo(() => {
    return communityGroups.filter(group => {
      const enterpriseMatch = selectedEnterpriseId === "all" || group.enterpriseId === selectedEnterpriseId;
      const employeeMatch = selectedEmployeeId === "all" || group.managingEmployeeId === selectedEmployeeId;
      const typeMatch = filterGroupType === "all" || group.type === filterGroupType;
      const statusMatch = filterConnectionStatus === "all" || group.connectionStatus === filterConnectionStatus;
      const searchMatch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (group.platformGroupId && group.platformGroupId.toLowerCase().includes(searchTerm.toLowerCase()));
      return enterpriseMatch && employeeMatch && typeMatch && statusMatch && searchMatch;
    });
  }, [communityGroups, searchTerm, selectedEnterpriseId, selectedEmployeeId, filterGroupType, filterConnectionStatus]);

  const handleConnectPlatform = (platformType: 'personal' | 'enterprise') => {
    toast({ title: "模拟操作", description: `连接新的 ${platformType === 'personal' ? '个人微信机器人' : '企业微信应用'} 功能开发中。` });
  };
  
  const handleSyncPlatformLogs = (platformId: string) => {
    setPlatformConnections(prev => prev.map(p => p.id === platformId ? {...p, lastSync: new Date().toISOString(), status: 'connected'} : p));
    toast({ title: "模拟同步", description: "平台连接日志已开始同步。" });
  };

  const handleAddGroup = () => {
    setEditingGroup(null);
    setIsGroupDialogOpen(true);
  };

  const handleEditGroup = (group: SaasCommunityGroup) => {
    setEditingGroup(group);
    setIsGroupDialogOpen(true);
  };

  const handleDeleteGroup = (groupId: string) => {
     if (window.confirm("确定要删除此社群吗？")) {
        setCommunityGroups(prev => prev.filter(g => g.id !== groupId));
        toast({ title: "删除成功", description: "社群已删除。" });
    }
  };
  
  const handleGroupDialogSubmit = (data: SaasCommunityGroup) => {
    if (editingGroup) {
      setCommunityGroups(prev => prev.map(g => g.id === editingGroup.id ? data : g));
      toast({ title: '更新成功', description: `社群 "${data.name}" 已更新。`});
    } else {
      setCommunityGroups(prev => [data, ...prev]);
      toast({ title: '创建成功', description: `新社群 "${data.name}" 已添加。`});
    }
    setIsGroupDialogOpen(false);
  };

  const handleSyncGroupLogs = (groupId: string) => {
    setCommunityGroups(prev => prev.map(g => g.id === groupId ? {...g, lastLogSync: new Date().toISOString(), connectionStatus: 'active_sync'} : g));
    toast({ title: "模拟同步", description: `社群 ${groupId} 日志已开始同步。` });
  };


  if (!isClient) {
    return <div className="p-4 text-center text-muted-foreground">正在加载社群管理数据...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <MessageSquare className="h-6 w-6 text-primary" />
            社群管理 (微信群等)
          </CardTitle>
          <CardDescription>
            管理员工负责的微信群，追踪聊天记录和群成员健康互动。
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle className="text-lg">平台连接管理 (微信机器人/企业微信应用)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            {platformConnections.map(pc => (
                 <div key={pc.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-md">
                    <div>
                        <p className="font-medium">{pc.accountName}</p>
                        <p className="text-xs text-muted-foreground">
                            类型: {pc.platform === 'wechat_personal_bot' ? '个人微信Bot' : '企业微信应用'} | 
                            状态: <Badge variant={pc.status === 'connected' ? 'default' : 'outline'} className={`${pc.status === 'connected' ? 'bg-green-500' : ''}`}>{pc.status}</Badge>
                            {pc.lastSync && <span className="ml-2">上次同步: {format(parseISO(pc.lastSync), 'yy-MM-dd HH:mm')}</span>}
                        </p>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                        {pc.status !== 'connected' && <Button size="sm" onClick={() => handleConnectPlatform(pc.platform === 'wechat_personal_bot' ? 'personal' : 'enterprise')} disabled>连接</Button>}
                        <Button size="sm" variant="outline" onClick={() => handleSyncPlatformLogs(pc.id)} disabled={pc.status !== 'connected'}>
                            <RotateCcw className="h-3 w-3 mr-1"/> 同步
                        </Button>
                    </div>
                 </div>
            ))}
            <Button onClick={() => handleConnectPlatform('personal')} variant="outline" size="sm"><PlusCircle className="h-4 w-4 mr-1"/> 添加平台连接</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">社群列表与筛选</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative lg:col-span-2">
              <Label htmlFor="groupSearch" className="sr-only">搜索社群</Label>
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="groupSearch" type="search" placeholder="群名称, 描述, 平台ID..." className="pl-8 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={selectedEnterpriseId} onValueChange={setSelectedEnterpriseId}>
              <SelectTrigger><Briefcase className="mr-2 h-4 w-4"/>筛选企业</SelectTrigger>
              <SelectContent><SelectItem value="all">所有企业</SelectItem>{mockEnterprises.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}</SelectContent>
            </Select>
            <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId} disabled={availableEmployeesForFilter.length === 0}>
              <SelectTrigger><UsersIcon className="mr-2 h-4 w-4"/>筛选员工</SelectTrigger>
              <SelectContent><SelectItem value="all">所有员工</SelectItem>{availableEmployeesForFilter.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}</SelectContent>
            </Select>
             <Select value={filterGroupType} onValueChange={(v) => setFilterGroupType(v as any)}>
              <SelectTrigger><Filter className="mr-2 h-4 w-4"/>群类型</SelectTrigger>
              <SelectContent><SelectItem value="all">所有类型</SelectItem><SelectItem value="personal_wechat_group">个人微信群</SelectItem><SelectItem value="enterprise_wechat_group">企业微信群</SelectItem><SelectItem value="other_platform_group">其他平台</SelectItem></SelectContent>
            </Select>
            <Select value={filterConnectionStatus} onValueChange={(v) => setFilterConnectionStatus(v as any)}>
              <SelectTrigger><Filter className="mr-2 h-4 w-4"/>连接状态</SelectTrigger>
              <SelectContent><SelectItem value="all">所有状态</SelectItem><SelectItem value="active_sync">已同步</SelectItem><SelectItem value="inactive_sync">未同步</SelectItem><SelectItem value="error_sync">同步错误</SelectItem><SelectItem value="not_monitored">未监控</SelectItem></SelectContent>
            </Select>
             <div className="lg:col-start-4 flex justify-end">
                 <Button onClick={handleAddGroup}><PlusCircle className="mr-2 h-4 w-4"/> 添加社群记录</Button>
            </div>
          </div>
          <CommunityGroupTable
            groups={filteredCommunityGroups}
            enterprises={mockEnterprises}
            employees={mockEmployees}
            onEdit={handleEditGroup}
            onDelete={handleDeleteGroup}
            onSyncLogs={handleSyncGroupLogs}
          />
        </CardContent>
      </Card>
      
      {isClient && platformConnections && enterprises && mockEmployees && mockPatients && (
        <CommunityGroupDialog
            isOpen={isGroupDialogOpen}
            onClose={() => setIsGroupDialogOpen(false)}
            onSubmit={handleGroupDialogSubmit}
            group={editingGroup}
            enterprises={mockEnterprises}
            allEmployees={mockEmployees}
            allPatients={mockPatients}
            platformConnections={platformConnections}
        />
      )}

       <Card>
            <CardHeader>
                <CardTitle className="text-lg">聊天记录与分析 (占位)</CardTitle>
                <CardDescription>此处将展示选定社群的聊天记录、关键词分析、情感分析等。</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mt-2 p-8 border border-dashed border-border rounded-md text-center bg-muted/30 min-h-[200px] flex flex-col justify-center items-center">
                    <List className="h-16 w-16 mx-auto text-primary/20 mb-3" />
                    <p className="text-lg font-semibold text-muted-foreground">聊天记录详情和分析功能正在建设中</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md">
                    将支持查看详细聊天内容、搜索、以及基于AI的聊天分析。
                    </p>
                </div>
            </CardContent>
       </Card>

    </div>
  );
}
