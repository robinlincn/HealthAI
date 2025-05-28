
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
import { format, subDays, parseISO, startOfDay, endOfDay } from 'date-fns';

// Mock data for enterprises and service packages
const mockEnterprises: SaasEnterprise[] = [
  { id: 'ent-001', name: '示例医院A', contactPerson: '张三', creationDate: new Date().toISOString(), contactEmail:'a@a.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
  { id: 'ent-002', name: '健康管理中心B', contactPerson: '李四', creationDate: new Date().toISOString(), contactEmail:'b@b.com', contactPhone:'1',status:'active', assignedResources:{maxUsers:1,maxPatients:1,maxStorageGB:1}},
];
const mockProducts: SaasProduct[] = [
  { id: 'prod-001', enterpriseId: 'ent-001', name: '智能血糖仪套装', category: '医疗器械', price: 299.00, stock: 150, status: 'active', creationDate: new Date().toISOString()},
  { id: 'prod-002', enterpriseId: 'ent-001', name: '控糖膳食营养包 (7日)', category: '膳食包', price: 199.00, stock: 80, status: 'active', creationDate: new Date().toISOString()},
  { id: 'prod-003', enterpriseId: 'ent-002', name: '养心安神药膳包', category: '药膳包', price: 99.00, stock: 200, status: 'draft', creationDate: new Date().toISOString() },
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
  { 
    id: 'mord-004', orderNumber: 'SN202405170002', enterpriseId: 'ent-001', 
    customerId: 'patientUser007', customerName: '孙悟空',
    products: [ { productId: 'prod-001', productName: '智能血糖仪套装', quantity: 1, priceAtOrder: 299.00 } ],
    totalAmount: 299.00,
    status: 'delivered',
    orderDate: subDays(new Date(), 4).toISOString(),
    trackingNumber: 'YD987654321', carrier: '韵达快递',
    lastUpdatedAt: subDays(new Date(), 1).toISOString(),
    salespersonEmployeeId: 'emp-saas-001',
    salespersonName: '王医生 (医院A)',
  },
  { 
    id: 'mord-005', orderNumber: 'SN202405160011', enterpriseId: 'ent-002', 
    customerId: 'patientUser008', customerName: '猪八戒',
    products: [ { productId: 'prod-003', productName: '养心安神药膳包', quantity: 3, priceAtOrder: 99.00 } ],
    totalAmount: 297.00,
    status: 'completed',
    orderDate: subDays(new Date(), 5).toISOString(),
    lastUpdatedAt: subDays(new Date(), 3).toISOString(),
  },
];

const orderStatusOptions: { value: SaasMallOrderStatus | "all"; label: string }[] = [
  { value: "all", label: "所有状态" },
  { value: "pending_payment", label: "待支付" },
  { value: "paid", label: "已支付" },
  { value: "processing", label: "处理中" },
  { value: "shipped", label: "已发货" },
  { value: "delivered", label: "已送达" },
  { value: "completed", label: "已完成" },
  { value: "cancelled_user", label: "用户取消" },
  { value: "cancelled_admin", label: "管理员取消" },
  { value: "refund_pending", label: "退款中" },
  { value: "refunded", label: "已退款" },
  { value: "return_requested", label: "退货申请中" },
  { value: "return_approved", label: "退货已批准" },
  { value: "return_completed", label: "退货已完成" },
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
    toast({ title: "订单状态已更新", description: `订单 ${orderId} 状态已更新为 ${orderStatusOptions.find(opt=>opt.value===newStatus)?.label || newStatus}。`});
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
        const orderDateOnly = startOfDay(parseISO(order.orderDate)); // Use startOfDay for comparison
        const fromDateOnly = startOfDay(dateRange.from);
        dateMatch = orderDateOnly >= fromDateOnly;
      }
      if (dateRange?.to && order.orderDate && dateMatch) {
        const orderDateOnly = startOfDay(parseISO(order.orderDate)); // Use startOfDay for comparison
        const toDateOnly = endOfDay(dateRange.to); 
        dateMatch = orderDateOnly <= toDateOnly;
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
            查看和处理在线商城的商品订单，管理订单状态、发货、物流和售后。
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
                      {orderStatusOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
              <div className="lg:col-span-2"> {/* Date picker takes more space */}
                <Label htmlFor="mallOrderDateRange" className="block text-xs font-medium mb-1 text-muted-foreground">下单日期范围</Label>
                <DatePickerWithRange id="mallOrderDateRange" date={dateRange} onDateChange={setDateRange} className="w-full" />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto lg:self-end">
                <Button variant="outline" onClick={() => toast({title: '提示', description: '导出功能开发中'})} className="w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4"/>导出
                </Button>
              </div>
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

    
