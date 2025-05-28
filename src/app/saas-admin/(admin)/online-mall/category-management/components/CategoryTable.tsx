
'use client';

import type { SaasProductCategory } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Package } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface CategoryTableProps {
  categories: SaasProductCategory[];
  onEdit: (category: SaasProductCategory) => void;
  onDelete: (categoryId: string) => void;
}

export function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {

  if (categories.length === 0) {
    return <div className="text-center text-muted-foreground py-8 border border-dashed rounded-md">暂无商品分类数据。请添加新分类。</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>分类名称</TableHead>
            <TableHead>描述</TableHead>
            <TableHead>商品数量</TableHead>
            <TableHead>创建日期</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-md truncate" title={category.description}>{category.description || '-'}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  <Package className="h-3.5 w-3.5 mr-1.5"/> {category.productCount || 0}
                </Badge>
              </TableCell>
              <TableCell>{format(parseISO(category.creationDate), 'yyyy-MM-dd')}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                       <span className="sr-only">操作</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(category)}>
                      <Edit className="mr-2 h-4 w-4" />编辑分类
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(category.id)} className="text-destructive hover:!bg-destructive/10 hover:!text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />删除分类
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
         {categories.length > 5 && (
            <TableCaption>共 {categories.length} 条商品分类记录。</TableCaption>
        )}
      </Table>
    </div>
  );
}
