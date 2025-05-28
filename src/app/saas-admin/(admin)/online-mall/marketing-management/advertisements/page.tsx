
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdvertisementTable } from "./components/AdvertisementTable";
import { AdvertisementDialog } from "./components/AdvertisementDialog";
import type { SaasAdvertisement, SaasAdSlot, SaasAdvertisementStatus, SaasAdvertisementType } from '@/lib/types';
import { Presentation, PlusCircle, Search, Filter } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { subDays, addDays } from 'date-fns';

const mockAdSlots: SaasAdSlot[] = [
    {id: "slot_homepage_banner", name: "首页轮播Banner (750x300)"},
    {id: "slot_sidebar_small", name: "侧边栏小广告 (250x250)"},
    {id: "slot_product_list_top", name: "商品列表页顶部通栏"},
];

const mockInitialAdvertisements: SaasAdvertisement[] = [
  { id: 'ad-001', name: '夏季健康大促Banner', adSlotId: 'slot_homepage_banner', type: 'image', assetUrl: 'https://placehold.co/750x300.png?text=夏日大促', linkUrl: '/promotions/summer-sale', startDate: new Date().toISOString(), endDate: addDays(new Date(), 15).toISOString(), status: 'active' },
  { id: 'ad-002', name: '新品血糖仪推荐', adSlotId: 'slot_sidebar_small', type: 'image', assetUrl: 'https://placehold.co/250x250.png?text=血糖仪推荐', linkUrl: '/products/prod-001', startDate: subDays(new Date(), 5).toISOString(), status: 'active' },
  { id: 'ad-003', name: '健康讲座视频广告', adSlotId: 'slot_product_list_top', type: 'video', assetUrl: 'https://placehold.co/728x90.png?text=健康讲座 (视频)', linkUrl: '/health-courses/diabetes-intro', startDate: subDays(new Date(), 10).toISOString(), endDate: subDays(new Date(), 1).toISOString(), status: 'expired' },
];

const adStatusOptions: {value: SaasAdvertisementStatus | 'all', label: string}[] = [
    {value: 'all', label: '所有状态'},
    {value: 'active', label: '投放中'},
    {value: 'inactive', label: '已暂停'},
    {value: 'scheduled', label: '待投放'},
    {value: 'expired', label: '已结束'},
];
const adTypeOptions: {value: SaasAdvertisementType | 'all', label: string}[] = [
    {value: 'all', label: '所有类型'},
    {value: 'image', label: '图片'},
    {value: 'video', label: '视频'},
    {value: 'html', label: 'HTML'},
];


export default function AdvertisementManagementPage() {
  const [advertisements, setAdvertisements] = useState<SaasAdvertisement[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdvertisement, setEditingAdvertisement] = useState<SaasAdvertisement | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSlot, setFilterSlot] = useState<string>("all");
  const [filterType, setFilterType] = useState<SaasAdvertisementType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<SaasAdvertisementStatus | "all">("all");
  
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setAdvertisements(mockInitialAdvertisements);
  }, []);

  const handleAddAdvertisement = () => {
    setEditingAdvertisement(null);
    setIsDialogOpen(true);
  };

  const handleEditAdvertisement = (ad: SaasAdvertisement) => {
    setEditingAdvertisement(ad);
    setIsDialogOpen(true);
  };

  const handleDeleteAdvertisement = (adId: string) => {
    if (window.confirm('确定要删除此广告吗？')) {
      setAdvertisements(prev => prev.filter(a => a.id !== adId));
      toast({ title: '删除成功', description: '广告已删除。' });
    }
  };
  
  const handleToggleAdvertisementStatus = (adId: string) => {
     setAdvertisements(prev => prev.map(ad => {
        if (ad.id === adId && ad.status !== 'expired') {
            return { ...ad, status: ad.status === 'active' ? 'inactive' : 'active' };
        }
        return ad;
     }));
     toast({ title: '状态已更新', description: `广告状态已切换。` });
  };

  const handleDialogSubmit = (data: SaasAdvertisement) => {
    if (editingAdvertisement) {
      setAdvertisements(prev => prev.map(ad => (ad.id === editingAdvertisement.id ? data : ad)));
      toast({ title: '更新成功', description: `广告 "${data.name}" 信息已更新。`});
    } else {
      setAdvertisements(prev => [data, ...prev]);
      toast({ title: '创建成功', description: `新广告 "${data.name}" 已添加。`});
    }
    setIsDialogOpen(false);
    setEditingAdvertisement(null);
  };
  
  const filteredAdvertisements = useMemo(() => {
    return advertisements.filter(ad => {
      const slotMatch = filterSlot === "all" || ad.adSlotId === filterSlot;
      const typeMatch = filterType === "all" || ad.type === filterType;
      const statusMatch = filterStatus === "all" || ad.status === filterStatus;
      const searchMatch = ad.name.toLowerCase().includes(searchTerm.toLowerCase());
      return slotMatch && typeMatch && statusMatch && searchMatch;
    });
  }, [advertisements, searchTerm, filterSlot, filterType, filterStatus]);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>广告管理</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载广告数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Presentation className="h-6 w-6 text-primary" />
            广告管理
          </CardTitle>
          <CardDescription>
            设置广告位，管理广告内容，支持图片、视频等多种广告形式。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border p-4 rounded-md space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="搜索广告名称..." className="pl-8 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <Select value={filterSlot} onValueChange={setFilterSlot}>
                  <SelectTrigger><Filter className="mr-2 h-4 w-4"/>广告位</SelectTrigger>
                  <SelectContent><SelectItem value="all">所有广告位</SelectItem>{mockAdSlots.map(slot => (<SelectItem key={slot.id} value={slot.id}>{slot.name}</SelectItem>))}</SelectContent>
              </Select>
              <Select value={filterType} onValueChange={(value) => setFilterType(value as SaasAdvertisementType | "all")}>
                  <SelectTrigger><Filter className="mr-2 h-4 w-4"/>素材类型</SelectTrigger>
                  <SelectContent>{adTypeOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as SaasAdvertisementStatus | "all")}>
                  <SelectTrigger><Filter className="mr-2 h-4 w-4"/>投放状态</SelectTrigger>
                  <SelectContent>{adStatusOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
              </Select>
              <div className="lg:col-start-4 flex justify-end">
                <Button onClick={handleAddAdvertisement} className="w-full lg:w-auto"><PlusCircle className="mr-2 h-4 w-4"/> 添加广告</Button>
              </div>
            </div>
          </div>
          
          <AdvertisementTable 
            advertisements={filteredAdvertisements} 
            onEdit={handleEditAdvertisement} 
            onDelete={handleDeleteAdvertisement}
            onToggleStatus={handleToggleAdvertisementStatus}
          />
        </CardContent>
      </Card>

      <AdvertisementDialog
        isOpen={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setEditingAdvertisement(null); }}
        onSubmit={handleDialogSubmit}
        advertisement={editingAdvertisement}
      />
    </div>
  );
}

    