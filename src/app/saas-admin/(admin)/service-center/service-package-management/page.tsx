
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ServicePackageTable } from "./components/ServicePackageTable";
import { ServicePackageDialog } from "./components/ServicePackageDialog";
import type { SaasServicePackage } from '@/lib/types';
import { Package, PlusCircle, Search } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const mockInitialServicePackages: SaasServicePackage[] = [
  {
    id: 'pkg-001',
    name: '基础慢病管理套餐',
    type: 'basic',
    priceMonthly: 299,
    priceAnnually: 2990,
    features: ['健康数据记录与同步', 'AI健康建议', '在线咨询医生(文字)', '月度健康报告'],
    highlights: '适合个人用户或小型诊所',
    maxUsers: 5,
    maxStorageGB: 10,
    maxPatients: 100,
    isEnabled: true,
  },
  {
    id: 'pkg-002',
    name: '标准慢病协作套餐',
    type: 'standard',
    priceMonthly: 799,
    features: ['所有基础版功能', '多医生协作', '高级数据分析', '视频咨询', '家属账号绑定'],
    highlights: '适合中型医院或连锁诊所',
    maxUsers: 20,
    maxStorageGB: 50,
    maxPatients: 500,
    isEnabled: true,
  },
  {
    id: 'pkg-003',
    name: '旗舰慢病关怀套餐',
    type: 'premium',
    priceMonthly: 1599,
    features: ['所有标准版功能', '专属健康管家服务', '定制化SOP流程', 'API集成', '优先技术支持'],
    highlights: '适合大型医院或高端健康管理机构',
    maxUsers: 100,
    maxStorageGB: 200,
    maxPatients: 2000,
    isEnabled: false,
  },
];


export default function ServicePackageManagementPage() {
  const [servicePackages, setServicePackages] = useState<SaasServicePackage[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<SaasServicePackage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setServicePackages(mockInitialServicePackages);
  }, []);

  const handleAddPackage = () => {
    setEditingPackage(null);
    setIsDialogOpen(true);
  };

  const handleEditPackage = (pkg: SaasServicePackage) => {
    setEditingPackage(pkg);
    setIsDialogOpen(true);
  };

  const handleDeletePackage = (packageId: string) => {
    if (window.confirm('确定要删除此服务包吗？此操作不可撤销。')) {
      setServicePackages(prev => prev.filter(p => p.id !== packageId));
      toast({ title: '删除成功', description: '服务包已删除。' });
    }
  };

  const handleDialogSubmit = (data: SaasServicePackage) => {
    if (editingPackage) {
      setServicePackages(prev => prev.map(p => (p.id === editingPackage.id ? { ...p, ...data } : p)));
      toast({ title: '更新成功', description: `服务包 "${data.name}" 信息已更新。`});
    } else {
      const newPackage = { ...data, id: `pkg-${Date.now().toString()}` };
      setServicePackages(prev => [newPackage, ...prev]);
      toast({ title: '创建成功', description: `新服务包 "${data.name}" 已添加。`});
    }
    setIsDialogOpen(false);
    setEditingPackage(null);
  };
  
  const handleToggleStatus = (packageId: string) => {
     setServicePackages(prev => prev.map(p => p.id === packageId ? { ...p, isEnabled: !p.isEnabled } : p));
     toast({ title: '状态已更新', description: `服务包启用状态已切换。` });
  };

  const filteredPackages = useMemo(() => {
    return servicePackages.filter(pkg =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [servicePackages, searchTerm]);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>服务包管理</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载服务包数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Package className="h-6 w-6 text-primary" />
            服务包管理
          </CardTitle>
          <CardDescription>
            创建、编辑和管理平台提供的各类服务包，并配置其详细信息及权限。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="搜索服务包名称或类型..."
                    className="pl-8 sm:w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button onClick={handleAddPackage} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> 新增服务包
            </Button>
          </div>
          
          <ServicePackageTable 
            packages={filteredPackages} 
            onEdit={handleEditPackage} 
            onDelete={handleDeletePackage}
            onToggleStatus={handleToggleStatus}
          />
        </CardContent>
      </Card>

      <ServicePackageDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingPackage(null);
        }}
        onSubmit={handleDialogSubmit}
        servicePackage={editingPackage}
      />
    </div>
  );
}

