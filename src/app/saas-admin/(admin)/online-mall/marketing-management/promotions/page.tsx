
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { PromotionTable } from "./components/PromotionTable";
// import { PromotionDialog } from "./components/PromotionDialog";
import type { SaasPromotion, SaasEnterprise, SaasProductStatus } from '@/lib/types';
import { Percent, PlusCircle, Search, Filter, Briefcase, ListFilter } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四', creationDate: new Date().toISOString(), contactEmail:'b@b.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
];

const mockInitialPromotions: SaasPromotion[] = [
  // Add mock promotion data later
];


export default function PromotionsManagementPage() {
  const [promotions, setPromotions] = useState<SaasPromotion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<SaasPromotion | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEnterpriseId, setFilterEnterpriseId] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setPromotions(mockInitialPromotions);
  }, []);

  const handleAddPromotion = () => {
    setEditingPromotion(null);
    // setIsDialogOpen(true); // Placeholder for dialog opening
    toast({ title: "提示", description: "新增促销活动功能正在开发中。" });
  };

  // Placeholder functions for table actions
  const handleEditPromotion = (promo: SaasPromotion) => {
    setEditingPromotion(promo);
    // setIsDialogOpen(true);
    toast({ title: "提示", description: `编辑促销 "${promo.name}" 功能正在开发中。` });
  };

  const handleDeletePromotion = (promoId: string) => {
    if (window.confirm('确定要删除此促销活动吗？')) {
      // setPromotions(prev => prev.filter(p => p.id !== promoId));
      toast({ title: '提示', description: '删除促销活动功能正在开发中。' });
    }
  };
  
  const handleTogglePromotionStatus = (promoId: string) => {
     toast({ title: '提示', description: '切换促销状态功能正在开发中。' });
  };

  const filteredPromotions = useMemo(() => {
    return promotions.filter(promo => {
      const enterpriseMatch = filterEnterpriseId === "all" || promo.enterpriseId === filterEnterpriseId;
      const typeMatch = filterType === "all" || promo.type === filterType;
      const statusMatch = filterStatus === "all" || promo.status === filterStatus;
      const searchMatch = promo.name.toLowerCase().includes(searchTerm.toLowerCase());
      return enterpriseMatch && typeMatch && statusMatch && searchMatch;
    });
  }, [promotions, searchTerm, filterEnterpriseId, filterType, filterStatus]);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>促销活动管理</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载促销数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Percent className="h-6 w-6 text-primary" />
            促销活动管理
          </CardTitle>
          <CardDescription>
            创建和管理商城的各类促销活动，如满减、折扣、买赠、限时优惠等。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border p-4 rounded-md space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              <div className="lg:col-span-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground sr-only" />
                <Input
                    type="search" placeholder="促销名称..."
                    className="pl-3 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterEnterpriseId} onValueChange={setFilterEnterpriseId} disabled>
                  <SelectTrigger><Briefcase className="mr-2 h-4 w-4"/>企业 (暂未启用)</SelectTrigger>
                  <SelectContent><SelectItem value="all">所有企业</SelectItem>{mockEnterprises.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}</SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType} disabled>
                  <SelectTrigger><ListFilter className="mr-2 h-4 w-4"/>类型 (暂未启用)</SelectTrigger>
                  <SelectContent><SelectItem value="all">所有类型</SelectItem></SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus} disabled>
                  <SelectTrigger><Filter className="mr-2 h-4 w-4"/>状态 (暂未启用)</SelectTrigger>
                  <SelectContent><SelectItem value="all">所有状态</SelectItem></SelectContent>
              </Select>
              <div className="lg:col-start-4 flex justify-end">
                <Button onClick={handleAddPromotion} className="w-full lg:w-auto"><PlusCircle className="mr-2 h-4 w-4"/> 添加促销活动</Button>
              </div>
            </div>
          </div>
          
          {/* Placeholder for PromotionTable */}
          <div className="mt-6 p-6 border border-dashed border-border rounded-md text-center">
            <Percent className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">促销活动列表将在此显示</p>
            <p className="text-sm text-muted-foreground mt-1">
              促销活动表格和编辑对话框功能正在开发中。
            </p>
          </div>
          {/* 
          <PromotionTable 
            promotions={filteredPromotions} 
            enterprises={mockEnterprises} // Assuming promotions can be linked to enterprises or global
            onEdit={handleEditPromotion} 
            onDelete={handleDeletePromotion}
            onToggleStatus={handleTogglePromotionStatus}
          /> 
          */}
        </CardContent>
      </Card>

      {/* 
      <PromotionDialog
        isOpen={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setEditingPromotion(null); }}
        // onSubmit={handleDialogSubmit} // Implement this later
        promotion={editingPromotion}
        enterprises={mockEnterprises}
      /> 
      */}
    </div>
  );
}
