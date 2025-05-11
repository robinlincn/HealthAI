
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import type { SaasOrder, SaasEnterprise, SaasServicePackage } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OrderDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: SaasOrder | null;
  enterprise?: SaasEnterprise | null; // Optional, if passed can display name directly
  servicePackage?: SaasServicePackage | null; // Optional
}

export function OrderDetailDialog({ isOpen, onClose, order, enterprise, servicePackage }: OrderDetailDialogProps) {
  
  if (!isOpen || !order) return null;

  const getPaymentStatusBadge = (status: SaasOrder['paymentStatus']) => {
    // Same as in OrderTable, could be refactored into a helper
    switch (status) {
      case 'paid': return <Badge variant="default" className="bg-green-500 hover:bg-green-600">已支付</Badge>;
      case 'pending': return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">待支付</Badge>;
      case 'failed': return <Badge variant="destructive">支付失败</Badge>;
      case 'refunded': return <Badge variant="outline" className="text-gray-600 border-gray-400">已退款</Badge>;
      case 'processing': return <Badge variant="outline" className="text-blue-600 border-blue-400">处理中</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getBillingCycleText = (cycle: SaasOrder['billingCycle']) => {
    const map = { 'monthly': '月度', 'annually': '年度', 'one-time': '一次性' };
    return map[cycle] || cycle;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>订单详情: {order.id}</DialogTitle>
          <DialogDescription>
            查看订单的详细信息。
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-3">
            <div className="space-y-3 text-sm py-4">
            <p><strong>订单ID:</strong> <span className="font-mono">{order.id}</span></p>
            <p><strong>企业名称:</strong> {enterprise?.name || order.enterpriseName || '加载中...'}</p>
            <p><strong>服务包:</strong> {servicePackage?.name || order.servicePackageName || '加载中...'}</p>
            <p><strong>订单日期:</strong> {format(parseISO(order.orderDate), 'yyyy-MM-dd HH:mm:ss')}</p>
            <p><strong>订单金额:</strong> ¥{order.amount.toFixed(2)} ({order.currency})</p>
            <p><strong>支付状态:</strong> {getPaymentStatusBadge(order.paymentStatus)}</p>
            <p><strong>计费周期:</strong> {getBillingCycleText(order.billingCycle)}</p>
            {order.transactionId && <p><strong>交易ID:</strong> {order.transactionId}</p>}
            {order.renewalDate && <p><strong>下次续费日期:</strong> {format(parseISO(order.renewalDate), 'yyyy-MM-dd')}</p>}
            {order.invoiceNumber && <p><strong>发票号:</strong> {order.invoiceNumber}</p>}
            {order.notes && <p><strong>备注:</strong> <span className="whitespace-pre-wrap">{order.notes}</span></p>}
            </div>
        </ScrollArea>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>关闭</Button>
        </DialogFooter>
        <DialogClose asChild><button type="button" className="sr-only">Close</button></DialogClose>
      </DialogContent>
    </Dialog>
  );
}
