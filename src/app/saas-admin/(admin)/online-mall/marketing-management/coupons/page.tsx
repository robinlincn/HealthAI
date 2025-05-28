
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CouponTable } from "./components/CouponTable";
import { CouponDialog } from "./components/CouponDialog";
import type { SaasCoupon, SaasEnterprise, SaasCouponStatus, SaasCouponType } from '@/lib/types';
import { Ticket, PlusCircle, Search, Filter, Briefcase, ListFilter } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { subDays, addDays, format, parseISO } from 'date-fns';
import { Label } from '@/components/ui/label';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import type { DateRange } from 'react-day-picker';

// Mock data
const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四', creationDate: new Date().toISOString(), contactEmail:'b@b.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
];

const mockInitialCoupons: SaasCoupon[] = [
  { id: 'coupon-001', name: '新用户专享10元券', code: 'NEWUSER10', type: 'fixed_amount', value: 10, enterpriseId: 'ent-001', validFrom: subDays(new Date(), 10).toISOString(), validTo: addDays(new Date(), 20).toISOString(), status: 'active', minPurchaseAmount: 50, totalUsed: 5, maxUses: 100, usesPerUser: 1 },
  { id: 'coupon-002', name: '全场9折优惠', code: 'SALE90', type: 'percentage', value: 0.1, validFrom: new Date().toISOString(), validTo: addDays(new Date(), 7).toISOString(), status: 'active', totalUsed: 20 },
  { id: 'coupon-003', name: '健康节50元代金券', code: 'HEALTH50', type: 'fixed_amount', value: 50, enterpriseId: 'ent-002', validFrom: subDays(new Date(), 30).toISOString(), validTo: subDays(new Date(), 1).toISOString(), status: 'expired', minPurchaseAmount: 200 },
];

const couponStatusOptions: {value: SaasCouponStatus | 'all', label: string}[] = [
    {value: 'all', label: '所有状态'},
    {value: 'active', label: '有效'},
    {value: 'inactive', label: '未激活'},
    {value: 'expired', label: '已过期'},
    {value: 'used_up', label: '已用完'},
];
const couponTypeOptions: {value: SaasCouponType | 'all', label: string}[] = [
    {value: 'all', label: '所有类型'},
    {value: 'fixed_amount', label: '固定金额'},
    {value: 'percentage', label: '百分比折扣'},
];


export default function CouponManagementPage() {
  const [coupons, setCoupons] = useState<SaasCoupon[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<SaasCoupon | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEnterpriseId, setFilterEnterpriseId] = useState<string>("all");
  const [filterType, setFilterType] = useState<SaasCouponType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<SaasCouponStatus | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setCoupons(mockInitialCoupons);
  }, []);

  const handleAddCoupon = () => {
    setEditingCoupon(null);
    setIsDialogOpen(true);
  };

  const handleEditCoupon = (coupon: SaasCoupon) => {
    setEditingCoupon(coupon);
    setIsDialogOpen(true);
  };

  const handleDeleteCoupon = (couponId: string) => {
    if (window.confirm('确定要删除此优惠券吗？')) {
      setCoupons(prev => prev.filter(c => c.id !== couponId));
      toast({ title: '删除成功', description: '优惠券已删除。' });
    }
  };
  
  const handleToggleCouponStatus = (couponId: string) => {
     setCoupons(prev => prev.map(c => {
        if (c.id === couponId && c.status !== 'expired' && c.status !== 'used_up') {
            return { ...c, status: c.status === 'active' ? 'inactive' : 'active' };
        }
        return c;
     }));
     toast({ title: '状态已更新', description: `优惠券状态已切换。` });
  };

  const handleDialogSubmit = (data: SaasCoupon) => {
    if (editingCoupon) {
      setCoupons(prev => prev.map(c => (c.id === editingCoupon.id ? data : c)));
      toast({ title: '更新成功', description: `优惠券 "${data.name}" 信息已更新。`});
    } else {
      setCoupons(prev => [data, ...prev].sort((a,b) => parseISO(b.validFrom).getTime() - parseISO(a.validFrom).getTime()));
      toast({ title: '创建成功', description: `新优惠券 "${data.name}" 已添加。`});
    }
    setIsDialogOpen(false);
    setEditingCoupon(null);
  };
  
  const filteredCoupons = useMemo(() => {
    return coupons.filter(coupon => {
      const enterpriseMatch = filterEnterpriseId === "all" || coupon.enterpriseId === filterEnterpriseId || (!coupon.enterpriseId && filterEnterpriseId === "platform");
      const typeMatch = filterType === "all" || coupon.type === filterType;
      const statusMatch = filterStatus === "all" || coupon.status === filterStatus;
      const searchMatch = coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
      let dateMatch = true;
      if (dateRange?.from && coupon.validFrom) {
          dateMatch = parseISO(coupon.validFrom) >= dateRange.from;
      }
      if (dateRange?.to && coupon.validTo && dateMatch) {
          dateMatch = parseISO(coupon.validTo) <= addDays(dateRange.to, 1); // Include the whole 'to' day
      }
      return enterpriseMatch && typeMatch && statusMatch && searchMatch && dateMatch;
    });
  }, [coupons, searchTerm, filterEnterpriseId, filterType, filterStatus, dateRange]);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>优惠券管理</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载优惠券数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Ticket className="h-6 w-6 text-primary" />
            优惠券管理
          </CardTitle>
          <CardDescription>
            生成、发放和管理商城的优惠券，设置使用条件和有效期。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border p-4 rounded-md space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="券名称, 券码..." className="pl-8 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <Select value={filterEnterpriseId} onValueChange={setFilterEnterpriseId}>
                <SelectTrigger><Briefcase className="mr-2 h-4 w-4"/>所属企业</SelectTrigger>
                <SelectContent><SelectItem value="all">所有企业</SelectItem><SelectItem value="platform">平台通用</SelectItem>{mockEnterprises.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}</SelectContent>
              </Select>
              <Select value={filterType} onValueChange={(value) => setFilterType(value as SaasCouponType | "all")}>
                <SelectTrigger><ListFilter className="mr-2 h-4 w-4"/>券类型</SelectTrigger>
                <SelectContent>{couponTypeOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
              </Select>
              <div className="lg:col-span-2">
                <Label htmlFor="couponDateRange" className="block text-xs font-medium mb-1 text-muted-foreground">有效期范围</Label>
                <DatePickerWithRange id="couponDateRange" date={dateRange} onDateChange={setDateRange} className="w-full" />
              </div>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as SaasCouponStatus | "all")}>
                <SelectTrigger><Filter className="mr-2 h-4 w-4"/>状态</SelectTrigger>
                <SelectContent>{couponStatusOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
              </Select>
              <div className="flex justify-end">
                <Button onClick={handleAddCoupon} className="w-full lg:w-auto"><PlusCircle className="mr-2 h-4 w-4"/> 添加优惠券</Button>
              </div>
            </div>
          </div>
          
          <CouponTable 
            coupons={filteredCoupons} 
            onEdit={handleEditCoupon} 
            onDelete={handleDeleteCoupon}
            onToggleStatus={handleToggleCouponStatus}
          />
        </CardContent>
      </Card>

      <CouponDialog
        isOpen={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setEditingCoupon(null); }}
        onSubmit={handleDialogSubmit}
        coupon={editingCoupon}
        enterprises={mockEnterprises}
      />
    </div>
  );
}

    