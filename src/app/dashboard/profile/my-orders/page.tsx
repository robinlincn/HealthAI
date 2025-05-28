"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListOrdered, Eye, X, ChevronRight, PackageSearch, ShoppingCart, CreditCard, Truck, RotateCcw, Star } from "lucide-react";
import { format, parseISO, subDays } from "date-fns";
import { useToast } from '@/hooks/use-toast';
import type { SaasMallOrder, SaasMallOrderItem, SaasMallOrderStatus } from '@/lib/types'; // Ensure SaasMallOrder is comprehensive

const MOCK_CURRENT_PATIENT_ID = "patientUser123"; // Assume this is the logged-in patient's ID

const mockPatientOrders: SaasMallOrder[] = [
  {
    id: "mord-user-001",
    orderNumber: "SN20240715001",
    enterpriseId: "ent-001", // Not directly displayed to user but useful for context
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
      { productId: "prod-003", productName: "便携式电子血压计 (臂式)", quantity: 1, priceAtOrder: 239.00 },
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
  { value: "paid", label: "待发货" }, // Simplified for patient view
  { value: "shipped", label: "待收货" },
  { value: "delivered", label: "已送达" }, // Or can be "待评价"
  { value: "completed", label: "已完成" },
  { value: "cancelled_user", label: "已取消" },
  { value: "cancelled_admin", label: "已取消(系统)" },
  { value: "refunded", label: "已退款/售后" },
];

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<SaasMallOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<SaasMallOrder | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<SaasMallOrderStatus | "all">("all");
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    // In a real app, fetch orders for the current patient
    setOrders(mockPatientOrders.filter(o => o.customerId === MOCK_CURRENT_PATIENT_ID).sort((a, b) => parseISO(b.orderDate).getTime() - parseISO(a.orderDate).getTime()));
  }, []);

  const filteredOrders = useMemo(() => {
    if (filterStatus === "all") return orders;
    return orders.filter(order => order.status === filterStatus);
  }, [orders, filterStatus]);

  const handleViewDetails = (order: SaasMallOrder) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };
  
  const getOrderStatusTextAndBadge = (status: SaasMallOrderStatus) => {
    let text = status;
    let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
    let badgeClasses = "";

    switch (status) {
      case 'pending_payment': text = "待付款"; badgeVariant = "secondary"; badgeClasses = "bg-yellow-500 hover:bg-yellow-600 text-white"; break;
      case 'paid': text = "待发货"; badgeVariant = "default"; badgeClasses = "bg-blue-500 hover:bg-blue-600"; break;
      case 'processing': text = "处理中"; badgeVariant = "default"; badgeClasses = "bg-sky-500 hover:bg-sky-600"; break;
      case 'shipped': text = "待收货"; badgeVariant = "default"; badgeClasses = "bg-indigo-500 hover:bg-indigo-600"; break;
      case 'delivered': text = "已送达"; badgeVariant = "default"; badgeClasses = "bg-teal-500 hover:bg-teal-600"; break;
      case 'completed': text = "已完成"; badgeVariant = "default"; badgeClasses = "bg-green-500 hover:bg-green-600"; break;
      case 'cancelled_user': 
      case 'cancelled_admin': text = "已取消"; badgeVariant = "outline"; badgeClasses = "text-gray-600 border-gray-400"; break;
      case 'refund_pending': text = "退款中"; badgeVariant = "secondary"; badgeClasses = "bg-orange-500 hover:bg-orange-600"; break;
      case 'refunded': text = "已退款"; badgeVariant = "default"; badgeClasses = "bg-pink-500 hover:bg-pink-600"; break;
      default: text = "未知状态"; break;
    }
    return <Badge variant={badgeVariant} className={`text-xs ${badgeClasses}`}>{text}</Badge>;
  };

  const handleOrderAction = (action: string) => {
    toast({ title: "操作提示 (模拟)", description: `已执行 "${action}" 操作。此功能正在完善中。` });
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardHeader className="p-4 flex flex-row justify-between items-center">
          <CardTitle className="text-base flex items-center">
            <ListOrdered className="mr-2 h-5 w-5 text-primary" />
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
            <ScrollArea className="h-[calc(100vh-15rem)] sm:h-[calc(100vh-16rem)]"> {/* Adjusted height */}
              <div className="space-y-3 p-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="shadow-xs hover:shadow-sm transition-shadow">
                    <CardHeader className="p-3 pb-2">
                      <div className="flex justify-between items-start">
                        <p className="text-xs text-muted-foreground">订单号: {order.orderNumber}</p>
                        {getOrderStatusTextAndBadge(order.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        下单时间: {format(parseISO(order.orderDate), "yyyy-MM-dd HH:mm")}
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

      {selectedOrder && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-lg">订单详情: {selectedOrder.orderNumber}</DialogTitle>
              <DialogDescription className="text-xs">
                状态: {getOrderStatusTextAndBadge(selectedOrder.status)} | 下单于: {format(parseISO(selectedOrder.orderDate), "yyyy-MM-dd HH:mm")}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-grow pr-3">
              <div className="space-y-3 text-sm py-2">
                <h4 className="font-semibold text-sm">商品列表</h4>
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow><TableHead>商品</TableHead><TableHead className="text-center">数量</TableHead><TableHead className="text-right">小计</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.products.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="py-1">{item.productName}</TableCell>
                        <TableCell className="text-center py-1">{item.quantity}</TableCell>
                        <TableCell className="text-right py-1">¥{(item.quantity * item.priceAtOrder).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="text-right font-semibold">订单总额: ¥{selectedOrder.totalAmount.toFixed(2)}</p>
                
                {selectedOrder.shippingAddress && (
                    <>
                        <h4 className="font-semibold text-sm pt-2">收货信息</h4>
                        <div className="text-xs bg-muted/50 p-2 rounded-md space-y-0.5">
                            <p>{selectedOrder.shippingAddress.recipientName}, {selectedOrder.shippingAddress.phone}</p>
                            <p>{selectedOrder.shippingAddress.province} {selectedOrder.shippingAddress.city}</p>
                            <p>{selectedOrder.shippingAddress.addressLine1}</p>
                            {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                            <p>邮编: {selectedOrder.shippingAddress.postalCode}</p>
                        </div>
                    </>
                )}
                <h4 className="font-semibold text-sm pt-2">支付与配送</h4>
                <div className="text-xs space-y-0.5">
                    <p>支付方式: {selectedOrder.paymentMethod || "N/A"}</p>
                    <p>配送方式: {selectedOrder.shippingMethod || "N/A"}</p>
                    {selectedOrder.trackingNumber && <p>运单号: {selectedOrder.trackingNumber} ({selectedOrder.carrier || '未知物流'})</p>}
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="mt-auto pt-3 border-t flex-wrap justify-end gap-2">
                {selectedOrder.status === 'pending_payment' && (
                    <Button size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90" onClick={() => handleOrderAction("去支付")}>
                        <CreditCard className="mr-1 h-3.5 w-3.5"/>去支付
                    </Button>
                )}
                {(selectedOrder.status === 'pending_payment' || selectedOrder.status === 'paid' || selectedOrder.status === 'processing') && (
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleOrderAction("取消订单")}>
                        <X className="mr-1 h-3.5 w-3.5"/>取消订单
                    </Button>
                )}
                 {selectedOrder.status === 'shipped' && (
                    <Button size="sm" className="h-8 text-xs" onClick={() => handleOrderAction("确认收货")}>
                        <Truck className="mr-1 h-3.5 w-3.5"/>确认收货
                    </Button>
                )}
                 {selectedOrder.status === 'delivered' && (
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleOrderAction("评价订单")}>
                        <Star className="mr-1 h-3.5 w-3.5"/>评价订单
                    </Button>
                )}
                {(selectedOrder.status === 'delivered' || selectedOrder.status === 'completed') && (
                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleOrderAction("申请售后")}>
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
