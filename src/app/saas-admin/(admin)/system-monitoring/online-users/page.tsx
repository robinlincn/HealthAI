
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Search, Briefcase, LogOut, Filter } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import type { SaasEnterprise } from '@/lib/types'; // Assuming SaasEnterprise type
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface OnlineUser {
  id: string;
  name: string;
  email: string;
  enterpriseId?: string; // If user belongs to an enterprise
  role: 'saas_admin' | 'enterprise_admin' | 'doctor' | 'patient'; // Example roles
  lastActivity: string; // ISO date string
  ipAddress?: string;
}

const mockOnlineUsers: OnlineUser[] = [
  { id: 'user-saas-001', name: 'SAAS SuperAdmin', email: 'super@saas.com', role: 'saas_admin', lastActivity: new Date().toISOString(), ipAddress: '192.168.1.10' },
  { id: 'user-ent-001', name: '张三院长', email: 'zhang@hospitala.com', enterpriseId: 'ent-001', role: 'enterprise_admin', lastActivity: new Date(Date.now() - 1000 * 60 * 5).toISOString(), ipAddress: '10.0.0.5' },
  { id: 'user-doc-001', name: '王明医生', email: 'wm@hospitala.com', enterpriseId: 'ent-001', role: 'doctor', lastActivity: new Date(Date.now() - 1000 * 60 * 2).toISOString(), ipAddress: '10.0.0.15' },
  { id: 'user-pat-001', name: '刘备 (病人)', email: 'liubei@patient.com', enterpriseId: 'ent-001', role: 'patient', lastActivity: new Date(Date.now() - 1000 * 60 * 10).toISOString(), ipAddress: '203.0.113.45' },
];

// Mock enterprises for context
const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
];


export default function OnlineUsersPage() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | OnlineUser['role']>('all');

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    // Simulate fetching online users
    setOnlineUsers(mockOnlineUsers);
  }, []);

  const getEnterpriseName = (enterpriseId?: string) => {
    if (!enterpriseId) return 'N/A (平台用户)';
    return mockEnterprises.find(e => e.id === enterpriseId)?.name || '未知企业';
  };
  
  const getRoleText = (role: OnlineUser['role']) => {
    const map = {
      saas_admin: 'SAAS管理员',
      enterprise_admin: '企业管理员',
      doctor: '医生',
      patient: '病人'
    };
    return map[role] || role;
  };

  const filteredUsers = useMemo(() => {
    return onlineUsers.filter(user => 
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRole === 'all' || user.role === filterRole)
    );
  }, [onlineUsers, searchTerm, filterRole]);

  if (!isClient) {
     return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>在线用户</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载在线用户数据...</p></CardContent></Card>
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-lg font-semibold">
              当前在线用户: <Badge variant="secondary" className="text-lg px-2 py-1">{filteredUsers.length}</Badge>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
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
                <SelectTrigger className="w-full sm:w-[180px]">
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
            </div>
          </div>
          
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户名称</TableHead>
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
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center">
                        {user.enterpriseId && <Briefcase className="h-3.5 w-3.5 mr-1 text-muted-foreground"/>}
                        {getEnterpriseName(user.enterpriseId)}
                       </span>
                    </TableCell>
                    <TableCell>
                        <Badge variant={user.role === 'saas_admin' ? 'destructive' : (user.role === 'enterprise_admin' ? 'default' : 'outline') } className="capitalize">
                         {getRoleText(user.role)}
                        </Badge>
                    </TableCell>
                    <TableCell>{format(parseISO(user.lastActivity), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                    <TableCell>{user.ipAddress || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>
                        <LogOut className="mr-1 h-3 w-3" /> 强制下线
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {filteredUsers.length === 0 && (
                <caption className="p-4 text-center text-sm text-muted-foreground">无匹配的在线用户。</caption>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

