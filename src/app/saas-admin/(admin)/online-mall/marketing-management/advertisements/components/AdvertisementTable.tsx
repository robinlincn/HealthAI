
'use client';

import type { SaasAdvertisement } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, PlayCircle, PauseCircle, CheckCircle, Clock, ExternalLink, ImageIcon, VideoIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';

interface AdvertisementTableProps {
  advertisements: SaasAdvertisement[];
  onEdit: (ad: SaasAdvertisement) => void;
  onDelete: (adId: string) => void;
  onToggleStatus: (adId: string) => void;
}

export function AdvertisementTable({ advertisements, onEdit, onDelete, onToggleStatus }: AdvertisementTableProps) {

  const getStatusBadge = (status: SaasAdvertisement['status']) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1"/>投放中</Badge>;
      case 'inactive': return <Badge variant="outline"><PauseCircle className="h-3 w-3 mr-1"/>已暂停</Badge>;
      case 'scheduled': return <Badge className="bg-blue-100 text-blue-700"><Clock className="h-3 w-3 mr-1"/>待投放</Badge>;
      case 'expired': return <Badge variant="secondary" className="bg-gray-100 text-gray-700"><Clock className="h-3 w-3 mr-1"/>已结束</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getAdTypeIcon = (type: SaasAdvertisement['type']) => {
    if (type === 'image') return <ImageIcon className="h-4 w-4 text-muted-foreground"/>;
    if (type === 'video') return <VideoIcon className="h-4 w-4 text-muted-foreground"/>;
    return <span className="text-xs">{type}</span>;
  };

  if (advertisements.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">暂无广告。请添加新广告。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">预览</TableHead>
            <TableHead>广告名称</TableHead>
            <TableHead>广告位</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>投放时间</TableHead>
            <TableHead>状态</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {advertisements.map((ad) => (
            <TableRow key={ad.id}>
              <TableCell>
                {ad.type === 'image' && ad.assetUrl ? (
                    <Image src={ad.assetUrl} alt={ad.name} width={50} height={30} className="rounded object-contain aspect-[16/9] bg-muted" data-ai-hint="advertisement visual"/>
                ) : (
                    <div className="h-[30px] w-[50px] bg-muted rounded flex items-center justify-center">{getAdTypeIcon(ad.type)}</div>
                )}
              </TableCell>
              <TableCell className="font-medium">{ad.name}</TableCell>
              <TableCell className="text-xs">{ad.adSlotId}</TableCell>
              <TableCell className="text-xs">{ad.type}</TableCell>
              <TableCell className="text-xs">
                {format(parseISO(ad.startDate), 'yy-MM-dd')}
                {ad.endDate ? ` 至 ${format(parseISO(ad.endDate), 'yy-MM-dd')}` : ' (持续)'}
              </TableCell>
              <TableCell>{getStatusBadge(ad.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(ad)}>
                      <Edit className="mr-2 h-4 w-4" />编辑
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onToggleStatus(ad.id)} disabled={ad.status === 'expired'}>
                      {ad.status === 'active' ? <PauseCircle className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                      {ad.status === 'active' ? '暂停' : '投放'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open(ad.linkUrl, '_blank')} disabled={!ad.linkUrl}>
                      <ExternalLink className="mr-2 h-4 w-4" />预览链接
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(ad.id)} className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {advertisements.length > 5 && (
            <TableCaption>共 {advertisements.length} 条广告记录。</TableCaption>
        )}
      </Table>
    </div>
  );
}

    