
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MallOrderTable } from "./components/MallOrderTable";
import { MallOrderDetailDialog } from "./components/MallOrderDetailDialog"; 
import type { SaasMallOrder, SaasEnterprise, SaasProduct, SaasMallOrderStatus, SaasEmployee } from '@/lib/types';
import { ShoppingCart, Search, Filter, CalendarDays, Briefcase, Download, Package } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import type { DateRange } from 'react-day-picker';
import { addDays, format, subDays, parseISO } from 'date-fns';


// Mock data for enterprises and service packages (reuse or adapt from other pages)
const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四', creationDate: new Date().toISOString(), contactEmail:'b@b.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
];
const mockProducts: SaasProduct[] = [
  { id: 'prod-001', enterpriseId: 'ent-001', name: '智能血糖仪套装', category: '医疗器械', price: 299.00, stock: 150, status: 'active', creationDate: new Date().toISOString()},
  { id: 'prod-002', enterpriseId: 'ent-001', name: '控糖膳食营养包 (7日)', category: '膳食包', price: 199.00, stock: 80, status: 'active', creationDate: new Date().toISOString()},
];
const mockEmployees: SaasEmployee[] = [
    { id: 'emp-saas-001', enterpriseId: 'ent-001', name: '王医生 (医院A)', email: 'wang@hospitala.com', status: 'active', joinDate: new Date().toISOString(), creationDate: new Date().toISOString() },
    { id: 'emp-saas-002', enterpriseId: 'ent-001', name: '李护士 (医院A)', email: 'li@hospitala.com', status: 'active', joinDate: new Date().toISOString(), creationDate: new Date().toISOString() },
];


const mockInitialMallOrders: SaasMallOrder[] = [
  { 
    id: 'mord-001', orderNumber: 'SN202405190001', enterpriseId: 'ent-001', 
    customerId: 'patientUser123', customerName: '王小明', customerContact: '13800138000',
    products: [
      { productId: 'prod-001', productName: '智能血糖仪套装', quantity: 1, priceAtOrder: 299.00 },
      { productId: 'prod-002', productName: '控糖膳食营养包 (7日)', quantity: 2, priceAtOrder: 199.00 },
    ],
    totalAmount: 299.00 + (2 * 199.00),
    status: 'paid',
    orderDate: subDays(new Date(), 2).toISOString(),
    paymentMethod: '微信支付',
    shippingAddress: { recipientName: '王小明', phone: '13800138000', addressLine1: '示例市健康路101号', city: '示例市', province: '示例省', postalCode: '100000'},
    shippingMethod: '顺丰快递',
    lastUpdatedAt: subDays(new Date(), 1).toISOString(),
    salespersonEmployeeId: 'emp-saas-001',
    salespersonName: '王医生 (医院A)',
  },
  { 
    id: 'mord-002', orderNumber: 'SN202405180007', enterpriseId: 'ent-002', 
    customerId: 'patientUser456', customerName: '李小红',
    products: [ { productId: 'prod-001', productName: '智能血糖仪套装', quantity: 1, priceAtOrder: 288.00 } ],
    totalAmount: 288.00,
    status: 'shipped',
    orderDate: subDays(new Date(), 3).toISOString(),
    trackingNumber: 'SF123456789', carrier: '顺丰快递',
    lastUpdatedAt: subDays(new Date(), 2).toISOString(),
  },
    { 
    id: 'mord-003', orderNumber: 'SN202405200001', enterpriseId: 'ent-001', 
    customerId: 'patientUser789', customerName: '赵大勇',
    products: [ { productId: 'prod-002', productName: '控糖膳食营养包 (7日)', quantity: 1, priceAtOrder: 199.00 } ],
    totalAmount: 199.00,
    status: 'pending_payment',
    orderDate: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    salespersonEmployeeId: 'emp-saas-002',
    salespersonName: '李护士 (医院A)',
  },
];

