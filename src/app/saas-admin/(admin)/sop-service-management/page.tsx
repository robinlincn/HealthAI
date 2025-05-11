
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SopServiceTable } from "./components/SopServiceTable";
import { SopServiceDialog } from "./components/SopServiceDialog";
import type { SaasSopService } from '@/lib/types';
import { SlidersHorizontal, PlusCircle, Search, BarChart3 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const mockInitialSopServices: SaasSopService[] = [
  {
    id: 'sop-coze-001',
    name: '智能健康问答Bot (Coze)',
    type: 'Coze',
    apiEndpoint: 'https://api.coze.com/bots/your_bot_id/chat',
    apiKey: '**********', // Masked for display
    description: '用于处理常见健康问题的AI机器人。',
    status: 'active',
    creationDate: new Date(2023, 10, 15).toISOString(),
    callCount: 1250,
    errorCount: 15,
  },
  {
    id: 'sop-dify-001',
    name: '用药提醒工作流 (Dify)',
    type: 'Dify',
    apiEndpoint: 'https://api.dify.ai/workflows/your_flow_id/run',
    status: 'active',
    creationDate: new Date(2024, 1, 20).toISOString(),
    callCount: 870,
    parameters: JSON.stringify({ default_language: "zh-CN" }),
  },
  {
    id: 'sop-custom-001',
    name: '内部诊断辅助API',
    type: 'Other',
    apiEndpoint: 'https://internal.api/diagnose_assist',
    status: 'inactive',
    description: '内部开发的AI诊断辅助接口。',
    creationDate: new Date(2024, 3, 1).toISOString(),
  },
];

export default function SopServiceManagementPage() {
  const [sopServices, setSopServices] = useState<SaasSopService[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<SaasSopService | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setSopServices(mockInitialSopServices);
  }, []);

  const handleAddService = () => {
    setEditingService(null);
    setIsDialogOpen(true);
  };

  const handleEditService = (service: SaasSopService) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (window.confirm('确定要删除此SOP服务配置吗？此操作不可撤销。')) {
      setSopServices(prev => prev.filter(s => s.id !== serviceId));
      toast({ title: '删除成功', description: 'SOP服务配置已删除。' });
    }
  };

  const handleDialogSubmit = (data: SaasSopService) => {
    if (editingService) {
      setSopServices(prev => prev.map(s => (s.id === editingService.id ? { ...s, ...data } : s)));
      toast({ title: '更新成功', description: `SOP服务 "${data.name}" 信息已更新。`});
    } else {
      const newService = { ...data, id: `sop-${Date.now().toString()}`, creationDate: new Date().toISOString() };
      setSopServices(prev => [newService, ...prev]);
      toast({ title: '创建成功', description: `新SOP服务 "${data.name}" 已添加。`});
    }
    setIsDialogOpen(false);
    setEditingService(null);
  };
  
  const handleToggleStatus = (serviceId: string) => {
     setSopServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
     toast({ title: '状态已更新', description: `SOP服务状态已切换。` });
  };
  
  const handleViewLogs = (serviceId: string) => {
    toast({ title: "提示", description: `查看服务 ${serviceId} 的日志/统计功能正在开发中。` });
  };

  const filteredServices = useMemo(() => {
    return sopServices.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [sopServices, searchTerm]);


  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>SOP服务管理</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载SOP服务数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <SlidersHorizontal className="h-6 w-6 text-primary" />
            SOP服务管理
          </CardTitle>
          <CardDescription>
            管理中台扣子（Coze）、Dify等工作流的API相关内容，优化调用流程、配置参数、监控状态。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="搜索服务名称、类型..."
                    className="pl-8 sm:w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button onClick={handleAddService} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> 新增SOP服务
            </Button>
          </div>
          
          <SopServiceTable 
            services={filteredServices} 
            onEdit={handleEditService} 
            onDelete={handleDeleteService}
            onToggleStatus={handleToggleStatus}
            onViewLogs={handleViewLogs}
          />
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary/80"/> API调用统计与监控
            </CardTitle>
            <CardDescription>
                实时监控API调用情况，包括调用次数、成功率、错误日志等。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2 p-6 border border-dashed border-border rounded-md text-center bg-muted/30 min-h-[150px] flex flex-col justify-center items-center">
                <BarChart3 className="h-12 w-12 mx-auto text-primary/20 mb-3" />
                <p className="text-md font-semibold text-muted-foreground">API调用统计图表区 (开发中)</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                此处将展示各SOP服务的调用次数、成功/失败率、平均响应时间等图表信息。
                </p>
            </div>
          </CardContent>
      </Card>

      <SopServiceDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingService(null);
        }}
        onSubmit={handleDialogSubmit}
        service={editingService}
      />
    </div>
  );
}
