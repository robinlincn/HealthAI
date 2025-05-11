
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoleTable } from "./components/RoleTable";
import { RoleDialog } from "./components/RoleDialog";
import type { SaasSystemRole } from '@/lib/types';
import { Shield, PlusCircle, Search } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const mockInitialSystemRoles: SaasSystemRole[] = [
  { id: 'role_superadmin', name: '超级管理员', description: '拥有所有系统权限', permissions: ['all_access', 'manage_users', 'manage_enterprises', 'manage_settings'] },
  { id: 'role_opsadmin', name: '运营管理员', description: '管理企业账户和服务包', permissions: ['manage_enterprises', 'manage_service_packages', 'view_orders'] },
  { id: 'role_support', name: '技术支持', description: '查看系统日志和协助用户', permissions: ['view_logs', 'reset_user_passwords', 'view_system_status'] },
  { id: 'role_viewer', name: '只读观察员', description: '只能查看部分数据，不能修改', permissions: ['view_dashboard', 'view_reports_summary'] },
];


export default function PermissionManagementPage() {
  const [systemRoles, setSystemRoles] = useState<SaasSystemRole[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<SaasSystemRole | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setSystemRoles(mockInitialSystemRoles);
  }, []);

  const handleAddRole = () => {
    setEditingRole(null);
    setIsDialogOpen(true);
  };

  const handleEditRole = (role: SaasSystemRole) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  };

  const handleDeleteRole = (roleId: string) => {
    if (window.confirm('确定要删除此系统角色吗？如果角色已被分配给用户，请先解除分配。此操作不可撤销。')) {
      setSystemRoles(prev => prev.filter(r => r.id !== roleId));
      toast({ title: '删除成功', description: '系统角色已删除。' });
    }
  };

  const handleDialogSubmit = (data: SaasSystemRole) => {
    if (editingRole) {
      setSystemRoles(prev => prev.map(r => (r.id === editingRole.id ? { ...r, ...data } : r)));
      toast({ title: '更新成功', description: `角色 "${data.name}" 信息已更新。`});
    } else {
      const newRole = { ...data, id: `role-${Date.now().toString()}` };
      setSystemRoles(prev => [newRole, ...prev]);
      toast({ title: '创建成功', description: `新角色 "${data.name}" 已添加。`});
    }
    setIsDialogOpen(false);
    setEditingRole(null);
  };
  
  const filteredRoles = useMemo(() => {
    return systemRoles.filter(role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [systemRoles, searchTerm]);

  if (!isClient) {
    // Simplified loading state for diagnostics
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-muted-foreground">正在加载角色数据...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Shield className="h-6 w-6 text-primary" />
            权限管理 (角色与权限)
          </CardTitle>
          <CardDescription>
            定义SAAS系统中的角色及其对应的操作权限。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="搜索角色名称或描述..."
                    className="pl-8 sm:w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button onClick={handleAddRole} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> 新增角色
            </Button>
          </div>
          
          <RoleTable 
            roles={filteredRoles} 
            onEdit={handleEditRole} 
            onDelete={handleDeleteRole}
          />
        </CardContent>
      </Card>

      <RoleDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingRole(null);
        }}
        onSubmit={handleDialogSubmit}
        role={editingRole}
      />
    </div>
  );
}