export default function MallOrderManagementPage() {
  const [mallOrders, setMallOrders] = useState<SaasMallOrder[]>([]);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SaasMallOrder | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEnterprise, setFilterEnterprise] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<SaasMallOrderStatus | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: subDays(new Date(), 30), to: new Date()});

  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    setMallOrders(mockInitialMallOrders);
  }, []);

  const handleViewDetails = (order: SaasMallOrder) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: SaasMallOrderStatus, trackingNumber?: string) => {
    setMallOrders(prevOrders => prevOrders.map(o => 
      o.id === orderId ? { ...o, status: newStatus, trackingNumber: trackingNumber || o.trackingNumber, lastUpdatedAt: new Date().toISOString() } : o
    ));
    toast({ title: "订单状态已更新", description: `订单 ${orderId} 状态已更新为 ${newStatus}。`});
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? {...prev, status: newStatus, trackingNumber: trackingNumber || prev.trackingNumber, lastUpdatedAt: new Date().toISOString()} : null);
    }
  };

  const filteredOrders = useMemo(() => {
    return mallOrders.filter(order => {
      const enterpriseName = mockEnterprises.find(e => e.id === order.enterpriseId)?.name || '';
      const searchMatch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          enterpriseName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const enterpriseMatch = filterEnterprise === "all" || order.enterpriseId === filterEnterprise;
      const statusMatch = filterStatus === "all" || order.status === filterStatus;
      
      let dateMatch = true;
      if (dateRange?.from && order.orderDate) {
        dateMatch = new Date(order.orderDate) >= dateRange.from;
      }
      if (dateRange?.to && order.orderDate && dateMatch) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        dateMatch = new Date(order.orderDate) <= toDate;
      }

      return searchMatch && enterpriseMatch && statusMatch && dateMatch;
    });
  }, [mallOrders, searchTerm, filterEnterprise, filterStatus, dateRange]);

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card><CardHeader><CardTitle>商城订单管理</CardTitle></CardHeader><CardContent><p className="text-center p-8 text-muted-foreground">正在加载订单数据...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ShoppingCart className="h-6 w-6 text-primary" />
            商城订单管理
          </CardTitle>
          <CardDescription>
            查看和处理在线商城的商品订单，管理订单状态、发货等。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border p-4 rounded-md space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="relative lg:col-span-1">
                  <Label htmlFor="mallOrderSearch" className="sr-only">搜索订单</Label>
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                      id="mallOrderSearch" type="search" placeholder="订单号, 客户名, 企业..."
                      className="pl-8 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <Select value={filterEnterprise} onValueChange={setFilterEnterprise}>
                  <SelectTrigger><Briefcase className="mr-2 h-4 w-4"/>企业筛选</SelectTrigger>
                  <SelectContent><SelectItem value="all">所有企业</SelectItem>{mockEnterprises.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}</SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as SaasMallOrderStatus | "all")}>
                  <SelectTrigger><Filter className="mr-2 h-4 w-4"/>订单状态</SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">所有状态</SelectItem>
                      <SelectItem value="pending_payment">待支付</SelectItem>
                      <SelectItem value="paid">已支付</SelectItem>
                      <SelectItem value="processing">处理中</SelectItem>
                      <SelectItem value="shipped">已发货</SelectItem>
                      <SelectItem value="delivered">已送达</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="cancelled_user">用户取消</SelectItem>
                      <SelectItem value="cancelled_admin">管理员取消</SelectItem>
                      <SelectItem value="refund_pending">退款中</SelectItem>
                      <SelectItem value="refunded">已退款</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
              <div className="lg:col-span-2">
                <Label htmlFor="mallOrderDateRange" className="block text-xs font-medium mb-1 text-muted-foreground">下单日期范围</Label>
                <DatePickerWithRange id="mallOrderDateRange" date={dateRange} onDateChange={setDateRange} className="w-full" />
              </div>
              <Button variant="outline" onClick={() => toast({title: '提示', description: '导出功能开发中'})} className="w-full lg:w-auto self-end">
                <Download className="mr-2 h-4 w-4"/>导出订单
              </Button>
            </div>
          </div>
          
          <MallOrderTable 
            orders={filteredOrders} 
            enterprises={mockEnterprises}
            employees={mockEmployees}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
          />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
            <CardHeader><CardTitle className="text-lg">物流管理 (占位)</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">设置物流模板、对接物流公司、打印发货单等功能开发中。</p></CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle className="text-lg">售后处理 (占位)</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">退款申请、退换货处理、纠纷仲裁等功能开发中。</p></CardContent>
        </Card>
      </div>

      <MallOrderDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        order={selectedOrder}
        enterprise={selectedOrder ? mockEnterprises.find(e => e.id === selectedOrder.enterpriseId) : null}
        productsData={mockProducts}
        employeesData={mockEmployees}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
