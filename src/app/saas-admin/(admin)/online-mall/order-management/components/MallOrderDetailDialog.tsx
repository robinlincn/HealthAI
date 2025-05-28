
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SaasMallOrder, SaasEnterprise, SaasProduct, SaasEmployee, SaasMallOrderStatus } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Truck, Edit, Users, Package, FileText, UserCircle } from "lucide-react";

interface MallOrderDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: SaasMallOrder | null;
  enterprise?: SaasEnterprise | null;
  productsData?: SaasProduct[]; 
  employeesData?: SaasEmployee[];
  onUpdateStatus: (orderId: string, newStatus: SaasMallOrder['status'], trackingNumber?: string) => void;
}

export function MallOrderDetailDialog({ 
    isOpen, 
    onClose, 
    order, 
    enterprise, 
    productsData, 
    employeesData, 
    onUpdateStatus 
}: MallOrderDetailDialogProps) {
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (order) {
        setTrackingNumberInput(order.trackingNumber || '');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const getOrderStatusBadge = (status: SaasMallOrder['status']) => {
    switch (status) {
        case 'pending_payment': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">待支付</Badge>;
        case 'paid': return <Badge className="bg-blue-100 text-blue-700">已支付</Badge>;
        case 'processing': return <Badge className="bg-sky-100 text-sky-700">处理中</Badge>;
        case 'shipped': return <Badge className="bg-indigo-100 text-indigo-700">已发货</Badge>;
        case 'delivered': return <Badge className="bg-teal-100 text-teal-700">已送达</Badge>;
        case 'completed': return <Badge className="bg-green-100 text-green-700">已完成</Badge>;
        case 'cancelled_user': case 'cancelled_admin': return <Badge variant="outline" className="text-gray-600">已取消</Badge>;
        case 'refund_pending': return <Badge variant="secondary" className="bg-orange-100 text-orange-700">退款中</Badge>;
        case 'refunded': return <Badge className="bg-pink-100 text-pink-700">已退款</Badge>;
        case 'return_requested': return <Badge variant="secondary" className="bg-purple-100 text-purple-700">退货申请中</Badge>;
        case 'return_approved': return <Badge className="bg-purple-100 text-purple-700">退货已批准</Badge>;
        case 'return_completed': return <Badge className="bg-purple-100 text-purple-700">退货已完成</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const handleMarkAsShipped = () => {
    if (order.status === 'processing' || order.status === 'paid') {
        if (!trackingNumberInput.trim()) {
            toast({ title: "请输入运单号", variant: "destructive" });
            return;
        }
        onUpdateStatus(order.id, 'shipped', trackingNumberInput);
        toast({ title: "订单已标记发货", description: `订单 ${order.orderNumber} 已更新为“已发货”，运单号: ${trackingNumberInput}`});
    }
  };

  const getSalespersonName = (employeeId?: string) => {
    if (!employeeId || !employeesData) return 'N/A';
    return employeesData.find(e => e.id === employeeId)?.name || '未知员工';
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>订单详情: {order.orderNumber}</DialogTitle>
          <DialogDescription>
            查看订单的详细信息和处理订单。
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-3">
            <div className="space-y-4 py-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><p><strong>订单ID:</strong> <span className="font-mono text-xs">{order.id}</span></p></div>
                    <div><p><strong>所属企业:</strong> {enterprise?.name || order.enterpriseId}</p></div>
                    <div><p><strong>客户名称:</strong> {order.customerName || order.customerId}</p></div>
                    <div><p><strong>客户联系:</strong> {order.customerContact || 'N/A'}</p></div>
                    <div><p><strong>下单时间:</strong> {format(parseISO(order.orderDate), 'yyyy-MM-dd HH:mm:ss')}</p></div>
                    <div className="flex items-center">
                        <strong className="mr-1">订单状态:</strong>
                        {getOrderStatusBadge(order.status)}
                    </div>
                     {(order.salespersonEmployeeId || order.salespersonName) && (
                        <div>
                            <p className="flex items-center">
                                <Users className="h-4 w-4 mr-1 text-muted-foreground"/>
                                <strong>销售人员:</strong>
                                <span className="ml-1">{order.salespersonName || getSalespersonName(order.salespersonEmployeeId)}</span>
                            </p>
                        </div>
                     )}
                </div>

                <h4 className="font-semibold mt-4 mb-2 text-base">商品列表:</h4>
                <Table>
                    <TableHeader><TableRow><TableHead>商品</TableHead><TableHead className="text-center">数量</TableHead><TableHead className="text-right">单价</TableHead><TableHead className="text-right">小计</TableHead></TableRow></TableHeader>
                    <TableBody>
                    {order.products.map((item, index) => (
                        <TableRow key={index}>
                        <TableCell>
                            <div className="flex items-center">
                                <Package className="h-4 w-4 mr-2 text-muted-foreground"/>
                                <span>{item.productName}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">¥{item.priceAtOrder.toFixed(2)}</TableCell>
                        <TableCell className="text-right">¥{(item.quantity * item.priceAtOrder).toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                <p className="text-right font-semibold mt-2">订单总金额: ¥{order.totalAmount.toFixed(2)}</p>

                <h4 className="font-semibold mt-4 mb-2 text-base">配送与支付:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><p><strong>支付方式:</strong> {order.paymentMethod || 'N/A'}</p></div>
                    {order.paymentTransactionId && <div><p><strong>支付交易号:</strong> {order.paymentTransactionId}</p></div>}
                    <div className="md:col-span-2">
                        <p><strong>配送地址:</strong></p>
                        {order.shippingAddress ? (
                            <div className="pl-2 text-xs bg-muted/30 p-2 rounded-md mt-1">
                                <p className="flex items-center"><UserCircle className="h-3 w-3 mr-1"/>{order.shippingAddress.recipientName}, {order.shippingAddress.phone}</p>
                                <p>{order.shippingAddress.province} {order.shippingAddress.city} {order.shippingAddress.addressLine1}</p>
                                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                <p>邮编: {order.shippingAddress.postalCode}</p>
                            </div>
                        ) : <p className="pl-2 text-xs">未提供</p>}
                    </div>
                    <div><p><strong>配送方式:</strong> {order.shippingMethod || 'N/A'}</p></div>
                    {order.shippingFee !== undefined && <div><p><strong>运费:</strong> ¥{order.shippingFee.toFixed(2)}</p></div>}
                    <div><p><strong>运单号:</strong> {order.trackingNumber || (order.status === 'shipped' || order.status === 'delivered' || order.status === 'completed' ? '处理中' : '未发货')}</p></div>
                    {order.carrier && <div><p><strong>承运商:</strong> {order.carrier}</p></div>}
                </div>

                {order.notes && <div className="mt-3"><p><strong>订单备注:</strong> <span className="whitespace-pre-wrap p-2 bg-muted/30 rounded-md block mt-1 text-xs">{order.notes}</span></p></div>}
                
                <div className="mt-6 pt-4 border-t">
                    <h4 className="font-semibold mb-2 text-base">订单操作:</h4>
                     {(order.status === 'processing' || order.status === 'paid') && (
                        <Card className="p-3 mb-3 border-blue-200 bg-blue-50">
                            <Label htmlFor="trackingNumberInput" className="text-sm font-medium block mb-1">输入运单号并标记发货:</Label>
                            <div className="flex items-center gap-2">
                                <Input id="trackingNumberInput" value={trackingNumberInput} onChange={(e) => setTrackingNumberInput(e.target.value)} placeholder="输入运单号" className="h-9 text-sm"/>
                                <Button size="sm" onClick={handleMarkAsShipped} variant="default" className="bg-blue-500 hover:bg-blue-600">
                                    <Truck className="mr-1 h-4 w-4"/>标记为已发货
                                </Button>
                            </div>
                        </Card>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {(order.status === 'paid' && order.status !== 'processing') && (
                            <Button size="sm" onClick={() => onUpdateStatus(order.id, 'processing')}>确认订单 (转处理中)</Button>
                        )}
                        {(order.status !== 'cancelled_user' && order.status !== 'cancelled_admin' && order.status !== 'completed' && order.status !== 'refunded' && order.status !== 'shipped' && order.status !== 'delivered') && (
                            <Button size="sm" variant="destructive" onClick={() => onUpdateStatus(order.id, 'cancelled_admin')}>取消订单</Button>
                        )}
                         <Button size="sm" variant="outline" onClick={() => toast({ title: "提示", description: "处理售后功能开发中。" })}>处理售后</Button>
                         <Button size="sm" variant="outline" onClick={() => toast({ title: "提示", description: "打印发货单功能开发中。" })}>
                            <FileText className="mr-1 h-4 w-4"/>打印发货单
                         </Button>
                    </div>
                </div>
            </div>
        </ScrollArea>
        <DialogFooter className="mt-2">
          <Button type="button" variant="outline" onClick={onClose}>关闭</Button>
        </DialogFooter>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}

    