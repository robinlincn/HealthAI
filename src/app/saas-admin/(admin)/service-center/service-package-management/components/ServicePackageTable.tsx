
'use client';

import type { SaasServicePackage } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, CheckCircle, XCircle, ListChecks } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ServicePackageTableProps {
  packages: SaasServicePackage[];
  onEdit: (pkg: SaasServicePackage) => void;
  onDelete: (packageId: string) => void;
  onToggleStatus: (packageId: string) => void;
}

export function ServicePackageTable({ packages, onEdit, onDelete, onToggleStatus }: ServicePackageTableProps) {

  const packageTypeMap = {
    basic: '基础版',
    standard: '标准版',
    premium: '高级版',
    custom: '自定义',
  };

  if (packages.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">暂无服务包数据。请添加新服务包。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名称</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>月度价格 (元)</TableHead>
            <TableHead>启用状态</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.map((pkg) => (
            <TableRow key={pkg.id}>
              <TableCell className="font-medium">{pkg.name}</TableCell>
              <TableCell>
                <Badge variant={pkg.type === 'premium' ? 'default' : (pkg.type === 'custom' ? 'destructive': 'secondary') } className="capitalize">
                  {packageTypeMap[pkg.type] || pkg.type}
                </Badge>
              </TableCell>
              <TableCell>¥{pkg.priceMonthly.toFixed(2)}</TableCell>
              <TableCell>
                {pkg.isEnabled ? 
                  <span className="inline-flex items-center text-green-600"><CheckCircle className="h-4 w-4 mr-1"/>已启用</span> : 
                  <span className="inline-flex items-center text-muted-foreground"><XCircle className="h-4 w-4 mr-1"/>已禁用</span>
                }
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                       <span className="sr-only">操作</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={() => onEdit(pkg)}> {/* Placeholder for future detail view */}
                       <ListChecks className="mr-2 h-4 w-4" />查看详情/编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(pkg.id)}>
                      {pkg.isEnabled ? <XCircle className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                      {pkg.isEnabled ? '禁用' : '启用'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(pkg.id)} className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {packages.length > 5 && (
            <TableCaption>共 {packages.length} 条服务包记录。</TableCaption>
        )}
      </Table>
    </div>
  );
}
