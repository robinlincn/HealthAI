
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PromotionTable } from "./components/PromotionTable";
import { PromotionDialog } from "./components/PromotionDialog";
import type { SaasPromotion, SaasEnterprise, SaasPromotionStatus, SaasPromotionType } from '@/lib/types';
import { Percent, PlusCircle, Search, Filter, Briefcase, ListFilter } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { subDays, addDays } from 'date-fns';

// Mock data
const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四', creationDate: new Date().toISOString(), contactEmail:'b@b.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
];

const mockInitialPromotions: SaasPromotion[] = [
  { id: 'promo-001', name: '开业大酬宾-全场满100减20', type: 'full_reduction', enterpriseId: 'ent-001', startDate: subDays(new Date(), 5).toISOString(), endDate: addDays(new Date(), 10).toISOString(), status: 'active', conditions: [{ type: 'min_purchase_amount', value: 100 }], actions: [{ type: 'fixed_amount_off', value: 20 }] },
  { id: 'promo-002', name: '夏季健康节-指定商品8折', type: 'discount', startDate: new Date().toISOString(), status: 'scheduled', actions: [{ type: 'percentage_off', value: 0.2 }], applicableProducts: ['prod-001', 'prod-002'] },
  { id: 'promo-003', name: '感恩回馈-买血糖仪赠试纸', type: 'buy_x_get_y', enterpriseId: 'ent-002', startDate: subDays(new Date(), 20).toISOString(), endDate: subDays(new Date(), 5).toISOString(), status: 'expired', conditions: [{ type: 'specific_products', value: ['prod-001'] }], actions: [{ type: 'free_item', value: 'prod-trial-strips' }] },
];


export default function PromotionsManagementPage() {
  const [promotions, setPromotions] = useState<SaasPromotion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<SaasPromotion | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEnterpriseId, setFilterEnterpriseId] = useState<string>("all");
  const [filterType, setFilterType] = useState<SaasPromotionType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<SaasPromotionStatus | "all">("all");
  
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setPromotions(mockInitialPromotions);
  }, []);

  const handleAddPromotion = () => {
    setEditingPromotion(null);
    setIsDialogOpen(true);
  };

  const handleEditPromotion = (promo: SaasPromotion) => {
    setEditingPromotion(promo);
    setIsDialogOpen(true);
  };

  const handleDeletePromotion = (promoId: string) => {
    if (window.confirm('确定要删除此促销活动吗？')) {
      setPromotions(prev => prev.filter(p => p.id !== promoId));
      toast({ title: '删除成功', description: '促销活动已删除。' });
    }
  };
  
  const handleTogglePromotionStatus = (promoId: string) => {
     setPromotions(prev => prev.map(p => {
        if (p.id === promoId) {
            let newStatus: SaasPromotionStatus = p.status;
            if (p.status === 'active') newStatus = 'inactive';
            else if (p.status === 'inactive' || p.status === 'scheduled') newStatus = 'active'; // Allow activating scheduled
            // Expired promotions typically cannot be reactivated to 'active' directly
            return { ...p, status: newStatus };
        }
        return p;
     }));
     toast({ title: '状态已更新', description: `促销活动状态已切换。` });
  };

  const handleDialogSubmit = (data: SaasPromotion) => {
    if (editingPromotion) {
      setPromotions(prev => prev.map(p => (p.id === editingPromotion.id ? data : p)));
      toast({ title: '更新成功', description: `促销 "${data.name}" 信息已更新。`});
    } else {
      setPromotions(prev => [data, ...prev].sort((a,b) => parseISO(b.startDate).getTime() - parseISO(a.startDate).getTime()));
      toast({ title: '创建成功', description: `新促销 "${data.name}" 已添加。`});
    }
    setIsDialogOpen(false);
    setEditingPromotion(null);
  };
  
  const filteredPromotions = useMemo(() => {
    return promotions.filter(promo => {
      const enterpriseMatch = filterEnterpriseId === "all" || promo.enterpriseId === filterEnterpriseId || (!promo.enterpriseId && filterEnterpriseId === "platform");
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
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                      type="search" placeholder="搜索活动名称..."
                      className="pl-8 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={filterEnterpriseId} onValueChange={setFilterEnterpriseId}>
                  <SelectTrigger><Briefcase className="mr-2 h-4 w-4"/>所属企业</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有企业</SelectItem>
                    <SelectItem value="platform">平台通用</SelectItem>
                    {mockEnterprises.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}
                  </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={(value) => setFilterType(value as SaasPromotionType | "all")}>
                  <SelectTrigger><ListFilter className="mr-2 h-4 w-4"/>活动类型</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有类型</SelectItem>
                    <SelectItem value="full_reduction">满减</SelectItem>
                    <SelectItem value="discount">折扣</SelectItem>
                    <SelectItem value="buy_x_get_y">买赠</SelectItem>
                    <SelectItem value="limited_time_offer">限时特惠</SelectItem>
                  </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as SaasPromotionStatus | "all")}>
                  <SelectTrigger><Filter className="mr-2 h-4 w-4"/>活动状态</SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">所有状态</SelectItem>
                      <SelectItem value="active">进行中</SelectItem>
                      <SelectItem value="inactive">未激活</SelectItem>
                      <SelectItem value="scheduled">待开始</SelectItem>
                      <SelectItem value="expired">已结束</SelectItem>
                  </SelectContent>
              </Select>
              <div className="lg:col-start-4 flex justify-end">
                <Button onClick={handleAddPromotion} className="w-full lg:w-auto"><PlusCircle className="mr-2 h-4 w-4"/> 添加促销活动</Button>
              </div>
            </div>
          </div>
          
          <PromotionTable 
            promotions={filteredPromotions} 
            enterprises={mockEnterprises}
            onEdit={handleEditPromotion} 
            onDelete={handleDeletePromotion}
            onToggleStatus={handleTogglePromotionStatus}
          />
        </CardContent>
      </Card>

      <PromotionDialog
        isOpen={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setEditingPromotion(null); }}
        onSubmit={handleDialogSubmit}
        promotion={editingPromotion}
        enterprises={mockEnterprises}
      />
    </div>
  );
}

    