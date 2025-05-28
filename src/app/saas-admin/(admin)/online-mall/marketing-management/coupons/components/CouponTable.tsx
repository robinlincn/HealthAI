
'use client';

import type { SaasCoupon } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, PlayCircle, PauseCircle, CheckCircle, Clock, Ticket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

interface CouponTableProps {
  coupons: SaasCoupon[];
  onEdit: (coupon: SaasCoupon) => void;
  onDelete: (couponId: string) => void;
  onToggleStatus: (couponId: string) => void;
}

export function CouponTable({ coupons, onEdit, onDelete, onToggleStatus }: CouponTableProps) {

  const getCouponTypeText = (type: SaasCoupon['type']) => {
    const map = {
      fixed_amount: '固定金额',
      percentage: '百分比折扣'
    };
    return map[type] || type;
  };
  
  const getStatusBadge = (status: SaasCoupon['status']) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1"/>有效</Badge>;
      case 'inactive': return <Badge variant="outline"><PauseCircle className="h-3 w-3 mr-1"/>未激活</Badge>;
      case 'expired': return <Badge variant="secondary" className="bg-gray-100 text-gray-700"><Clock className="h-3 w-3 mr-1"/>已过期</Badge>;
      case 'used_up': return <Badge variant="secondary" className="bg-orange-100 text-orange-700"><CheckCircle className="h-3 w-3 mr-1"/>已用完</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (coupons.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">暂无优惠券。请添加新优惠券。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>优惠券名称</TableHead>
            <TableHead>券码</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>面值/折扣</TableHead>
            <TableHead>有效期</TableHead>
            <TableHead>状态</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell className="font-medium">{coupon.name}</TableCell>
              <TableCell className="font-mono text-xs">{coupon.code}</TableCell>
              <TableCell><Badge variant="outline" className="capitalize"><Ticket className="h-3 w-3 mr-1"/>{getCouponTypeText(coupon.type)}</Badge></TableCell>
              <TableCell>{coupon.type === 'fixed_amount' ? `¥${coupon.value.toFixed(2)}` : `${(coupon.value * 100).toFixed(0)}%`}</TableCell>
              <TableCell className="text-xs">{format(parseISO(coupon.validFrom), 'yy-MM-dd')} 至 {format(parseISO(coupon.validTo), 'yy-MM-dd')}</TableCell>
              <TableCell>{getStatusBadge(coupon.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                       <span className="sr-only">操作</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(coupon)}>
                      <Edit className="mr-2 h-4 w-4" />编辑
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onToggleStatus(coupon.id)} disabled={coupon.status === 'expired' || coupon.status === 'used_up'}>
                      {coupon.status === 'active' ? <PauseCircle className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                      {coupon.status === 'active' ? '停用' : '激活'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(coupon.id)} className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {coupons.length > 5 && (
            <TableCaption>共 {coupons.length} 条优惠券记录。</TableCaption>
        )}
      </Table>
    </div>
  );
}

    