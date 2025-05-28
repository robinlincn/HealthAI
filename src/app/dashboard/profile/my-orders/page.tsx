
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription as UiCardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListOrdered, Eye, X, ChevronRight, PackageSearch, ShoppingCart, CreditCard, Truck, RotateCcw, Star, Package, CheckCircle, AlertTriangle, PhoneCall, XCircle, Clock } from "lucide-react"; // Added Clock
import { format, parseISO, subDays } from "date-fns";
import { useToast } from '@/hooks/use-toast';
import type { SaasMallOrder, SaasMallOrderItem, SaasMallOrderStatus } from '@/lib/types';
import Image from 'next/image';

const MOCK_CURRENT_PATIENT_ID = "patientUser123"; // Example, replace with actual logic

// Mock products for order details (simplified)
const mockProductsData: Record<string, { name: string, image?: string, dataAiHint?: string }> = {
  "prod-001": { name: "家用智能血糖仪套装 (含50试纸)", image: "https://placehold.co/100x100.png?text=血糖仪", dataAiHint: "blood glucose meter" },
  "prod-002": { name: "高蛋白营养奶粉 (糖尿病适用)", image: "https://placehold.co/100x100.png?text=营养奶粉", dataAiHint: "protein powder" },
  "prod-004": { name: "无糖膳食纤维饼干 (2盒装)", image: "https://placehold.co/100x100.png?text=无糖饼干", dataAiHint: "sugar-free biscuits" },
  "prod-005": { name: "医用级一次性外科口罩 (50只)", image: "https://placehold.co/100x100.png?text=外科口罩", dataAiHint: "surgical masks" },
};


const mockPatientOrders: SaasMallOrder[] = [
  {
    id: "mord-user-001",
    orderNumber: "SN20240715001",
    enterpriseId: "ent-001", // Assuming these are enterprise IDs from SAAS context
    customerId: MOCK_CURRENT_PATIENT_ID,
    customerName: "示例用户",
    products: [
      { productId: "prod-001", productName: "家用智能血糖仪套装 (含50试纸)", quantity: 1, priceAtOrder: 299.00 },
      { productId: "prod-002", productName: "高蛋白营养奶粉 (糖尿病适用)", quantity: 1, priceAtOrder: 188.00 },
    ],
    totalAmount: 299.00 + 188.00,
    status: 'shipped',
    orderDate: subDays(new Date(), 5).toISOString(),
    paymentMethod: "微信支付",
    shippingAddress: { recipientName: "示例用户", phone: "13812345678", addressLine1: "示例省示例市健康路123号", city: "示例市", province: "示例省", postalCode: "100000" },
    shippingMethod: "顺丰速运",
    trackingNumber: "SF1234567890123",
    carrier: "顺丰",
    lastUpdatedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "mord-user-002",
    orderNumber: "SN20240710005",
    enterpriseId: "ent-001",
    customerId: MOCK_CURRENT_PATIENT_ID,
    customerName: "示例用户",
    products: [
      { productId: "prod-004", productName: "无糖膳食纤维饼干 (2盒装)", quantity: 3, priceAtOrder: 69.00 },
    ],
    totalAmount: 3 * 69.00,
    status: 'delivered',
    orderDate: subDays(new Date(), 10).toISOString(),
    paymentMethod: "支付宝",
    shippingAddress: { recipientName: "示例用户", phone: "13812345678", addressLine1: "示例省示例市健康路123号", city: "示例市", province: "示例省", postalCode: "100000" },
    shippingMethod: "普通快递",
    trackingNumber: "YD9876543210",
    carrier: "韵达",
    lastUpdatedAt: subDays(new Date(), 3).toISOString(),
  },
  {
    id: "mord-user-003",
    orderNumber: "SN20240718002",
    enterpriseId: "ent-001",
    customerId: MOCK_CURRENT_PATIENT_ID,
    customerName: "示例用户",
    products: [
      { productId: "prod-005", productName: "医用级一次性外科口罩 (50只)", quantity: 1, priceAtOrder: 45.00 },
    ],
    totalAmount: 45.00,
    status: 'pending_payment',
    orderDate: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
  },
   {
    id: "mord-user-004",
    orderNumber: "SN20240620003",
    enterpriseId: "ent-001",
    customerId: MOCK_CURRENT_PATIENT_ID,
    customerName: "示例用户",
    products: [
      { productId: "prod-003", productName: "便携式电子血压计 (臂式)", priceAtOrder: 239.00, quantity: 1 },
    ],
    totalAmount: 239.00,
    status: 'completed',
    orderDate: subDays(new Date(), 25).toISOString(),
    lastUpdatedAt: subDays(new Date(), 15).toISOString(),
  },
];

