
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EnterpriseTable } from "./components/EnterpriseTable";
import { EnterpriseDialog } from "./components/EnterpriseDialog";
import type { SaasEnterprise } from '@/lib/types';
import { Briefcase, PlusCircle, Search, FileUp, FileDown } from "lucide-react";

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
  },
];

export default function EnterpriseManagementPage() {
  const [enterprises, setEnterprises] = useState<SaasEnterprise[]>(initialEnterprises);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEnterprise, setEditingEnterprise] = useState<SaasEnterprise | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // To prevent hydration errors with initialEnterprises' date strings
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
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
      // Here you would call an API to delete the enterprise
    }
  };

  const handleDialogSubmit = (data: SaasEnterprise) => {
    if (editingEnterprise) {
      setEnterprises(prev => prev.map(e => e.id === editingEnterprise.id ? { ...e, ...data } : e));
      // API call to update
    } else {
      const newEnterprise = { ...data, id: Date.now().toString(), creationDate: new Date().toISOString() };
      setEnterprises(prev => [newEnterprise, ...prev]);
      // API call to create
    }
    setIsDialogOpen(false);
    setEditingEnterprise(null);
  };
  
  const handleToggleStatus = (enterpriseId: string, currentStatus: SaasEnterprise['status']) => {
    // This is a placeholder. A real app would have more complex status transition logic.
    const newStatusOrder: SaasEnterprise['status'][] = ['pending_approval', 'active', 'inactive', 'suspended'];
    const currentIndex = newStatusOrder.indexOf(currentStatus);
    const nextStatus = newStatusOrder[(currentIndex + 1) % newStatusOrder.length];
    
    setEnterprises(prev => prev.map(e => e.id === enterpriseId ? { ...e, status: nextStatus } : e));
    alert(`企业 ${enterpriseId} 状态已切换为 ${nextStatus} (模拟)`);
    // API call to update status
  };

  const filteredEnterprises = enterprises.filter(enterprise =>
    enterprise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enterprise.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enterprise.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="搜索企业名称、联系人..."
                    className="pl-8 sm:w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto" disabled><FileUp className="mr-2 h-4 w-4"/>导入</Button>
                <Button variant="outline" className="w-full sm:w-auto" disabled><FileDown className="mr-2 h-4 w-4"/>导出</Button>
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
