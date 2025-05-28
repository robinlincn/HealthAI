
'use client';

import type { SaasMallOrder, SaasEnterprise, SaasEmployee } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Truck, Package, Briefcase, UserCircle, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface MallOrderTableProps {
  orders: SaasMallOrder[];
  enterprises: SaasEnterprise[];
  employees: SaasEmployee[];
  onViewDetails: (order: SaasMallOrder) => void;
  onUpdateStatus: (orderId: string, newStatus: SaasMallOrder['status']) => void;
}

export function MallOrderTable({ orders, enterprises, employees, onViewDetails, onUpdateStatus }: MallOrderTableProps) {

  const getEnterpriseName = (enterpriseId: string) => {
    return enterprises.find(e => e.id === enterpriseId)?.name || 'N/A';
  };

  const getSalespersonName = (employeeId?: string) => {
    if (!employeeId) return 'N/A';
    return employees.find(e => e.id === employeeId)?.name || '未知员工';
  };

  const getOrderStatusBadge = (status: SaasMallOrder['status']) => {
    switch (status) {
      case 'pending_payment': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">待支付</Badge>;
      case 'paid': return <Badge className="bg-blue-100 text-blue-700">已支付</Badge>;
      case 'processing': return <Badge className="bg-sky-100 text-sky-700">处理中</Badge>;
      case 'shipped': return <Badge className="bg-indigo-100 text-indigo-700">已发货</Badge>;
      case 'delivered': return <Badge className="bg-teal-100 text-teal-700">已送达</Badge>;
      case 'completed': return <Badge className="bg-green-100 text-green-700">已完成</Badge>;
      case 'cancelled_user':
      case 'cancelled_admin': return <Badge variant="outline" className="text-gray-600">已取消</Badge>;
      case 'refund_pending': return <Badge variant="secondary" className="bg-orange-100 text-orange-700">退款中</Badge>;
      case 'refunded': return <Badge className="bg-pink-100 text-pink-700">已退款</Badge>;
      case 'return_requested': return <Badge variant="secondary" className="bg-purple-100 text-purple-700">退货申请中</Badge>;
      case 'return_approved': return <Badge className="bg-purple-100 text-purple-700">退货已批准</Badge>;
      case 'return_completed': return <Badge className="bg-purple-100 text-purple-700">退货已完成</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (orders.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">暂无商城订单数据。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow><TableHead>订单号</TableHead><TableHead>客户名称</TableHead><TableHead>所属企业</TableHead><TableHead>销售人员</TableHead><TableHead>总金额</TableHead><TableHead>订单状态</TableHead><TableHead>下单时间</TableHead><TableHead className="text-right">操作</TableHead></TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs">{order.orderNumber}</TableCell>
              <TableCell>
                <span className="inline-flex items-center">
                  <UserCircle className="h-4 w-4 mr-1.5 text-muted-foreground"/>
                  {order.customerName || order.customerId}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center text-xs">
                  <Briefcase className="h-3.5 w-3.5 mr-1 text-muted-foreground"/>
                  {getEnterpriseName(order.enterpriseId)}
                </span>
              </TableCell>
              <TableCell className="text-xs">
                {order.salespersonEmployeeId ? (
                  <span className="inline-flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground"/>
                    {order.salespersonName || getSalespersonName(order.salespersonEmployeeId)}
                  </span>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>¥{order.totalAmount.toFixed(2)}</TableCell>
              <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
              <TableCell>{format(parseISO(order.orderDate), 'yyyy-MM-dd HH:mm')}</TableCell>
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
                    {order.status === 'paid' && (
                      <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'processing')}>
                        <Package className="mr-2 h-4 w-4" />标记为处理中
                      </DropdownMenuItem>
                    )}
                    {order.status === 'processing' && (
                      <DropdownMenuItem onClick={() => onUpdateStatus(order.id, 'shipped')}>
                        <Truck className="mr-2 h-4 w-4" />标记为已发货
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {orders.length > 5 && (
            <TableCaption>共 {orders.length} 条商城订单记录。</TableCaption>
        )}
      </Table>
    </div>
  );
}
    