const orderStatusOptions: { value: SaasMallOrderStatus | "all"; label: string }[] = [
  { value: "all", label: "所有订单" },
  { value: "pending_payment", label: "待付款" },
  { value: "paid", label: "待发货" }, // "已支付" usually means "待发货" from user perspective
  { value: "processing", label: "处理中" }, // May not be shown to user directly
  { value: "shipped", label: "待收货" },
  { value: "delivered", label: "已送达" },
  { value: "completed", label: "已完成" },
  { value: "cancelled_user", label: "已取消" },
  { value: "cancelled_admin", label: "已取消(系统)" }, // Differentiate if needed
  { value: "refund_pending", label: "退款中" },
  { value: "refunded", label: "已退款" },
  { value: "return_requested", label: "退货申请中" },
  { value: "return_approved", label: "退货已批准" },
  { value: "return_completed", label: "退货已完成" },
];


export default function MyOrdersPage() {
  const [orders, setOrders] = useState<SaasMallOrder[]>(mockPatientOrders.filter(o => o.customerId === MOCK_CURRENT_PATIENT_ID));
  const [selectedOrder, setSelectedOrder] = useState<SaasMallOrder | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<SaasMallOrderStatus | "all">("all");
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredOrders = useMemo(() => {
    if (filterStatus === "all") return orders;
    return orders.filter(order => order.status === filterStatus);
  }, [orders, filterStatus]);

  const handleViewDetails = (order: SaasMallOrder) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };
  
  const getOrderStatusTextAndBadge = (status: SaasMallOrder['status']) => {
    let text = status;
    let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
    let badgeClasses = "";
    let Icon = AlertTriangle;

    switch (status) {
      case 'pending_payment': text = "待付款"; badgeVariant = "secondary"; badgeClasses = "bg-yellow-100 text-yellow-700 border-yellow-300"; Icon = Clock; break;
      case 'paid': text = "待发货"; badgeVariant = "default"; badgeClasses = "bg-blue-100 text-blue-700 border-blue-300"; Icon = Package; break;
      case 'processing': text = "处理中"; badgeVariant = "default"; badgeClasses = "bg-sky-100 text-sky-700 border-sky-300"; Icon = Package; break;
      case 'shipped': text = "待收货"; badgeVariant = "default"; badgeClasses = "bg-indigo-100 text-indigo-700 border-indigo-300"; Icon = Truck; break;
      case 'delivered': text = "已送达"; badgeVariant = "default"; badgeClasses = "bg-teal-100 text-teal-700 border-teal-300"; Icon = CheckCircle; break;
      case 'completed': text = "已完成"; badgeVariant = "default"; badgeClasses = "bg-green-100 text-green-700 border-green-300"; Icon = CheckCircle; break;
      case 'cancelled_user': 
      case 'cancelled_admin': text = "已取消"; badgeVariant = "outline"; badgeClasses = "text-gray-600 border-gray-400"; Icon = XCircle; break;
      case 'refund_pending': text = "退款中"; badgeVariant = "secondary"; badgeClasses = "bg-orange-100 text-orange-700 border-orange-300"; Icon = RotateCcw; break;
      case 'refunded': text = "已退款"; badgeVariant = "default"; badgeClasses = "bg-pink-100 text-pink-700 border-pink-300"; Icon = CheckCircle; break;
      case 'return_requested': text = "退货中"; badgeVariant = "secondary"; badgeClasses = "bg-purple-100 text-purple-600 border-purple-300"; Icon = RotateCcw; break;
      case 'return_approved': text = "退货已批准"; badgeVariant = "default"; badgeClasses = "bg-purple-100 text-purple-700 border-purple-300"; Icon = CheckCircle; break;
      case 'return_completed': text = "退货已完成"; badgeVariant = "default"; badgeClasses = "bg-purple-100 text-purple-700 border-purple-300"; Icon = CheckCircle; break;
      default: text = "未知状态"; Icon = AlertTriangle; break;
    }
    return <Badge variant={badgeVariant} className={`text-xs ${badgeClasses}`}><Icon className="mr-1 h-3 w-3"/>{text}</Badge>;
  };

  const handleOrderAction = (orderId: string, action: string, newStatus?: SaasMallOrderStatus) => {
    toast({ title: "操作提示 (模拟)", description: `订单 ${orderId} 已执行 "${action}" 操作。实际功能开发中。` });
    if (newStatus) {
      setOrders(prev => prev.map(o => o.id === orderId ? {...o, status: newStatus} : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? {...prev, status: newStatus} : null);
      }
    }
  };

  return (
    <div className="space-y-4">
      <UiCardDescription className="p-0 m-0 text-center sr-only">我的订单列表</UiCardDescription> 
      <Card className="shadow-sm">
        <CardHeader className="p-4 flex flex-row justify-between items-center">
          <CardTitle className="text-base flex items-center">
            <ListOrdered className="mr-2 h-5 w-5 text-muted-foreground" />
            我的订单
          </CardTitle>
          <div className="w-40">
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as SaasMallOrderStatus | "all")}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="筛选状态" />
              </SelectTrigger>
              <SelectContent>
                {orderStatusOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isClient && filteredOrders.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-15rem)] sm:h-[calc(100vh-16rem)]"> 
              <div className="space-y-3 p-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="shadow-xs hover:shadow-sm transition-shadow">
                    <CardHeader className="p-3 pb-2">
                      <div className="flex justify-between items-start">
                        <p className="text-xs text-muted-foreground">订单号: {order.orderNumber}</p>
                        {getOrderStatusTextAndBadge(order.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        下单时间: {isClient ? format(parseISO(order.orderDate), "yyyy-MM-dd HH:mm") : "..."}
                      </p>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <PackageSearch className="h-4 w-4 text-muted-foreground flex-shrink-0"/>
                        <p className="text-sm font-medium truncate">
                          {order.products[0]?.productName} 
                          {order.products.length > 1 && ` 等${order.products.length}件商品`}
                        </p>
                      </div>
                       <p className="text-sm font-semibold text-right">总计: ¥{order.totalAmount.toFixed(2)}</p>
                    </CardContent>
                    <CardFooter className="p-3 border-t flex justify-end">
                      <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => handleViewDetails(order)}>
                        <Eye className="mr-1 h-3 w-3" /> 查看详情
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : isClient && filteredOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-10 text-sm">暂无符合条件的订单。</p>
          ) : (
            <p className="text-muted-foreground text-center py-10 text-sm">正在加载订单...</p>
          )}
        </CardContent>
      </Card>

      {selectedOrder && isClient && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-lg">订单详情: {selectedOrder.orderNumber}</DialogTitle>
              <div className="text-xs text-muted-foreground">
                状态: {getOrderStatusTextAndBadge(selectedOrder.status)} | 下单于: {format(parseISO(selectedOrder.orderDate), "yyyy-MM-dd HH:mm")}
              </div>
            </DialogHeader>
            <ScrollArea className="flex-grow pr-3">
              <div className="space-y-3 text-sm py-2">
                <h4 className="font-semibold text-sm">商品列表</h4>
                <Table>
                  <TableHeader><TableRow><TableHead className="p-1.5">商品</TableHead><TableHead className="text-center p-1.5">数量</TableHead><TableHead className="text-right p-1.5">小计</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {selectedOrder.products.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="py-1 px-1.5">
                          <div className="flex items-center text-xs">
                             {mockProductsData[item.productId]?.image ? (
                                <Image src={mockProductsData[item.productId]?.image as string} alt={item.productName} width={32} height={32} className="h-8 w-8 rounded-md mr-1.5 object-cover" data-ai-hint={mockProductsData[item.productId]?.dataAiHint || "product"} />
                            ) : (
                                <Package className="h-4 w-4 mr-1.5 text-muted-foreground"/>
                            )}
                            <span className="truncate max-w-[120px] sm:max-w-[150px]">{item.productName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-1 px-1.5 text-xs">{item.quantity}</TableCell>
                        <TableCell className="text-right py-1 px-1.5 text-xs">¥{(item.quantity * item.priceAtOrder).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="text-right font-semibold text-base mt-1">订单总额: <span className="text-primary">¥{selectedOrder.totalAmount.toFixed(2)}</span></p>
                
                {selectedOrder.shippingAddress && (
                    <>
                        <h4 className="font-semibold text-sm pt-2">收货信息</h4>
                        <div className="text-xs bg-muted/30 p-2 rounded-md space-y-0.5">
                            <p>{selectedOrder.shippingAddress.recipientName}, {selectedOrder.shippingAddress.phone}</p>
                            <p>{selectedOrder.shippingAddress.province} {selectedOrder.shippingAddress.city} {selectedOrder.shippingAddress.addressLine1}</p>
                            {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                            <p>邮编: {selectedOrder.shippingAddress.postalCode}</p>
                        </div>
                    </>
                )}
                 <h4 className="font-semibold text-sm pt-2">支付与配送</h4>
                 <div className="text-xs space-y-0.5">
                    <p><strong>支付方式:</strong> {selectedOrder.paymentMethod || 'N/A'}</p>
                    {selectedOrder.paymentTransactionId && <p><strong>支付交易号:</strong> {selectedOrder.paymentTransactionId}</p>}
                    <p><strong>配送方式:</strong> {selectedOrder.shippingMethod || 'N/A'}</p>
                    {selectedOrder.shippingFee !== undefined && <p><strong>运费:</strong> ¥{selectedOrder.shippingFee.toFixed(2)}</p>}
                    <p><strong>承运商:</strong> {selectedOrder.carrier || 'N/A'}</p>
                    <p><strong>运单号:</strong> {selectedOrder.trackingNumber || 'N/A'}</p>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="mt-auto pt-3 border-t flex-wrap justify-end gap-2">
                 {selectedOrder.status === 'pending_payment' && (
                    <Button size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90" onClick={() => handleOrderAction(selectedOrder.id, "去支付", "paid")}>
                        <CreditCard className="mr-1 h-3.5 w-3.5"/>去支付 (模拟)
                    </Button>
                )}
                {selectedOrder.status === 'pending_payment' && (
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleOrderAction(selectedOrder.id, "取消订单", "cancelled_user")}>
                        <XCircle className="mr-1 h-3.5 w-3.5"/>取消订单
                    </Button>
                )}
                {selectedOrder.status === 'shipped' && (
                    <Button size="sm" className="h-8 text-xs" onClick={() => handleOrderAction(selectedOrder.id, "确认收货", "delivered")}>
                        <Truck className="mr-1 h-3.5 w-3.5"/>确认收货
                    </Button>
                )}
                 {(selectedOrder.status === 'delivered' || selectedOrder.status === 'completed') && (
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleOrderAction(selectedOrder.id, "评价订单")}>
                        <Star className="mr-1 h-3.5 w-3.5"/>评价订单
                    </Button>
                )}
                {(selectedOrder.status === 'delivered' || selectedOrder.status === 'completed') && (
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleOrderAction(selectedOrder.id, "申请售后")}>
                        <RotateCcw className="mr-1 h-3.5 w-3.5"/>申请售后
                    </Button>
                )}
              <DialogClose asChild>
                <Button type="button" variant="secondary" size="sm" className="h-8 text-xs">关闭</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

    
