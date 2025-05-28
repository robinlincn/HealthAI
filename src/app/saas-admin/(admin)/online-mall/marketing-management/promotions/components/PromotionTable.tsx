
'use client';

import type { SaasPromotion, SaasEnterprise } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, PlayCircle, PauseCircle, CheckCircle, Clock, Briefcase, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

interface PromotionTableProps {
  promotions: SaasPromotion[];
  enterprises: SaasEnterprise[];
  onEdit: (promotion: SaasPromotion) => void;
  onDelete: (promotionId: string) => void;
  onToggleStatus: (promotionId: string) => void;
}

export function PromotionTable({ promotions, enterprises, onEdit, onDelete, onToggleStatus }: PromotionTableProps) {

  const getEnterpriseName = (enterpriseId?: string) => {
    if (!enterpriseId) return '平台通用';
    return enterprises.find(e => e.id === enterpriseId)?.name || '未知企业';
  };

  const getPromotionTypeText = (type: SaasPromotion['type']) => {
    const map = {
      full_reduction: '满减',
      discount: '折扣',
      buy_x_get_y: '买赠',
      limited_time_offer: '限时特惠'
    };
    return map[type] || type;
  };
  
  const getStatusBadge = (status: SaasPromotion['status']) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1"/>进行中</Badge>;
      case 'inactive': return <Badge variant="outline"><PauseCircle className="h-3 w-3 mr-1"/>未激活</Badge>;
      case 'scheduled': return <Badge className="bg-blue-100 text-blue-700"><Clock className="h-3 w-3 mr-1"/>待开始</Badge>;
      case 'expired': return <Badge variant="secondary" className="bg-gray-100 text-gray-700"><Clock className="h-3 w-3 mr-1"/>已结束</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (promotions.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">暂无促销活动。请添加新活动。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>活动名称</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>所属企业</TableHead>
            <TableHead>开始时间</TableHead>
            <TableHead>结束时间</TableHead>
            <TableHead>状态</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promo) => (
            <TableRow key={promo.id}>
              <TableCell className="font-medium">{promo.name}</TableCell>
              <TableCell><Badge variant="outline" className="capitalize"><Tag className="h-3 w-3 mr-1"/>{getPromotionTypeText(promo.type)}</Badge></TableCell>
              <TableCell className="text-xs">
                <span className="inline-flex items-center">
                  <Briefcase className="h-3 w-3 mr-1 text-muted-foreground"/>
                  {getEnterpriseName(promo.enterpriseId)}
                </span>
              </TableCell>
              <TableCell>{format(parseISO(promo.startDate), 'yyyy-MM-dd HH:mm')}</TableCell>
              <TableCell>{promo.endDate ? format(parseISO(promo.endDate), 'yyyy-MM-dd HH:mm') : '长期有效'}</TableCell>
              <TableCell>{getStatusBadge(promo.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                       <span className="sr-only">操作</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(promo)}>
                      <Edit className="mr-2 h-4 w-4" />编辑活动
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(promo.id)}>
                      {promo.status === 'active' ? <PauseCircle className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                      {promo.status === 'active' ? '暂停' : '激活'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(promo.id)} className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />删除活动
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {promotions.length > 5 && (
            <TableCaption>共 {promotions.length} 条促销活动记录。</TableCaption>
        )}
      </Table>
    </div>
  );
}

    