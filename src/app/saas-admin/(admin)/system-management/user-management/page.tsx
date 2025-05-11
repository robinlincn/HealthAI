
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaasUserTable } from "./components/SaasUserTable";
import { SaasUserDialog } from "./components/SaasUserDialog";
import type { SaasSystemUser, SaasSystemRole } from '@/lib/types';
import { UsersRound, PlusCircle, Search } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const mockInitialSaasUsers: SaasSystemUser[] = [
  { id: 'su001', name: '超级管理员', email: 'superadmin@saas.com', systemRoleId: 'role_superadmin', status: 'active', lastLogin: new Date(2024,4,20,10,0,0).toISOString() },
  { id: 'su002', name: '运营管理员', email: 'opsadmin@saas.com', systemRoleId: 'role_opsadmin', status: 'active', lastLogin: new Date(2024,4,19,15,30,0).toISOString() },
  { id: 'su003', name: '技术支持', email: 'support@saas.com', systemRoleId: 'role_support', status: 'disabled', lastLogin: new Date(2024,3,1).toISOString() },
];

// Mock roles for the dialog dropdown
const mockSystemRoles: SaasSystemRole[] = [
    { id: 'role_superadmin', name: '超级管理员', permissions: ['all'] },
    { id: 'role_opsadmin', name: '运营管理员', permissions: ['manage_enterprises', 'manage_service_packages'] },
    { id: 'role_support', name: '技术支持', permissions: ['view_logs', 'reset_passwords'] },
];

export default function SaasUserManagementPage() {
  const [saasUsers, setSaasUsers] = useState<SaasSystemUser[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SaasSystemUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setSaasUsers(mockInitialSaasUsers);
  }, []);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: SaasSystemUser) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('确定要删除此SAAS管理员账户吗？此操作不可撤销。')) {
      setSaasUsers(prev => prev.filter(u => u.id !== userId));
      toast({ title: '删除成功', description: 'SAAS管理员账户已删除。' });
    }
  };

  const handleDialogSubmit = (data: SaasSystemUser) => {
    if (editingUser) {
      setSaasUsers(prev => prev.map(u => (u.id === editingUser.id ? { ...u, ...data } : u)));
      toast({ title: '更新成功', description: `管理员 "${data.name}" 信息已更新。`});
    } else {
      const newUser = { ...data, id: `su-${Date.now().toString()}` };
      setSaasUsers(prev => [newUser, ...prev]);
      toast({ title: '创建成功', description: `新管理员 "${data.name}" 已添加。`});
    }
    setIsDialogOpen(false);
    setEditingUser(null);
  };
  
  const handleToggleStatus = (userId: string) => {
     setSaasUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' } : u));
     toast({ title: '状态已更新', description: `管理员账户状态已切换。` });
  };

  const filteredUsers = useMemo(() => {
    return saasUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [saasUsers, searchTerm]);


  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>SAAS用户管理</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载用户数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <UsersRound className="h-6 w-6 text-primary" />
            用户管理 (SAAS平台管理员)
          </CardTitle>
          <CardDescription>
            管理SAAS平台自身的管理员用户账户。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="搜索姓名或邮箱..."
                    className="pl-8 sm:w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button onClick={handleAddUser} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> 新增管理员
            </Button>
          </div>
          
          <SaasUserTable 
            users={filteredUsers} 
            roles={mockSystemRoles} // Pass roles for display
            onEdit={handleEditUser} 
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleStatus}
          />
        </CardContent>
      </Card>

      <SaasUserDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleDialogSubmit}
        user={editingUser}
        roles={mockSystemRoles}
      />
    </div>
  );
}

