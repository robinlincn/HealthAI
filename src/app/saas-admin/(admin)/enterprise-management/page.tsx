
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EnterpriseTable } from "./components/EnterpriseTable";
import { EnterpriseDialog } from "./components/EnterpriseDialog";
import type { SaasEnterprise } from '@/lib/types';
import { Briefcase, PlusCircle, Search, FileUp, FileDown } from "lucide-react";
import { useToast } from '@/hooks/use-toast'; // Assuming you have a toast hook

const initialEnterprises: SaasEnterprise[] = [
  {
    id: 'ent-001',
    name: '示例医院A',
    contactPerson: '张三院长',
    contactEmail: 'zhangsan@hospitala.com',
    contactPhone: '13800138001',
    address: '示例市示例路1号',
    status: 'active',
    creationDate: new Date(2023, 0, 15).toISOString(),
    assignedResources: { maxUsers: 50, maxStorageGB: 100, maxPatients: 5000 },
    notes: '长期合作大客户',
  },
  {
    id: 'ent-002',
    name: '健康管理中心B',
    contactPerson: '李四主任',
    contactEmail: 'lisi@healthcenterb.com',
    contactPhone: '13900139002',
    address: '示例市健康街22号',
    status: 'pending_approval',
    creationDate: new Date(2024, 4, 1).toISOString(),
    assignedResources: { maxUsers: 10, maxStorageGB: 20, maxPatients: 500 },
  },
   {
    id: 'ent-003',
    name: '社区诊所C',
    contactPerson: '王五医生',
    contactEmail: 'wangwu@clinicc.com',
    contactPhone: '13700137003',
    status: 'inactive',
    creationDate: new Date(2023, 8, 10).toISOString(),
    assignedResources: { maxUsers: 5, maxStorageGB: 10, maxPatients: 200 },
    address: '示例市社区路3号',
  },
];

export default function EnterpriseManagementPage() {
  const [enterprises, setEnterprises] = useState<SaasEnterprise[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEnterprise, setEditingEnterprise] = useState<SaasEnterprise | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    // Load initial data only on client-side to avoid hydration issues with dates
    setEnterprises(initialEnterprises); 
  }, []);

  const handleAddEnterprise = () => {
    setEditingEnterprise(null);
    setIsDialogOpen(true);
  };

  const handleEditEnterprise = (enterprise: SaasEnterprise) => {
    setEditingEnterprise(enterprise);
    setIsDialogOpen(true);
  };

  const handleDeleteEnterprise = (enterpriseId: string) => {
    if (window.confirm('确定要删除此企业账户吗？此操作不可撤销。')) {
      setEnterprises(prev => prev.filter(e => e.id !== enterpriseId));
      toast({ title: '删除成功', description: '企业账户已删除。' });
    }
  };

  const handleDialogSubmit = (data: SaasEnterprise) => {
    if (editingEnterprise) {
      setEnterprises(prev => prev.map(e => (e.id === editingEnterprise.id ? { ...e, ...data } : e)));
      toast({ title: '更新成功', description: `企业 "${data.name}" 信息已更新。`});
    } else {
      // For new enterprise, ensure creationDate and id are correctly set if not already by dialog
      const newEnterprise = { 
        ...data, 
        id: data.id || Date.now().toString(), 
        creationDate: data.creationDate || new Date().toISOString() 
      };
      setEnterprises(prev => [newEnterprise, ...prev]);
      toast({ title: '创建成功', description: `新企业 "${data.name}" 已添加。`});
    }
    setIsDialogOpen(false);
    setEditingEnterprise(null);
  };
  
  const handleToggleStatus = (enterpriseId: string, currentStatus: SaasEnterprise['status']) => {
    const statusOrder: SaasEnterprise['status'][] = ['pending_approval', 'active', 'inactive', 'suspended'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    
    setEnterprises(prev => prev.map(e => e.id === enterpriseId ? { ...e, status: nextStatus } : e));
    toast({ title: '状态已更新', description: `企业状态已切换为 ${nextStatus}。` });
  };

  const filteredEnterprises = useMemo(() => {
    return enterprises.filter(enterprise =>
      enterprise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enterprise.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enterprise.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [enterprises, searchTerm]);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Briefcase className="h-6 w-6 text-primary" />
              企业管理 (医院管理)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">正在加载企业数据...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Briefcase className="h-6 w-6 text-primary" />
            企业管理 (医院管理)
          </CardTitle>
          <CardDescription>
            管理SAAS平台中的企业或医院账户，包括账户创建、资源分配和基本信息配置。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="搜索企业名称、联系人..."
                    className="pl-8 sm:w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast({title: '提示', description: '导入功能正在开发中'})}><FileUp className="mr-2 h-4 w-4"/>导入</Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast({title: '提示', description: '导出功能正在开发中'})}><FileDown className="mr-2 h-4 w-4"/>导出</Button>
                <Button onClick={handleAddEnterprise} className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" /> 新增企业
                </Button>
            </div>
          </div>
          
          <EnterpriseTable 
            enterprises={filteredEnterprises} 
            onEdit={handleEditEnterprise} 
            onDelete={handleDeleteEnterprise}
            onToggleStatus={handleToggleStatus}
          />
        </CardContent>
      </Card>

      <EnterpriseDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingEnterprise(null);
        }}
        onSubmit={handleDialogSubmit}
        enterprise={editingEnterprise}
      />
    </div>
  );
}
