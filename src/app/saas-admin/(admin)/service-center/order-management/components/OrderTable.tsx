
'use client';

import type { SaasOrder, SaasEnterprise, SaasServicePackage } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Receipt, RefreshCcw } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface OrderTableProps {
  orders: SaasOrder[];
  enterprises: SaasEnterprise[];
  servicePackages: SaasServicePackage[];
  onViewDetails: (order: SaasOrder) => void;
  onEditStatus?: (order: SaasOrder) => void; // Optional: For future status editing
}

export function OrderTable({ orders, enterprises, servicePackages, onViewDetails, onEditStatus }: OrderTableProps) {

  const getEnterpriseName = (enterpriseId: string) => {
    return enterprises.find(e => e.id === enterpriseId)?.name || '未知企业';
  };

  const getServicePackageName = (packageId: string) => {
    return servicePackages.find(p => p.id === packageId)?.name || '未知服务包';
  };
  
  const getPaymentStatusBadge = (status: SaasOrder['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">已支付</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">待支付</Badge>;
      case 'failed':
        return <Badge variant="destructive">支付失败</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="text-gray-600 border-gray-400">已退款</Badge>;
      case 'processing':
        return <Badge variant="outline" className="text-blue-600 border-blue-400">处理中</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getBillingCycleText = (cycle: SaasOrder['billingCycle']) => {
    const map = {
      'monthly': '月度',
      'annually': '年度',
      'one-time': '一次性'
    };
    return map[cycle] || cycle;
  };


  if (orders.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">暂无订单数据。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>订单ID</TableHead>
            <TableHead>企业名称</TableHead>
            <TableHead>服务包</TableHead>
            <TableHead>订单日期</TableHead>
            <TableHead>金额 (元)</TableHead>
            <TableHead>支付状态</TableHead>
            <TableHead>周期</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs">{order.id}</TableCell>
              <TableCell className="font-medium">{order.enterpriseName || getEnterpriseName(order.enterpriseId)}</TableCell>
              <TableCell>{order.servicePackageName || getServicePackageName(order.servicePackageId)}</TableCell>
              <TableCell>{format(parseISO(order.orderDate), 'yyyy-MM-dd')}</TableCell>
              <TableCell>¥{order.amount.toFixed(2)}</TableCell>
              <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
              <TableCell>{getBillingCycleText(order.billingCycle)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                       <span className="sr-only">操作</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(order)}>
                      <Eye className="mr-2 h-4 w-4" />查看详情
                    </DropdownMenuItem>
                    {onEditStatus && order.paymentStatus === 'pending' && (
                       <DropdownMenuItem onClick={() => onEditStatus(order)} disabled> {/* Disabled for now */}
                          <RefreshCcw className="mr-2 h-4 w-4" />更新支付状态
                      </DropdownMenuItem>
                    )}
                     <DropdownMenuItem disabled>
                      <Receipt className="mr-2 h-4 w-4" />查看发票
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {orders.length > 5 && (
            <TableCaption>共 {orders.length} 条订单记录。</TableCaption>
        )}
      </Table>
    </div>
  );
}
