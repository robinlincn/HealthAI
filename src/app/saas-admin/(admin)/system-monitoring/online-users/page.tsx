
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Users, Search, Briefcase, LogOut, Filter, UserCircle } from "lucide-react"; // Added UserCircle
import { Badge } from '@/components/ui/badge';
import { format, parseISO, subMinutes, subHours } from 'date-fns';
import type { SaasEnterprise } from '@/lib/types'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';


interface OnlineUser {
  id: string;
  name: string;
  email: string;
  enterpriseId?: string; 
  role: 'saas_admin' | 'enterprise_admin' | 'doctor' | 'patient'; 
  lastActivity: string; // ISO date string
  ipAddress?: string;
  avatarUrl?: string; // Optional avatar URL
}

const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
];

const generateMockOnlineUsers = (): OnlineUser[] => [
  { id: 'user-saas-001', name: 'SAAS 超级管理员', email: 'super@saas.com', role: 'saas_admin', lastActivity: new Date().toISOString(), ipAddress: '192.168.1.10', avatarUrl: 'https://picsum.photos/seed/saasadmin/40/40' },
  { id: 'user-ent-001', name: '张三院长', email: 'zhang@hospitala.com', enterpriseId: 'ent-001', role: 'enterprise_admin', lastActivity: subMinutes(new Date(), 5).toISOString(), ipAddress: '10.0.0.5', avatarUrl: 'https://picsum.photos/seed/entadmin1/40/40' },
  { id: 'user-doc-001', name: '王明医生', email: 'wm@hospitala.com', enterpriseId: 'ent-001', role: 'doctor', lastActivity: subMinutes(new Date(), 2).toISOString(), ipAddress: '10.0.0.15', avatarUrl: 'https://picsum.photos/seed/doc1/40/40' },
  { id: 'user-pat-001', name: '刘备 (病人)', email: 'liubei@patient.com', enterpriseId: 'ent-001', role: 'patient', lastActivity: subMinutes(new Date(), 10).toISOString(), ipAddress: '203.0.113.45', avatarUrl: 'https://picsum.photos/seed/pat1/40/40' },
  { id: 'user-doc-002', name: '李芳医生', email: 'lf@healthb.com', enterpriseId: 'ent-002', role: 'doctor', lastActivity: subMinutes(new Date(), 15).toISOString(), ipAddress: '172.16.0.10', avatarUrl: 'https://picsum.photos/seed/doc2/40/40' },
  { id: 'user-saas-002', name: 'SAAS 运营专员', email: 'ops@saas.com', role: 'saas_admin', lastActivity: subHours(new Date(), 1).toISOString(), ipAddress: '192.168.1.12' },
];


export default function OnlineUsersPage() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | OnlineUser['role']>('all');
  const [filterEnterprise, setFilterEnterprise] = useState<string>("all");
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setOnlineUsers(generateMockOnlineUsers());
  }, []);

  const getEnterpriseName = (enterpriseId?: string) => {
    if (!enterpriseId) return <Badge variant="outline" className="text-xs">平台用户</Badge>;
    return mockEnterprises.find(e => e.id === enterpriseId)?.name || '未知企业';
  };
  
  const getRoleBadge = (role: OnlineUser['role']) => {
    const map = {
      saas_admin: { text: 'SAAS管理员', variant: 'destructive' as const },
      enterprise_admin: { text: '企业管理员', variant: 'default' as const },
      doctor: { text: '医生', variant: 'secondary' as const },
      patient: { text: '病人', variant: 'outline' as const }
    };
    return <Badge variant={map[role].variant} className="capitalize text-xs">{map[role].text}</Badge>;
  };

  const handleForceLogout = (userId: string, userName: string) => {
    if (window.confirm(`确定要强制用户 "${userName}" 下线吗？`)) {
      setOnlineUsers(prev => prev.filter(u => u.id !== userId));
      toast({ title: "操作成功 (模拟)", description: `用户 "${userName}" 已被强制下线。` });
    }
  };

  const filteredUsers = useMemo(() => {
    return onlineUsers.filter(user => 
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRole === 'all' || user.role === filterRole) &&
      (filterEnterprise === 'all' || user.enterpriseId === filterEnterprise || (filterEnterprise === 'platform' && !user.enterpriseId))
    );
  }, [onlineUsers, searchTerm, filterRole, filterEnterprise]);

  if (!isClient) {
     return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle className="text-xl">在线用户</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载在线用户数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-6 w-6 text-primary" />
            在线用户监控
          </CardTitle>
          <CardDescription>
            实时查看当前登录和活动的用户列表，包括SAAS管理员、企业用户和病人。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-lg font-semibold">
              当前在线用户: <Badge variant="secondary" className="text-lg px-2 py-1">{filteredUsers.length}</Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
               <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="搜索用户名称/邮箱..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
               <Select value={filterRole} onValueChange={(value) => setFilterRole(value as 'all' | OnlineUser['role'])}>
                <SelectTrigger className="w-full sm:w-[160px]">
                    <Filter className="mr-2 h-4 w-4"/>
                    <SelectValue placeholder="筛选角色" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">所有角色</SelectItem>
                    <SelectItem value="saas_admin">SAAS管理员</SelectItem>
                    <SelectItem value="enterprise_admin">企业管理员</SelectItem>
                    <SelectItem value="doctor">医生</SelectItem>
                    <SelectItem value="patient">病人</SelectItem>
                </SelectContent>
              </Select>
               <Select value={filterEnterprise} onValueChange={setFilterEnterprise}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <Briefcase className="mr-2 h-4 w-4"/>
                    <SelectValue placeholder="筛选企业" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">所有企业</SelectItem>
                    <SelectItem value="platform">平台用户 (无企业)</SelectItem>
                    {mockEnterprises.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>所属企业</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>最近活动</TableHead>
                  <TableHead>IP地址</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="h-6 w-6 rounded-full mr-2" />
                        ) : (
                          <UserCircle className="h-5 w-5 mr-2 text-muted-foreground"/>
                        )}
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getEnterpriseName(user.enterpriseId)}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-xs">{format(parseISO(user.lastActivity), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                    <TableCell className="text-xs font-mono">{user.ipAddress || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleForceLogout(user.id, user.name)} className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2 text-xs">
                        <LogOut className="mr-1 h-3 w-3" /> 强制下线
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {filteredUsers.length === 0 && (
                <TableCaption>无匹配的在线用户。</TableCaption>
              )}
               {filteredUsers.length > 5 && (
                    <TableCaption>共 {filteredUsers.length} 位在线用户。</TableCaption>
               )}
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
