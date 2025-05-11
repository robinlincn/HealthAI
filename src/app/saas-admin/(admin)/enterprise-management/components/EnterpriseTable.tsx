
'use client';

import type { SaasEnterprise } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface EnterpriseTableProps {
  enterprises: SaasEnterprise[];
  onEdit: (enterprise: SaasEnterprise) => void;
  onDelete: (enterpriseId: string) => void;
  onViewDetails?: (enterpriseId: string) => void; 
  onToggleStatus: (enterpriseId: string, currentStatus: SaasEnterprise['status']) => void; 
}

export function EnterpriseTable({ enterprises, onEdit, onDelete, onViewDetails, onToggleStatus }: EnterpriseTableProps) {
  const getStatusChip = (status: SaasEnterprise['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full inline-flex items-center"><ToggleRight className="h-3 w-3 mr-1"/>已激活</span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full inline-flex items-center"><ToggleLeft className="h-3 w-3 mr-1"/>未激活</span>;
      case 'pending_approval':
        return <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full inline-flex items-center"><AlertTriangle className="h-3 w-3 mr-1"/>待审批</span>;
      case 'suspended':
        return <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full inline-flex items-center"><AlertTriangle className="h-3 w-3 mr-1"/>已暂停</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">{status}</span>;
    }
  };

  if (enterprises.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">暂无企业数据。请添加新企业。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>企业名称</TableHead>
            <TableHead>联系人</TableHead>
            <TableHead>联系邮箱</TableHead>
            <TableHead>联系电话</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>创建日期</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enterprises.map((enterprise) => (
            <TableRow key={enterprise.id}>
              <TableCell className="font-medium">{enterprise.name}</TableCell>
              <TableCell>{enterprise.contactPerson}</TableCell>
              <TableCell>{enterprise.contactEmail}</TableCell>
              <TableCell>{enterprise.contactPhone}</TableCell>
              <TableCell>{getStatusChip(enterprise.status)}</TableCell>
              <TableCell>{format(new Date(enterprise.creationDate), 'yyyy-MM-dd')}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                       <span className="sr-only">操作</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onViewDetails && (
                         <DropdownMenuItem onClick={() => onViewDetails(enterprise.id)} disabled>
                            <Eye className="mr-2 h-4 w-4" />查看详情
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onEdit(enterprise)}>
                      <Edit className="mr-2 h-4 w-4" />编辑
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => onToggleStatus(enterprise.id, enterprise.status)}>
                        {enterprise.status === 'active' || enterprise.status === 'pending_approval' ? <ToggleRight className="mr-2 h-4 w-4" /> : <ToggleLeft className="mr-2 h-4 w-4" />}
                        切换状态
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(enterprise.id)} className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {enterprises.length > 5 && (
            <TableCaption>共 {enterprises.length} 条企业记录。</TableCaption>
        )}
      </Table>
    </div>
  );
}
