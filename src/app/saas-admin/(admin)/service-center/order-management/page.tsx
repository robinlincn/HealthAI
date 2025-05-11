
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderTable } from "./components/OrderTable";
import { OrderDetailDialog } from "./components/OrderDetailDialog"; 
import type { SaasOrder, SaasEnterprise, SaasServicePackage } from '@/lib/types';
import { ShoppingCart, Search, Filter, CalendarDays, Briefcase, Download } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import type { DateRange } from 'react-day-picker';
import { addDays, format, subDays } from 'date-fns';


// Mock data for enterprises and service packages (reuse or adapt from other pages)
const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
];
const mockServicePackages: SaasServicePackage[] = [
  { id: 'pkg-001', name: '基础慢病管理套餐', type: 'basic', priceMonthly: 299, features:[], maxUsers:1, maxStorageGB:1, maxPatients:1, isEnabled:true },
  { id: 'pkg-002', name: '标准慢病协作套餐', type: 'standard', priceMonthly: 799, features:[], maxUsers:1, maxStorageGB:1, maxPatients:1, isEnabled:true },
];

const mockInitialOrders: SaasOrder[] = [
  { id: 'order-001', enterpriseId: 'ent-001', servicePackageId: 'pkg-001', orderDate: subDays(new Date(), 5).toISOString(), paymentStatus: 'paid', amount: 299, currency: 'CNY', billingCycle: 'monthly', renewalDate: addDays(new Date(), 25).toISOString(), enterpriseName: '示例医院A', servicePackageName: '基础慢病管理套餐' },
  { id: 'order-002', enterpriseId: 'ent-002', servicePackageId: 'pkg-002', orderDate: subDays(new Date(), 10).toISOString(), paymentStatus: 'pending', amount: 799, currency: 'CNY', billingCycle: 'monthly', enterpriseName: '健康管理中心B', servicePackageName: '标准慢病协作套餐' },
  { id: 'order-003', enterpriseId: 'ent-001', servicePackageId: 'pkg-002', orderDate: subDays(new Date(), 30).toISOString(), paymentStatus: 'paid', amount: 7990, currency: 'CNY', billingCycle: 'annually', renewalDate: addDays(new Date(), 335).toISOString(), transactionId: 'txn_abc123', enterpriseName: '示例医院A', servicePackageName: '标准慢病协作套餐' },
  { id: 'order-004', enterpriseId: 'ent-002', servicePackageId: 'pkg-001', orderDate: subDays(new Date(), 2).toISOString(), paymentStatus: 'failed', amount: 299, currency: 'CNY', billingCycle: 'monthly', notes: '支付网关错误', enterpriseName: '健康管理中心B', servicePackageName: '基础慢病管理套餐'},
];

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<SaasOrder[]>([]);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SaasOrder | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEnterprise, setFilterEnterprise] = useState<string>("all");
  const [filterPackage, setFilterPackage] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<SaasOrder['paymentStatus'] | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setOrders(mockInitialOrders);
  }, []);

  const handleViewDetails = (order: SaasOrder) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const enterpriseName = mockEnterprises.find(e => e.id === order.enterpriseId)?.name || '';
      const packageName = mockServicePackages.find(p => p.id === order.servicePackageId)?.name || '';

      const searchMatch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          enterpriseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (order.transactionId && order.transactionId.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const enterpriseMatch = filterEnterprise === "all" || order.enterpriseId === filterEnterprise;
      const packageMatch = filterPackage === "all" || order.servicePackageId === filterPackage;
      const statusMatch = filterStatus === "all" || order.paymentStatus === filterStatus;
      
      let dateMatch = true;
      if (dateRange?.from) {
        dateMatch = new Date(order.orderDate) >= dateRange.from;
      }
      if (dateRange?.to && dateMatch) {
        // Adjust 'to' date to include the whole day
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        dateMatch = new Date(order.orderDate) <= toDate;
      }

      return searchMatch && enterpriseMatch && packageMatch && statusMatch && dateMatch;
    });
  }, [orders, searchTerm, filterEnterprise, filterPackage, filterStatus, dateRange]);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>订单管理</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载订单数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ShoppingCart className="h-6 w-6 text-primary" />
            订单管理
          </CardTitle>
          <CardDescription>
            查看和管理企业/医院购买服务包的订单记录、支付状态和订阅周期。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            {/* First row of filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                  <Label htmlFor="orderSearch" className="sr-only">搜索订单</Label>
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                      id="orderSearch"
                      type="search"
                      placeholder="订单ID, 企业, 服务包, 交易ID..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 md:col-span-2">
                <Select value={filterEnterprise} onValueChange={setFilterEnterprise}>
                    <SelectTrigger className="w-full">
                        <Briefcase className="mr-2 h-4 w-4 text-muted-foreground"/>
                        <SelectValue placeholder="筛选企业" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">所有企业</SelectItem>
                        {mockEnterprises.map(ent => (
                            <SelectItem key={ent.id} value={ent.id}>{ent.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={filterPackage} onValueChange={setFilterPackage}>
                    <SelectTrigger className="w-full">
                        <Package className="mr-2 h-4 w-4 text-muted-foreground"/>
                        <SelectValue placeholder="筛选服务包" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">所有服务包</SelectItem>
                        {mockServicePackages.map(pkg => (
                            <SelectItem key={pkg.id} value={pkg.id}>{pkg.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>
            {/* Second row of filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <Label htmlFor="dateRangePickerOrders" className="block text-sm font-medium mb-1">订单日期范围</Label>
                <DatePickerWithRange date={dateRange} onDateChange={setDateRange} className="w-full" />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 md:items-end">
                  <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as SaasOrder['paymentStatus'] | "all")}>
                      <SelectTrigger className="w-full">
                          <Filter className="mr-2 h-4 w-4 text-muted-foreground"/>
                          <SelectValue placeholder="支付状态" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">所有状态</SelectItem>
                          <SelectItem value="paid">已支付</SelectItem>
                          <SelectItem value="pending">待支付</SelectItem>
                          <SelectItem value="failed">支付失败</SelectItem>
                          <SelectItem value="refunded">已退款</SelectItem>
                          <SelectItem value="processing">处理中</SelectItem>
                      </SelectContent>
                  </Select>
                  <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast({title: '提示', description: '导出功能开发中'})}><Download className="mr-2 h-4 w-4"/>导出</Button>
              </div>
            </div>
          </div>
          
          <OrderTable 
            orders={filteredOrders} 
            enterprises={mockEnterprises}
            servicePackages={mockServicePackages}
            onViewDetails={handleViewDetails}
          />
        </CardContent>
      </Card>

      <OrderDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        order={selectedOrder}
        enterprise={selectedOrder ? mockEnterprises.find(e => e.id === selectedOrder.enterpriseId) : null}
        servicePackage={selectedOrder ? mockServicePackages.find(p => p.id === selectedOrder.servicePackageId) : null}
      />
    </div>
  );
}
